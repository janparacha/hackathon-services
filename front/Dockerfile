# Dockerfile pour Next.js en mode développement
FROM node:18-alpine

WORKDIR /app

# Installer les dépendances système nécessaires
RUN apk add --no-cache libc6-compat

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (dev + prod)
RUN npm install --legacy-peer-deps

# Copier le code source
COPY . .

EXPOSE 3000

ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "dev"] 