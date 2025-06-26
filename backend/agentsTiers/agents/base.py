from abc import ABC, abstractmethod
from typing import Dict, Any
from enum import Enum

class TransportType(Enum):
    HTTP = "http"
    WEBSOCKET = "websocket"
    MESSAGE_QUEUE = "mcp"
    A2A = "a2a"

class BaseAIAgent(ABC):
    @abstractmethod
    def ask(self, prompt: str, metadata: Dict[str, Any]) -> str:
        pass








