from typing import Dict, Type
from agents.base import BaseAIAgent

AGENT_REGISTRY: Dict[str, Type[BaseAIAgent]] = {}

# Enregistrer un agent lors de sa création
def register_agent(agent_type: str, cls: Type[BaseAIAgent]):
    AGENT_REGISTRY[agent_type] = cls

# Récupérer un agent enregistré
def get_agent(agent_type: str, **kwargs) -> BaseAIAgent:
    if agent_type not in AGENT_REGISTRY:
        raise ValueError(f"Unknown agent type: {agent_type}")
    return AGENT_REGISTRY[agent_type](**kwargs)
