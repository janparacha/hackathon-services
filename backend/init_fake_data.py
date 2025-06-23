import models
from database import SessionLocal
import random

# Génération de nombreux prestataires
prestataires = [
    models.Prestataire(
        nom=f"Prestataire {i}",
        description=f"Description du prestataire {i}",
        email=f"prestataire{i}@test.com",
        telephone=f"06{random.randint(10,99)}{random.randint(10,99)}{random.randint(10,99)}{random.randint(10,99)}"
    )
    for i in range(1, 21)
]

# Génération de nombreuses prestations
prestations = []
prestation_types = [
    ("Développement site web", "Création de sites vitrines et e-commerce"),
    ("Application mobile", "Apps iOS et Android sur mesure"),
    ("Migration cloud", "Accompagnement vers AWS, Azure, GCP"),
    ("Audit sécurité", "Analyse de vulnérabilité et recommandations"),
    ("SEO", "Optimisation du référencement naturel"),
    ("Design UX/UI", "Conception d'interfaces utilisateur modernes"),
    ("Maintenance applicative", "Support et maintenance de vos applications"),
    ("Formation digitale", "Formations sur les outils numériques"),
]
for i in range(1, 61):
    titre, description = random.choice(prestation_types)
    prix = random.randint(1000, 10000)
    duree = random.randint(2, 30)
    prestataire_id = random.randint(1, 20)
    prestations.append(models.Prestation(
        titre=titre,
        description=description,
        prix=prix,
        duree_estimee=duree,
        prestataire_id=prestataire_id
    ))

# Génération de nombreux clients
clients = [
    models.Client(
        nom=f"Client {i}",
        email=f"client{i}@test.com",
        telephone=f"07{random.randint(10,99)}{random.randint(10,99)}{random.randint(10,99)}{random.randint(10,99)}"
    )
    for i in range(1, 16)
]

# Génération de projets pour chaque client
projets = [
    models.Projet(
        titre=f"Projet {i}",
        description=f"Description du projet {i}",
        client_id=random.randint(1, 15)
    )
    for i in range(1, 21)
]

def insert_fake_data():
    db = SessionLocal()
    # Ajout prestataires
    for p in prestataires:
        db.add(p)
    db.commit()
    # Ajout prestations
    for p in prestations:
        db.add(p)
    db.commit()
    # Ajout clients
    for c in clients:
        db.add(c)
    db.commit()
    # Ajout projets
    for p in projets:
        db.add(p)
    db.commit()
    db.close()

if __name__ == "__main__":
    insert_fake_data() 