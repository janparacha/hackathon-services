import models
from database import SessionLocal
import random
import bcrypt

# Définition de plusieurs corps de métiers et types de prestations
corps_metiers = [
    {
        "nom": "Informatique",
        "prestations": [
            ("Développement site web vitrine", "Création d'un site web vitrine pour présenter une entreprise."),
            ("Développement site e-commerce", "Mise en place d'une boutique en ligne avec paiement sécurisé."),
            ("Développement application mobile iOS", "Conception d'une app native pour iPhone/iPad."),
            ("Développement application mobile Android", "Conception d'une app native pour Android."),
            ("Refonte graphique d'un site web", "Modernisation du design et de l'ergonomie d'un site existant."),
            ("Intégration API de paiement", "Ajout d'un module de paiement Stripe/Paypal sur un site."),
            ("Déploiement infrastructure cloud AWS", "Mise en place d'une architecture scalable sur AWS."),
            ("Déploiement infrastructure cloud Azure", "Mise en place d'une architecture scalable sur Azure."),
            ("Déploiement infrastructure cloud GCP", "Mise en place d'une architecture scalable sur Google Cloud."),
            ("Audit de sécurité informatique", "Analyse des vulnérabilités et recommandations de sécurité."),
            ("Optimisation SEO avancée", "Amélioration du référencement naturel sur Google."),
            ("Maintenance applicative annuelle", "Support, mises à jour et corrections de bugs sur 1 an."),
            ("Formation utilisateurs back-office", "Formation à l'utilisation d'un CMS ou d'un ERP."),
            ("Développement API REST", "Conception et documentation d'API RESTful."),
            ("Développement API GraphQL", "Conception et documentation d'API GraphQL."),
            ("Développement logiciel embarqué", "Programmation de systèmes embarqués (IoT, domotique, etc.)."),
            ("Développement chatbot IA", "Création de chatbot pour site web ou messagerie."),
            ("Développement script d'automatisation", "Automatisation de tâches répétitives (Python, Bash, etc.)."),
            ("Déploiement CI/CD", "Mise en place de pipelines d'intégration et déploiement continu."),
            ("Tests automatisés", "Écriture et exécution de tests unitaires et fonctionnels."),
            ("Migration de base de données", "Transfert de données et migration de schéma."),
            ("Développement plugin WordPress", "Création de plugins personnalisés pour WordPress."),
            ("Développement module Prestashop", "Création de modules personnalisés pour Prestashop."),
            ("Développement extension navigateur", "Création d'extensions Chrome/Firefox."),
            ("Développement application desktop", "Applications Windows/Mac/Linux sur mesure."),
            ("Développement microservices", "Architecture et développement de microservices."),
            ("Développement site multilingue", "Sites web avec gestion avancée des langues."),
            ("Développement site accessible", "Sites web respectant les normes d'accessibilité."),
            ("Développement site mobile first", "Sites web optimisés pour mobile."),
            ("Développement PWA", "Progressive Web Apps pour expérience mobile avancée."),
            ("Développement SaaS", "Applications web en mode Software as a Service."),
            ("Développement CRM sur mesure", "Outil de gestion de la relation client personnalisé."),
            ("Développement ERP sur mesure", "Outil de gestion d'entreprise personnalisé."),
            ("Développement e-learning", "Plateforme de formation en ligne sur mesure."),
            ("Développement marketplace", "Plateforme de mise en relation acheteurs/vendeurs."),
            ("Développement site événementiel", "Sites web pour événements, conférences, salons."),
            ("Développement site portfolio", "Sites web pour présenter un portfolio professionnel."),
            ("Développement site associatif", "Sites web pour associations et ONG."),
        ]
    },
    {
        "nom": "Bâtiment",
        "prestations": [
            ("Construction de maison individuelle", "Réalisation complète d'une maison clé en main."),
            ("Rénovation d'appartement", "Travaux de rénovation tous corps d'état."),
            ("Pose de carrelage", "Fourniture et pose de carrelage intérieur/extérieur."),
            ("Installation de plomberie salle de bain", "Création ou rénovation complète d'une salle de bain."),
            ("Mise aux normes électriques", "Remise à neuf de l'installation électrique selon la norme NF C 15-100."),
            ("Isolation thermique des combles", "Pose d'isolant pour améliorer la performance énergétique."),
            ("Peinture intérieure murs et plafonds", "Préparation et application de peinture professionnelle."),
            ("Ravalement de façade", "Nettoyage, réparation et peinture de façade extérieure."),
            ("Création de terrasse bois", "Conception et pose d'une terrasse en bois sur mesure."),
            ("Menuiserie sur mesure", "Fabrication et pose de meubles ou rangements personnalisés."),
            ("Réfection toiture tuiles", "Remplacement ou réparation de tuiles et étanchéité."),
            ("Installation de fenêtres PVC", "Pose de fenêtres double vitrage en PVC."),
            ("Aménagement de combles", "Transformation de combles en espace habitable."),
            ("Création d'escalier sur mesure", "Conception et installation d'escaliers personnalisés."),
            ("Installation de portail motorisé", "Pose et motorisation de portails extérieurs."),
            ("Installation de climatisation", "Mise en place de systèmes de climatisation réversible."),
            ("Installation de pompe à chaleur", "Pose de PAC air/eau ou air/air."),
            ("Création de véranda", "Construction de vérandas sur mesure."),
            ("Installation de panneaux solaires", "Pose de panneaux photovoltaïques pour autoconsommation."),
            ("Rénovation énergétique globale", "Travaux d'isolation, chauffage, menuiseries pour économies d'énergie."),
            ("Installation de cuisine équipée", "Conception et pose de cuisines sur mesure."),
            ("Création de salle de sport à domicile", "Aménagement d'une pièce dédiée au sport."),
            ("Installation d'alarme maison", "Pose de systèmes d'alarme et vidéosurveillance."),
            ("Création de piscine enterrée", "Construction de piscines sur mesure."),
            ("Installation de spa/jacuzzi", "Pose de spas et jacuzzis d'intérieur ou extérieur."),
            ("Création de mur végétal intérieur", "Installation de murs végétalisés pour décoration."),
            ("Installation de parquet massif", "Pose de parquet bois massif ou contrecollé."),
            ("Création de dressing sur mesure", "Conception et installation de dressings personnalisés."),
            ("Installation de volets roulants", "Pose de volets électriques ou manuels."),
            ("Création de garage attenant", "Construction de garages accolés à la maison."),
            ("Création d'abri de jardin", "Construction d'abris de jardin en bois ou métal."),
            ("Installation de gouttières alu", "Pose de gouttières en aluminium sur mesure."),
            ("Création de clôture extérieure", "Installation de clôtures pour sécuriser le terrain."),
            ("Création de pergola bioclimatique", "Installation de pergolas à lames orientables."),
            ("Création de cave à vin", "Aménagement de caves à vin enterrées ou en intérieur."),
            ("Création de local technique piscine", "Construction de locaux techniques pour piscines."),
        ]
    },
    {
        "nom": "Santé",
        "prestations": [
            ("Consultation médecine générale", "Bilan de santé, diagnostic et prescription médicale."),
            ("Consultation pédiatrique", "Suivi médical des enfants et vaccinations."),
            ("Soins infirmiers à domicile", "Injections, pansements, suivi post-opératoire."),
            ("Séance de kinésithérapie", "Rééducation après blessure ou chirurgie."),
            ("Consultation diététique", "Élaboration de plans alimentaires personnalisés."),
            ("Séance de psychologie individuelle", "Accompagnement psychologique et thérapie."),
            ("Atelier gestion du stress", "Techniques de relaxation et gestion émotionnelle."),
            ("Prise de sang à domicile", "Réalisation de prélèvements sanguins à domicile."),
            ("Vaccination grippe/covid", "Administration de vaccins saisonniers."),
            ("Suivi grossesse sage-femme", "Consultations prénatales et préparation à l'accouchement."),
            ("Consultation addictologie", "Accompagnement au sevrage tabac, alcool, etc."),
            ("Consultation cardiologie", "Bilan cardiaque et suivi des pathologies."),
            ("Consultation dermatologie", "Diagnostic et traitement des maladies de la peau."),
            ("Consultation ophtalmologie", "Bilan visuel et prescription de lunettes."),
            ("Consultation ORL", "Diagnostic et traitement des troubles ORL."),
            ("Consultation gynécologie", "Suivi gynécologique et dépistage."),
            ("Consultation orthopédie", "Diagnostic et traitement des pathologies de l'appareil locomoteur."),
            ("Consultation endocrinologie", "Suivi des troubles hormonaux et métaboliques."),
            ("Consultation neurologie", "Diagnostic et suivi des maladies du système nerveux."),
            ("Consultation psychiatrie", "Prise en charge des troubles psychiatriques."),
            ("Consultation pneumologie", "Diagnostic et traitement des maladies respiratoires."),
            ("Consultation rhumatologie", "Suivi des maladies articulaires et osseuses."),
            ("Consultation gastro-entérologie", "Diagnostic et traitement des maladies digestives."),
            ("Consultation urologie", "Suivi des pathologies urinaires et génitales."),
            ("Consultation allergologie", "Dépistage et traitement des allergies."),
            ("Consultation nutrition sportive", "Conseils diététiques pour sportifs."),
            ("Consultation tabacologie", "Aide au sevrage tabagique."),
            ("Consultation sexologie", "Conseil et accompagnement en santé sexuelle."),
            ("Consultation gériatrie", "Suivi médical des personnes âgées."),
            ("Consultation pédo-psychiatrie", "Prise en charge des troubles psychiques de l'enfant."),
            ("Consultation podologie", "Soins des pieds et conseils orthopédiques."),
            ("Consultation ostéopathie", "Manipulations pour soulager douleurs et troubles fonctionnels."),
            ("Consultation sophrologie", "Techniques de relaxation et gestion du stress."),
            ("Consultation hypnose", "Accompagnement par l'hypnose thérapeutique."),
        ]
    },
    {
        "nom": "Éducation",
        "prestations": [
            ("Cours particuliers mathématiques", "Soutien scolaire en maths collège/lycée."),
            ("Cours particuliers anglais", "Remise à niveau et préparation examens d'anglais."),
            ("Préparation au bac français", "Coaching et méthodologie pour réussir l'épreuve écrite et orale."),
            ("Formation bureautique Excel/Word", "Initiation et perfectionnement aux outils Microsoft Office."),
            ("Atelier prise de parole en public", "Techniques pour gagner en aisance à l'oral."),
            ("Coaching orientation scolaire", "Aide à la définition du projet d'études et professionnel."),
            ("Préparation concours infirmier", "Entraînement aux épreuves écrites et orales."),
            ("Stage intensif vacances scolaires", "Révisions et approfondissement pendant les vacances."),
            ("Cours de programmation Python", "Découverte et perfectionnement en Python."),
            ("Formation e-learning gestion de projet", "Formation à distance sur les méthodes de gestion de projet."),
            ("Atelier méthodologie de travail", "Organisation, mémorisation, gestion du temps."),
            ("Préparation concours grandes écoles", "Coaching et entraînement aux concours d'entrée."),
            ("Cours de français langue étrangère", "Apprentissage du français pour non francophones."),
            ("Cours de soutien en physique-chimie", "Aide à la compréhension des notions clés."),
            ("Cours de soutien en histoire-géographie", "Révisions et approfondissement des programmes."),
            ("Préparation TOEIC/TOEFL", "Entraînement aux tests d'anglais internationaux."),
            ("Cours de philosophie", "Aide à la dissertation et à l'analyse de texte."),
            ("Cours de sciences économiques et sociales", "Soutien en SES pour le lycée."),
            ("Atelier orientation post-bac", "Aide au choix de filière et d'établissement supérieur."),
            ("Cours de mathématiques supérieures", "Soutien pour les étudiants en prépa ou licence."),
        ]
    },
    {
        "nom": "Finance",
        "prestations": [
            ("Tenue de comptabilité annuelle", "Saisie, révision et clôture des comptes d'entreprise."),
            ("Déclaration fiscale personnelle", "Optimisation et déclaration d'impôts sur le revenu."),
            ("Conseil en investissement immobilier", "Étude de rentabilité et accompagnement achat locatif."),
            ("Audit de gestion financière", "Analyse des flux et recommandations d'optimisation."),
            ("Montage dossier de crédit", "Constitution et suivi de dossiers de financement."),
            ("Gestion de portefeuille boursier", "Conseil et suivi d'investissements en actions/obligations."),
            ("Assurance vie et prévoyance", "Proposition de contrats adaptés à la situation du client."),
            ("Conseil en transmission d'entreprise", "Optimisation fiscale et juridique de la cession."),
            ("Accompagnement création d'entreprise", "Business plan, choix du statut, démarches administratives."),
            ("Externalisation paie", "Gestion des bulletins de salaire et déclarations sociales."),
            ("Conseil en défiscalisation", "Solutions pour réduire la pression fiscale légale."),
            ("Conseil en gestion de patrimoine", "Optimisation de l'épargne et des placements."),
            ("Conseil en fusion-acquisition", "Accompagnement lors de rachats ou fusions d'entreprises."),
            ("Gestion de trésorerie", "Optimisation des flux de trésorerie d'entreprise."),
            ("Conseil en financement participatif", "Aide à la levée de fonds via crowdfunding."),
            ("Audit de conformité réglementaire", "Vérification du respect des normes financières."),
            ("Conseil en fiscalité internationale", "Optimisation fiscale pour entreprises à l'étranger."),
            ("Gestion des risques financiers", "Mise en place de stratégies de couverture des risques."),
            ("Conseil en retraite", "Préparation et optimisation de la retraite."),
            ("Conseil en assurance emprunteur", "Choix et négociation d'assurance pour crédits."),
        ]
    },
    {
        "nom": "Marketing",
        "prestations": [
            ("Audit de présence digitale", "Analyse de la visibilité en ligne et recommandations."),
            ("Création de site vitrine", "Conception d'un site web pour présenter une activité."),
            ("Gestion de campagne Google Ads", "Mise en place et suivi de campagnes publicitaires."),
            ("Community management Instagram", "Animation et modération d'une communauté sur Instagram."),
            ("Création de contenu vidéo", "Réalisation de vidéos promotionnelles pour le web."),
            ("Rédaction d'articles de blog", "Production de contenus optimisés SEO."),
            ("Stratégie de marque", "Définition de l'identité et du positionnement de marque."),
            ("Emailing commercial", "Conception et envoi de newsletters ciblées."),
            ("Organisation d'événements", "Gestion de salons, conférences, lancements de produits."),
            ("Création de supports print", "Conception de flyers, affiches, brochures."),
            ("Veille concurrentielle", "Analyse des concurrents et tendances du marché."),
            ("Gestion de campagne Facebook Ads", "Création et suivi de publicités Facebook."),
            ("Création de charte graphique", "Définition de l'identité visuelle d'une marque."),
            ("Gestion d'influenceurs", "Collaboration avec des influenceurs pour promouvoir une marque."),
            ("Création de podcasts", "Production et diffusion de podcasts de marque."),
            ("Gestion de crise e-réputation", "Stratégies pour gérer une crise sur internet."),
            ("Création de newsletters", "Conception et routage de newsletters professionnelles."),
            ("Animation de webinaires", "Organisation et animation de séminaires en ligne."),
            ("Création de landing pages", "Pages d'atterrissage optimisées pour la conversion."),
            ("Gestion de base de données clients", "Segmentation et gestion de fichiers clients."),
        ]
    },
    {
        "nom": "Juridique",
        "prestations": [
            ("Consultation droit du travail", "Conseil sur contrats, licenciements, litiges employeur/salarié."),
            ("Rédaction de statuts de société", "Création ou modification des statuts juridiques."),
            ("Assistance en droit immobilier", "Conseil sur baux, ventes, litiges immobiliers."),
            ("Rédaction de contrats commerciaux", "Élaboration de contrats de vente, prestation, partenariat."),
            ("Conseil en propriété intellectuelle", "Protection des marques, brevets, droits d'auteur."),
            ("Médiation et résolution de conflits", "Accompagnement à la résolution amiable des litiges."),
            ("Assistance en droit de la famille", "Divorce, garde d'enfants, successions."),
            ("Conseil en fiscalité des entreprises", "Optimisation et conformité fiscale des sociétés."),
            ("Défense devant les prud'hommes", "Représentation en cas de litige salarié/employeur."),
            ("Rédaction de CGV/CGU", "Rédaction de conditions générales de vente ou d'utilisation."),
            ("Conseil en droit des sociétés", "Fusions, acquisitions, restructurations."),
            ("Conseil en droit pénal", "Défense et conseil en matière pénale."),
            ("Conseil en droit des contrats", "Rédaction et analyse de contrats civils et commerciaux."),
            ("Conseil en droit fiscal", "Optimisation et conformité fiscale des particuliers et entreprises."),
            ("Conseil en droit international", "Conseil sur les litiges et contrats internationaux."),
            ("Conseil en droit de la consommation", "Litiges entre consommateurs et professionnels."),
            ("Conseil en droit administratif", "Litiges avec l'administration, marchés publics."),
            ("Conseil en droit social", "Conseil sur la protection sociale et la sécurité sociale."),
            ("Conseil en droit bancaire", "Litiges et conseils sur les produits bancaires."),
            ("Conseil en droit immobilier commercial", "Baux commerciaux, ventes, acquisitions."),
        ]
    },
]

