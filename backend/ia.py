import json
import ast
import re
import requests
from sentence_transformers import SentenceTransformer, util
from sqlalchemy.orm import Session
import models
import random

model = SentenceTransformer('all-MiniLM-L6-v2')

# Fonction qui interroge Ollama localement pour extraire les prestations à partir d'un prompt
# Retourne une liste de prestations, ou lève une Exception explicite si échec

def extract_prestations_llm(prompt: str, db: Session):
    # Récupérer dynamiquement les métiers depuis la base
    categories = db.query(models.CategorieMetier).all()
    if not categories:
        raise RuntimeError("Aucune catégorie de métier n'est présente en base. Veuillez initialiser les catégories avant d'utiliser le LLM.")
    metiers = [cat.nom for cat in categories]
    metiers_str = ', '.join(f'"{m}"' for m in metiers)
    # Construction du prompt (on ne donne plus la liste des prestations)
    prompt_llm = (
        f"Tu es un assistant expert en gestion de projet de construction. "
        f"Pour la demande suivante : '{prompt}', "
        f"donne uniquement une liste Python de tuples (prestation, métier) où chaque prestation est associée à son corps de métier principal. "
        f"Le métier doit obligatoirement être choisi dans la liste suivante : [{metiers_str}]. "
        f"Format attendu : [(\"prestation 1\", \"métier 1\"), (\"prestation 2\", \"métier 2\"), ...] "
        f"Réponds uniquement par la liste Python, sans texte ni explication, ni markdown, ni numérotation."
    )
    url = "http://ollama:11434/api/generate"
    payload = {
        "model": "mistral",
        "prompt": prompt_llm
    }
    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        lines = response.text.strip().splitlines()
        full_text = ""
        for line in lines:
            try:
                data = json.loads(line)
                if 'response' in data:
                    full_text += data['response']
            except Exception:
                continue
        print(f"[DEBUG] Texte reconstitué : {full_text}")

        # Extraction stricte d'une liste Python de tuples
        # On cherche la première [ et la dernière ] pour extraire la liste
        start = full_text.find('[')
        end = full_text.rfind(']')
        if start != -1 and end != -1:
            liste_str = full_text[start:end+1]
            try:
                prestations = ast.literal_eval(liste_str)
                if isinstance(prestations, list) and all(isinstance(x, tuple) and len(x) == 2 for x in prestations):
                    return [(str(p).strip(), str(m).strip()) for p, m in prestations]
            except Exception as e:
                print(f"[ERROR] Echec literal_eval : {e} sur {liste_str}")
                # Fallback 1 : liste de strings représentant des tuples
                try:
                    prestations_strs = ast.literal_eval(liste_str)
                    if isinstance(prestations_strs, list) and all(isinstance(x, str) for x in prestations_strs):
                        prestations = [ast.literal_eval(x) for x in prestations_strs]
                        if all(isinstance(x, tuple) and len(x) == 2 for x in prestations):
                            return [(str(p).strip(), str(m).strip()) for p, m in prestations]
                    # Fallback 2 : liste contenant une seule string qui concatène tous les tuples
                    if isinstance(prestations_strs, list) and len(prestations_strs) == 1 and isinstance(prestations_strs[0], str):
                        try:
                            prestations = ast.literal_eval(f"[{prestations_strs[0]})]")
                            if isinstance(prestations, list) and all(isinstance(x, tuple) and len(x) == 2 for x in prestations):
                                return [(str(p).strip(), str(m).strip()) for p, m in prestations]
                        except Exception as e3:
                            print(f"[ERROR] Echec fallback parsing string unique : {e3} sur {prestations_strs[0]}")
                except Exception as e2:
                    print(f"[ERROR] Echec fallback parsing liste de strings : {e2} sur {liste_str}")
        # Si on arrive ici, c'est que le parsing a échoué
        raise ValueError(f"Impossible d'extraire une liste de tuples (prestation, métier). Texte généré : {full_text}")

    except requests.exceptions.ConnectionError:
        raise RuntimeError("Ollama n'est pas lancé ou inaccessible sur http://host.docker.internal:11434. Lancez 'ollama serve' sur votre machine hôte.")
    except requests.exceptions.Timeout:
        raise RuntimeError("La requête à Ollama a dépassé le temps imparti (timeout).")
    except Exception as e:
        raise RuntimeError(f"Erreur lors de l'appel à Ollama ou parsing de la réponse : {e}")

