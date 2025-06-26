#!/bin/bash
set -e

# Lancer ollama en arrière-plan
ollama serve &

# Attendre un peu pour que le serveur démarre
sleep 2

# Tirer le modèle Mistral
ollama pull mistral

# Attendre indéfiniment pour que le container reste vivant si nécessaire
wait
