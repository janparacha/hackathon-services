import json
import ast
import re
import requests
from sentence_transformers import SentenceTransformer, util
from sqlalchemy.orm import Session
import models
import random

model = SentenceTransformer('all-MiniLM-L6-v2')

# Liste fermée de métiers supportés
METIERS = [
    "maçon", "charpentier", "électricien", "plombier", "architecte", "couvreur", "menuisier",
    "peintre", "chauffagiste", "plaquiste", "carreleur", "paysagiste", "terrassier"
]
metiers_str = ", ".join(f'"{m}"' for m in METIERS)

# Fonction qui interroge Ollama localement pour extraire les prestations à partir d'un prompt
# Retourne une liste de prestations, ou lève une Exception explicite si échec

def extract_prestations_llm(prompt: str, db: Session):
    # Récupérer dynamiquement les métiers et prestations depuis la base
    categories = db.query(models.CategorieMetier).all()
    metiers = [cat.nom for cat in categories]
    metiers_str = ', '.join(f'"{m}"' for m in metiers)
    prestations_par_metier = {}
    for cat in categories:
        prestations = db.query(models.Prestation).filter(models.Prestation.categorie_metier_id == cat.id).all()
        titres = sorted(set(p.titre for p in prestations))
        if titres:
            prestations_par_metier[cat.nom] = titres
    # Construction du prompt
    prompt_llm = (
        f"Tu es un assistant expert en gestion de projet de construction. "
        f"Pour la demande suivante : '{prompt}', "
        f"donne uniquement une liste Python de tuples (prestation, métier) où chaque prestation est associée à son corps de métier principal. "
        f"Le métier doit obligatoirement être choisi dans la liste suivante : [{metiers_str}]. "
        f"Pour chaque métier, voici la liste des prestations possibles :\n"
    )
    for metier, titres in prestations_par_metier.items():
        prompt_llm += f"- {metier} : {titres}\n"
    prompt_llm += (
        f"Choisis uniquement des intitulés de prestations et des métiers dans ces listes. "
        f"Format attendu : [(\"prestation 1\", \"métier 1\"), (\"prestation 2\", \"métier 2\"), ...] "
        f"Réponds uniquement par la liste Python, sans texte ni explication, ni markdown, ni numérotation."
    )
    url = "http://host.docker.internal:11434/api/generate"
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
        start = full_text.find('[')
        end = full_text.find(']', start)
        if start != -1 and end != -1:
            try:
                liste_str = full_text[start:end+1]
                prestations = ast.literal_eval(liste_str)
                # On attend une liste de tuples (prestation, métier)
                if isinstance(prestations, list) and all(isinstance(x, tuple) and len(x) == 2 for x in prestations):
                    return [(str(p).strip(), str(m).strip()) for p, m in prestations]
            except Exception:
                pass

        # Fallback : extraction ligne par ligne (rare)
        prestations = []
        for line in full_text.splitlines():
            match = re.match(r"^\s*['\"]?(.+?)['\"]?\s*,\s*['\"]?(.+?)['\"]?\s*$", line)
            if match:
                prestations.append((match.group(1).strip(), match.group(2).strip()))
        if prestations:
            return prestations

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
    plans = generate_plans(prestations_base)
    result = []
    for idx, prestations_plan in enumerate(plans):
        plan_prestations = []
        budget_total = 0
        duree_total = 0
        for prestation_nom, metier in prestations_plan:
            # Matching strict : on ne retient que les prestations ET prestataires de la bonne catégorie de métier
            cat = db.query(models.CategorieMetier).filter(models.CategorieMetier.nom.ilike(metier)).first()
            if not cat:
                continue
            all_prestations = db.query(models.Prestation).filter(
                models.Prestation.titre.ilike(f"%{prestation_nom}%"),
                models.Prestation.categorie_metier_id == cat.id
            ).all()
            if not all_prestations:
                # fallback : matching sémantique sur toutes les prestations de la bonne catégorie
                all_prestations = db.query(models.Prestation).filter(models.Prestation.categorie_metier_id == cat.id).all()
                if not all_prestations:
                    continue
                emb_prest = model.encode(prestation_nom, convert_to_tensor=True)
                prestations_texts = [f"{p.titre} {p.description or ''}" for p in all_prestations]
                prestations_emb = model.encode(prestations_texts, convert_to_tensor=True)
                scores = util.pytorch_cos_sim(emb_prest, prestations_emb)[0]
                scored = list(zip(all_prestations, scores.tolist()))
                # Trier d'abord par score sémantique, puis par note du prestataire
                scored.sort(key=lambda x: (x[1], db.query(models.Prestataire).filter(models.Prestataire.id == x[0].prestataire_id).first().note), reverse=True)
                top_prest = [x[0] for x in scored[:top_k]]
            else:
                # Trier par note du prestataire (décroissant), puis prix croissant
                all_prestations.sort(key=lambda p: (-(db.query(models.Prestataire).filter(models.Prestataire.id == p.prestataire_id).first().note or 0), p.prix or 1e9))
                top_prest = all_prestations[:top_k]
            # Pour le calcul du budget/durée du plan, on prend le moins cher/rapide
            prix_min = min([p.prix for p in top_prest if p.prix is not None] or [0])
            duree_min = min([p.duree_estimee for p in top_prest if p.duree_estimee is not None] or [0])
            budget_total += prix_min
            duree_total += duree_min
            plan_prestations.append({
                "titre": prestation_nom,
                "metier": metier,
                "matches": [
                    {
                        "prestataire": {
                            "id": db.query(models.Prestataire).filter(models.Prestataire.id == p.prestataire_id).first().id,
                            "nom": db.query(models.Prestataire).filter(models.Prestataire.id == p.prestataire_id).first().nom,
                            "description": db.query(models.Prestataire).filter(models.Prestataire.id == p.prestataire_id).first().description,
                            "email": db.query(models.Prestataire).filter(models.Prestataire.id == p.prestataire_id).first().email,
                            "telephone": db.query(models.Prestataire).filter(models.Prestataire.id == p.prestataire_id).first().telephone,
                            "note": db.query(models.Prestataire).filter(models.Prestataire.id == p.prestataire_id).first().note,
                        },
                        "prestation": {
                            "id": p.id,
                            "titre": p.titre,
                            "description": p.description,
                            "prix": p.prix,
                            "duree_estimee": p.duree_estimee,
                        }
                    } for p in top_prest
                ]
            })
        result.append({
            "plan": idx+1,
            "budget": budget_total,
            "duree": duree_total,
            "prestations": plan_prestations
        })
    return result 