# Génère 3 plans/scénarios à partir d'une liste de prestations
# Plan 1 : éco (moins de prestations), Plan 2 : équilibré, Plan 3 : premium (toutes prestations)
def generate_plans(prestations_base):
    n = len(prestations_base)
    plans = [
        prestations_base[:max(3, n//4)],   # plan éco : 3 à n/4 prestations
        prestations_base[:max(5, n//2)],   # plan équilibré : 5 à n/2 prestations
        prestations_base,                  # plan premium : toutes les prestations
    ]
    return plans

def find_best_prestataires(db: Session, prompt: str, top_k: int = 3):
    # 1. Découpage de la demande en prestations via LLM
    try:
        prestations_base = extract_prestations_llm(prompt, db)
    except Exception as e:
        return {"error": str(e)}
    if not prestations_base or len(prestations_base) == 0:
        return {"error": "Aucune prestation extraite de la demande"}

    # Pour chaque prestation, on prépare la liste des matches (prestataires/prestations) possibles
    prestations_matches = []
    for prestation_nom, metier in prestations_base:
        cat = db.query(models.CategorieMetier).filter(models.CategorieMetier.nom.ilike(metier)).first()
        if not cat:
            prestations_matches.append({
                "titre": prestation_nom,
                "metier": metier,
                "matches": []
            })
            continue
        all_prestations = db.query(models.Prestation).filter(models.Prestation.categorie_metier_id == cat.id).all()
        if not all_prestations:
            prestations_matches.append({
                "titre": prestation_nom,
                "metier": metier,
                "matches": []
            })
            continue
        # Matching sémantique systématique (sur toute la base de la catégorie)
        emb_prest = model.encode(prestation_nom, convert_to_tensor=True)
        prestations_texts = [f"{p.titre} {p.description or ''}" for p in all_prestations]
        prestations_emb = model.encode(prestations_texts, convert_to_tensor=True)
        scores = util.pytorch_cos_sim(emb_prest, prestations_emb)[0]
        scored = list(zip(all_prestations, scores.tolist()))
        scored.sort(key=lambda x: x[1], reverse=True)
        if not scored:
            prestations_matches.append({
                "titre": prestation_nom,
                "metier": metier,
                "matches": []
            })
            continue
        # On prend TOUTES les prestations de la catégorie, pas juste le top 3
        matches = []
        for p, score in scored:
            prest = db.query(models.Prestataire).filter(models.Prestataire.id == p.prestataire_id).first()
            matches.append({
                "prestataire": {
                    "id": prest.id,
                    "nom": prest.nom,
                    "description": prest.description,
                    "email": prest.email,
                    "telephone": prest.telephone,
                    "note": prest.note,
                },
                "prestation": {
                    "id": p.id,
                    "titre": p.titre,
                    "description": p.description,
                    "prix": p.prix,
                    "duree_estimee": p.duree_estimee,
                },
                "score": score  # Ajout du score de similarité
            })
        # Ajoute systématiquement la prestation du LLM, matches vide si aucun match
        prestations_matches.append({
            "titre": prestation_nom,
            "metier": metier,
            "matches": matches
        })

    # Génération des 3 plans
    plans = []
    coeff_critere = 0.3  # pondération critère plan
    coeff_semantique = 0.7   # pondération similarité sémantique

    # Plan 1 : le moins cher possible (éco)
    plan1_prestations = []
    budget1_min = 0
    budget1_max = 0
    duree1_min = 0
    duree1_max = 0
    for pm in prestations_matches:
        matches = pm["matches"]
        if not matches:
            plan1_prestations.append({**pm, "matches": []})
            continue
        # Normalisation du score sémantique
        sem_scores = [m["score"] for m in matches]
        min_sem, max_sem = min(sem_scores), max(sem_scores)
        def norm_sem(s):
            return (s - min_sem) / (max_sem - min_sem) if max_sem > min_sem else 1.0
        # Score composite : prix + similarité
        for m in matches:
            prix = m["prestation"]["prix"] or 1e9
            sem = norm_sem(m["score"])
            m["score_total"] = coeff_critere * prix + coeff_semantique * (1 - sem)
        sorted_matches = sorted(matches, key=lambda m: m["score_total"])
        best3 = sorted_matches[:top_k]
        plan1_prestations.append({**pm, "matches": best3})
        prixs = [m["prestation"]["prix"] or 0 for m in best3]
        durees = [m["prestation"]["duree_estimee"] or 0 for m in best3]
        if prixs:
            budget1_min += min(prixs)
            budget1_max += max(prixs)
        if durees:
            duree1_min += min(durees)
            duree1_max += max(durees)
    plans.append({
        "plan": 1,
        "label": "Économique",
        "description": "Le moins cher possible, durée potentiellement longue.",
        "budget": (budget1_min, budget1_max),
        "duree": (duree1_min, duree1_max),
        "prestations": plan1_prestations
    })
    # Plan 2 : le plus rapide possible
    plan2_prestations = []
    budget2_min = 0
    budget2_max = 0
    duree2_min = 0
    duree2_max = 0
    for pm in prestations_matches:
        matches = pm["matches"]
        if not matches:
            plan2_prestations.append({**pm, "matches": []})
            continue
        sem_scores = [m["score"] for m in matches]
        min_sem, max_sem = min(sem_scores), max(sem_scores)
        def norm_sem(s):
            return (s - min_sem) / (max_sem - min_sem) if max_sem > min_sem else 1.0
        for m in matches:
            duree = m["prestation"]["duree_estimee"] or 1e9
            sem = norm_sem(m["score"])
            m["score_total"] = coeff_critere * duree + coeff_semantique * (1 - sem)
        sorted_matches = sorted(matches, key=lambda m: m["score_total"])
        best3 = sorted_matches[:top_k]
        plan2_prestations.append({**pm, "matches": best3})
        prixs = [m["prestation"]["prix"] or 0 for m in best3]
        durees = [m["prestation"]["duree_estimee"] or 0 for m in best3]
        if prixs:
            budget2_min += min(prixs)
            budget2_max += max(prixs)
        if durees:
            duree2_min += min(durees)
            duree2_max += max(durees)
    plans.append({
        "plan": 2,
        "label": "Rapide",
        "description": "Le plus rapide possible, quitte à payer plus cher.",
        "budget": (budget2_min, budget2_max),
        "duree": (duree2_min, duree2_max),
        "prestations": plan2_prestations
    })
    # Plan 3 : équilibré (score mixte)
    plan3_prestations = []
    budget3_min = 0
    budget3_max = 0
    duree3_min = 0
    duree3_max = 0
    for pm in prestations_matches:
        matches = pm["matches"]
        if not matches:
            plan3_prestations.append({**pm, "matches": []})
            continue
        prixs = [m["prestation"]["prix"] or 0 for m in matches]
        durees = [m["prestation"]["duree_estimee"] or 0 for m in matches]
        if not prixs or not durees:
            plan3_prestations.append({**pm, "matches": []})
            continue
        prix_med = sorted(prixs)[len(prixs)//2]
        duree_med = sorted(durees)[len(durees)//2]
        sem_scores = [m["score"] for m in matches]
        min_sem, max_sem = min(sem_scores), max(sem_scores)
        def norm_sem(s):
            return (s - min_sem) / (max_sem - min_sem) if max_sem > min_sem else 1.0
        for m in matches:
            prix = m["prestation"]["prix"] or 0
            duree = m["prestation"]["duree_estimee"] or 0
            sem = norm_sem(m["score"])
            dist = abs(prix - prix_med) + abs(duree - duree_med)
            m["score_total"] = coeff_critere * dist + coeff_semantique * (1 - sem)
        sorted_matches = sorted(matches, key=lambda m: m["score_total"])
        best3 = sorted_matches[:top_k]
        plan3_prestations.append({**pm, "matches": best3})
        prixs_best3 = [m["prestation"]["prix"] or 0 for m in best3]
        durees_best3 = [m["prestation"]["duree_estimee"] or 0 for m in best3]
        budget3_min += min(prixs_best3)
        budget3_max += max(prixs_best3)
        duree3_min += min(durees_best3)
        duree3_max += max(durees_best3)
    plans.append({
        "plan": 3,
        "label": "Équilibré",
        "description": "Un compromis entre prix et durée.",
        "budget": (budget3_min, budget3_max),
        "duree": (duree3_min, duree3_max),
        "prestations": plan3_prestations
    })
    return plans 