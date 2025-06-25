# Dockerfile pour Next.js
FROM node:18-alpine AS builder

# Installer les dépendances nécessaires
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer next globalement
RUN npm install -g next

# Installer les dépendances (prod + dev, même en prod)
RUN npm ci --include=dev --legacy-peer-deps

# Copier le code source
COPY . .

# Build Next.js
RUN npm run build

# Exposer le port
EXPOSE 3000

# Mettre NODE_ENV en production uniquement pour le lancement
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"] 