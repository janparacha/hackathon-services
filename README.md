# Hackathon Services - Plateforme de Matching Prestataires

Une plateforme complète pour mettre en relation clients et prestataires de services, avec une interface moderne et une API robuste.

## 🚀 Architecture

- **Frontend**: Next.js 15 avec TypeScript, Tailwind CSS et Radix UI
- **Backend**: FastAPI avec Python
- **Base de données**: PostgreSQL
- **Docker**: Conteneurisation complète

## 📋 Prérequis

- Docker et Docker Compose installés
- Node.js 18+ (pour le développement local)

## 🛠️ Installation et Lancement

### 1. Configuration des variables d'environnement

Copiez le fichier d'exemple et configurez vos variables :

```bash
cp env.example .env
```

Les variables par défaut sont :
- Base de données PostgreSQL
- URLs des services
- Configuration API

### 2. Lancement avec Docker Compose

```bash
# Construire et démarrer tous les services
docker-compose up --build

# Ou en mode détaché
docker-compose up --build -d
```

### 3. Accès aux services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Adminer (DB)**: http://localhost:8080
- **Base de données**: localhost:5432

## 🔧 Développement

### Frontend (Next.js)

```bash
cd front
npm install
npm run dev
```

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📚 API Endpoints

### Backend (FastAPI)

- `GET /` - Test de connexion
- `POST /clients/` - Créer un client
- `GET /clients/` - Lister les clients
- `POST /prestataires/` - Créer un prestataire
- `GET /prestataires/` - Lister les prestataires
- `POST /match_prestataires/` - Matching IA de prestataires

## 🐳 Structure Docker

```
├── front/           # Frontend Next.js
│   ├── Dockerfile
│   └── .dockerignore
├── backend/         # Backend FastAPI
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
└── .env
```

## 🔍 Debug et Monitoring

### Vérifier les logs

```bash
# Tous les services
docker-compose logs

# Service spécifique
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db
```

### Statut des conteneurs

```bash
docker-compose ps
```

### Redémarrer un service

```bash
docker-compose restart frontend
```

## 🚨 Dépannage

### Problème de connexion API

1. Vérifiez que le backend est démarré : `docker-compose logs backend`
2. Testez l'API : http://localhost:8000
3. Vérifiez les variables d'environnement dans `.env`

### Problème de base de données

1. Vérifiez les logs : `docker-compose logs db`
2. Accédez à Adminer : http://localhost:8080
3. Vérifiez les variables PostgreSQL dans `.env`

### Problème de build frontend

1. Nettoyez les caches : `docker-compose down -v`
2. Reconstruisez : `docker-compose up --build`

## 📝 Notes de développement

- Le frontend utilise le mode standalone de Next.js pour l'optimisation Docker
- Les variables d'environnement sont configurées pour le développement local
- La base de données est réinitialisée à chaque démarrage (mode dev)
- Le hot-reload est activé pour le développement

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request
