from typing import Dict, Any, Optional
from .base import BaseAIAgent
import requests
import re
from urllib.parse import urlparse, urlunparse, urlencode, parse_qsl

class HTTPAgent(BaseAIAgent):
    def __init__(
        self,
        endpoint: str,
        method: str,
        headers: Dict[str, str],
        payload_template: Dict[str, Any],
        api_key: Optional[str] = None,
        auth_type: Optional[str] = None  # 'header' or 'query' or None
    ):
        self.method = method
        self.payload_template = payload_template
        self.api_key = api_key
        self.auth_type = auth_type

        self.headers = headers.copy() if headers else {}

        if self.api_key and self.auth_type == "header":
            self.headers["Authorization"] = f"Bearer {self.api_key}"

        if self.api_key and self.auth_type == "query":
            parsed_url = urlparse(endpoint)
            query_params = dict(parse_qsl(parsed_url.query))
            query_params["key"] = self.api_key
            new_query = urlencode(query_params)
            self.endpoint = urlunparse(parsed_url._replace(query=new_query))
        else:
            self.endpoint = endpoint

    def ask(self, prompt: str, metadata: Dict[str, Any]) -> str:
        def fill_placeholders(obj):
            if isinstance(obj, dict):
                return {k: fill_placeholders(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [fill_placeholders(v) for v in obj]
            elif isinstance(obj, str):
                return re.sub(r"\$prompt", prompt, obj)
            return obj

        payload = fill_placeholders(self.payload_template)
        response = requests.request(self.method, self.endpoint, headers=self.headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
