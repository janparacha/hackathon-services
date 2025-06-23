from sentence_transformers import SentenceTransformer, util
from sqlalchemy.orm import Session
import models

model = SentenceTransformer('all-MiniLM-L6-v2')

def find_best_prestataires(db: Session, prompt: str, top_k: int = 3):
    # Récupérer toutes les prestations et prestataires
    prestations = db.query(models.Prestation).all()
    if not prestations:
        return []
    # Encoder le prompt et les prestations
    prompt_emb = model.encode(prompt, convert_to_tensor=True)
    prestations_texts = [f"{p.titre} {p.description or ''}" for p in prestations]
    prestations_emb = model.encode(prestations_texts, convert_to_tensor=True)
    # Similarité
    scores = util.pytorch_cos_sim(prompt_emb, prestations_emb)[0]
    # Associer chaque prestation à son score
    scored_prestations = list(zip(prestations, scores.tolist()))
    # Trier par score décroissant
    scored_prestations.sort(key=lambda x: x[1], reverse=True)
    # Garder les top_k prestations
    top_prestations = scored_prestations[:top_k]
    # Récupérer les prestataires associés (sans doublons)
    prestataires = []
    seen_ids = set()
    for prestation, score in top_prestations:
        if prestation.prestataire_id not in seen_ids:
            prestataire = db.query(models.Prestataire).filter(models.Prestataire.id == prestation.prestataire_id).first()
            if prestataire:
                prestataires.append({"prestataire": prestataire, "score": score, "prestation": prestation})
                seen_ids.add(prestation.prestataire_id)
    return prestataires 