def insert_fake_data():
    db = SessionLocal()
    utilisateurs = []
    client_utilisateur_map = {}
    prestataire_utilisateur_map = {}
    # Création des catégories de métiers
    categories = {}
    for corps in corps_metiers:
        cat = models.CategorieMetier(nom=corps["nom"])
        db.add(cat)
        db.commit()
        categories[corps["nom"]] = cat
    # Génération de prestataires couvrant tous les corps de métiers
    prestataires = []
    prestations = []
    for i in range(1, 101):  # 100 prestataires
        corps = random.choice(corps_metiers)
        cat = categories[corps["nom"]]
        p = models.Prestataire(
            nom=f"{corps['nom']} Pro {i}",
            description=f"Prestataire spécialisé en {corps['nom'].lower()}.",
            email=f"{corps['nom'].lower()}pro{i}@test.com",
            telephone=f"06{random.randint(10,99)}{random.randint(10,99)}{random.randint(10,99)}{random.randint(10,99)}",
            categorie_metier_id=cat.id,
            note=round(random.uniform(5, 10), 2)  # note sur 10, entre 5 et 10
        )
        prestataires.append(p)
        db.add(p)
        db.commit()
        # 15 prestations aléatoires, sans doublon, pour ce prestataire
        prestations_choisies = random.sample(corps['prestations'], 15)
        for titre, description in prestations_choisies:
            prestations.append(models.Prestation(
                titre=titre,
                description=description,
                prix=random.randint(500, 10000),
                duree_estimee=random.randint(1, 30),
                prestataire_id=p.id,
                categorie_metier_id=cat.id,
                utilisateur=prestataire_utilisateur_map[i]

            ))
    # Ajout prestations
    for p in prestations:
        db.add(p)
    db.commit()
    # Génération de nombreux clients
    clients = [
        models.Client(
            nom=f"Client {i}",
            email=f"client{i}@test.com",
            telephone=f"07{random.randint(10,99)}{random.randint(10,99)}{random.randint(10,99)}{random.randint(10,99)}",
            utilisateur=client_utilisateur_map[i]

        )
        for i in range(1, 51)
    ]
    for c in clients:
        db.add(c)
    db.commit()
    for i, client in enumerate(range(1, 51), start=1):
        email = f"client{i}@test.com"
        password = f"client{i}pass"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        utilisateur = models.Utilisateur(
            email=email,
            hashed_password=hashed_password,
            is_active=True,
            role="client"
        )
        utilisateurs.append(utilisateur)
        client_utilisateur_map[i] = utilisateur

    # Création d'utilisateurs pour les prestataires
    for i, prestataire in enumerate(range(1, 101), start=1):
        email = f"prestataire{i}@test.com"
        password = f"prestataire{i}pass"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        utilisateur = models.Utilisateur(
            email=email,
            hashed_password=hashed_password,
            is_active=True,
            role="prestataire"
        )
        utilisateurs.append(utilisateur)
        prestataire_utilisateur_map[i] = utilisateur
        for u in utilisateurs:
            db.add(u)
        db.commit()
    # Génération de projets pour chaque client
    projets = [
        models.Projet(
            titre=f"Projet {i}",
            description=f"Description du projet {i}",
            client_id=random.randint(1, 50)
        )
        for i in range(1, 100)
    ]
    for p in projets:
        db.add(p)
    db.commit()
    db.close()

if __name__ == "__main__":
    insert_fake_data()