from typing import Dict, Any
from .base import BaseAIAgent
from queue import Queue

mock_queue = Queue()

class MCPAgent(BaseAIAgent):
    def __init__(self, queue_url: str, credentials: Dict[str, str]):
        self.queue_url = queue_url
        self.credentials = credentials

    def ask(self, prompt: str, metadata: Dict[str, Any]) -> str:
        mock_queue.put(prompt)
        return f"[MCP] Queued: {prompt}"