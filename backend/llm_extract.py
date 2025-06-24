import requests
import json

def extract_criteria_with_ollama(prompt):
    # Extraction LLM désactivée, retourne un dict vide
    return {}

def extract_criteria_with_ollama(prompt):
    system_prompt = (
        "Tu es un assistant qui extrait des critères structurés à partir d'une demande client. "
        "Pour chaque demande, donne-moi un JSON strictement au format suivant : "
        "{\"type_prestation\": string, \"budget_max\": int|null, \"duree_max\": int|null, \"contraintes\": list}. "
        "Si le budget ou la durée ne sont pas mentionnés, mets null. Ne fais aucune supposition, ne complète pas si ce n'est pas explicite. "
        "Ne réponds que par le JSON, sans texte autour."
    )
    full_prompt = f"{system_prompt}\nDemande : {prompt}\nDonne-moi le JSON demandé."
    payload = {
        "model": "mistral",
        "prompt": full_prompt
    }
    try:
        response = requests.post("http://ollama:11434/api/generate", json=payload, timeout=120)
        response.raise_for_status()
        content = response.json()["response"]
        print("Réponse LLM:", content)  # Debug
        json_start = content.find('{')
        json_end = content.rfind('}') + 1
        return json.loads(content[json_start:json_end])
    except Exception as e:
        print("Erreur extraction JSON LLM:", e)
        return {} 