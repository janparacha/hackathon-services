from typing import Dict, Any
from .base import BaseAIAgent
import socket

class A2AAgent(BaseAIAgent):
    def __init__(self, agent_socket_path: str):
        self.socket_path = agent_socket_path

    def ask(self, prompt: str, metadata: Dict[str, Any]) -> str:
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as s:
            s.connect(self.socket_path)
            s.sendall(prompt.encode())
            return s.recv(1024).decode()