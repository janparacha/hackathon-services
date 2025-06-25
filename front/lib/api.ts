// Service API pour communiquer avec le backend FastAPI

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Clients
  async createClient(clientData: any) {
    return this.request('/clients/', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async getClients(skip = 0, limit = 100) {
    return this.request(`/clients/?skip=${skip}&limit=${limit}`);
  }

  // Prestataires
  async createPrestataire(prestataireData: any) {
    return this.request('/prestataires/', {
      method: 'POST',
      body: JSON.stringify(prestataireData),
    });
  }

  async getPrestataires(skip = 0, limit = 100) {
    return this.request(`/prestataires/?skip=${skip}&limit=${limit}`);
  }

  // Matching de prestataires
  async matchPrestataires(prompt: string) {
    return this.request('/match_prestataires/', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  // Test de connexion
  async testConnection() {
    return this.request('/');
  }
}

export const apiService = new ApiService(); 