# 🔗 Guide d'Intégration API

Ce guide explique comment intégrer l'API backend dans votre application frontend Next.js.

## 📡 Service API

Le service API est défini dans `front/lib/api.ts` et fournit une interface unifiée pour communiquer avec le backend FastAPI.

### Utilisation de base

```typescript
import { apiService } from '@/lib/api';

// Test de connexion
const result = await apiService.testConnection();
if (result.data) {
  console.log('API connectée:', result.data.message);
}

// Matching de prestataires
const matchResult = await apiService.matchPrestataires("Je veux rénover ma maison");
if (matchResult.data) {
  console.log('Prestataires trouvés:', matchResult.data);
}
```

## 🎣 Hooks personnalisés

Des hooks React sont disponibles dans `front/hooks/useApi.ts` pour simplifier l'utilisation de l'API.

### useApi - Pour les requêtes de lecture

```typescript
import { useApi } from '@/hooks/useApi';
import { apiService } from '@/lib/api';

function MyComponent() {
  const { data: clients, loading, error } = useApi(
    () => apiService.getClients(),
    [] // dépendances
  );

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div>
      {clients?.map(client => (
        <div key={client.id}>{client.nom}</div>
      ))}
    </div>
  );
}
```

### useApiMutation - Pour les requêtes de modification

```typescript
import { useApiMutation } from '@/hooks/useApi';
import { apiService } from '@/lib/api';

function CreateClientForm() {
  const { mutate, loading, error } = useApiMutation(apiService.createClient);

  const handleSubmit = async (formData) => {
    const result = await mutate(formData);
    if (result.data) {
      console.log('Client créé:', result.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* formulaire */}
    </form>
  );
}
```

## 🔧 Configuration

### Variables d'environnement

Dans votre fichier `.env` :

```env
# URL de l'API backend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Configuration Docker

Dans `docker-compose.yml`, l'URL de l'API est configurée automatiquement :

```yaml
frontend:
  environment:
    NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
```

## 📋 Endpoints disponibles

### Clients
- `GET /clients/` - Lister tous les clients
- `POST /clients/` - Créer un nouveau client

### Prestataires
- `GET /prestataires/` - Lister tous les prestataires
- `POST /prestataires/` - Créer un nouveau prestataire

### Matching IA
- `POST /match_prestataires/` - Trouver des prestataires correspondants

### Test
- `GET /` - Test de connexion API

## 🚨 Gestion d'erreurs

Le service API gère automatiquement les erreurs et retourne un objet avec la structure :

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
}
```

### Exemple de gestion d'erreur

```typescript
const result = await apiService.matchPrestataires("projet");
if (result.error) {
  console.error('Erreur API:', result.error);
  // Afficher un message d'erreur à l'utilisateur
} else {
  // Traiter les données
  console.log('Données:', result.data);
}
```

## 🔍 Débogage

### Composant de statut API

Le composant `ApiStatus` affiche le statut de la connexion API en temps réel :

```typescript
import ApiStatus from '@/components/ApiStatus';

function MyPage() {
  return (
    <div>
      <ApiStatus />
      {/* Autres composants */}
    </div>
  );
}
```

### Logs de développement

Activez les logs détaillés en mode développement :

```typescript
// Dans lib/api.ts
if (process.env.NODE_ENV === 'development') {
  console.log('API Request:', url, options);
}
```

## 🧪 Tests

### Test de connexion

```bash
# Test direct de l'API
curl http://localhost:8000

# Test depuis le frontend
npm run dev:local
# Puis vérifier le composant ApiStatus
```

### Test des endpoints

```typescript
// Test de création d'un client
const clientData = {
  nom: "Test Client",
  email: "test@example.com"
};
const result = await apiService.createClient(clientData);
```

## 🔄 Mise à jour des types

Si vous modifiez les schémas du backend, mettez à jour les types dans `front/lib/types.ts` :

```typescript
export interface Client {
  id: number;
  nom: string;
  email: string;
  // Ajoutez de nouveaux champs ici
}
```

## 📚 Ressources

- [Documentation FastAPI](https://fastapi.tiangolo.com/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Guide des hooks React](https://react.dev/reference/react/hooks) 