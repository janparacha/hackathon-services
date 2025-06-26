from registry import register_agent, get_agent
from agents.http import HTTPAgent
from agents.mcp import MCPAgent, mock_queue
from agents.a2a import A2AAgent
import threading
import time
import socket
import os
from dotenv import load_dotenv

# Tester l'enregistrement et la récupération des agents

load_dotenv()

register_agent("http", HTTPAgent)
register_agent("mcp", MCPAgent)
register_agent("a2a", A2AAgent)

def mcp_server():
    while True:
        prompt = mock_queue.get()
        print(f"[MCP SERVER] Processed: {prompt}")
        mock_queue.task_done()

threading.Thread(target=mcp_server, daemon=True).start()

# Start mock A2A socket server
SOCKET_PATH = "/tmp/a2a.sock"
if os.path.exists(SOCKET_PATH):
    os.remove(SOCKET_PATH)

def a2a_server():
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as server:
        server.bind(SOCKET_PATH)
        server.listen()
        print("[A2A SERVER] Ready on /tmp/a2a.sock")
        while True:
            conn, _ = server.accept()
            with conn:
                prompt = conn.recv(1024).decode()
                response = f"[A2A SERVER] Got: {prompt}"
                conn.sendall(response.encode())

threading.Thread(target=a2a_server, daemon=True).start()

api_key = os.getenv("GEMINI_API_KEY")
endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

# Test HTTP agent with Gemini API
http_agent = get_agent(
    "http",
    endpoint=endpoint,
    method="POST",
    headers={"Content-Type": "application/json"},
    payload_template={"contents": [{"parts": [{"text": "$prompt"}]}]}
)
print("HTTP (Gemini) Response:", http_agent.ask("Suggest a service provider for video editing", metadata={}))

# Test MCP agent
mcp = get_agent(
    "mcp",
    queue_url="mock://queue.example.com",
    credentials={"token": "abc123"}
)
print("MCP Response:", mcp.ask("Suggest a marketing strategy", metadata={}))

# Test A2A agent
a2a = get_agent(
    "a2a",
    agent_socket_path="/tmp/a2a.sock"
)
time.sleep(0.5)
print("A2A Response:", a2a.ask("What is the best time to launch?", metadata={}))
