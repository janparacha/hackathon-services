from sqlalchemy.orm import Session
import models, schemas
import bcrypt

def get_client(db: Session, client_id: int):
    return db.query(models.Client).filter(models.Client.id == client_id).first()

def get_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Client).offset(skip).limit(limit).all()

def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def get_prestataire(db: Session, prestataire_id: int):
    return db.query(models.Prestataire).filter(models.Prestataire.id == prestataire_id).first()

def get_prestataires(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Prestataire).offset(skip).limit(limit).all()

def create_prestataire(db: Session, prestataire: schemas.PrestataireCreate):
    db_prestataire = models.Prestataire(**prestataire.dict())
    db.add(db_prestataire)
    db.commit()
    db.refresh(db_prestataire)
    return db_prestataire

def get_prestation(db: Session, prestation_id: int):
    return db.query(models.Prestation).filter(models.Prestation.id == prestation_id).first()

def get_prestations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Prestation).offset(skip).limit(limit).all()

def create_prestation(db: Session, prestation: schemas.PrestationCreate, prestataire_id: int):
    db_prestation = models.Prestation(**prestation.dict(), prestataire_id=prestataire_id)
    db.add(db_prestation)
    db.commit()
    db.refresh(db_prestation)
    return db_prestation

def get_projet(db: Session, projet_id: int):
    return db.query(models.Projet).filter(models.Projet.id == projet_id).first()

def get_projets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Projet).offset(skip).limit(limit).all()

def create_projet(db: Session, projet: schemas.ProjetCreate, client_id: int):
    db_projet = models.Projet(**projet.dict(), client_id=client_id)
    db.add(db_projet)
    db.commit()
    db.refresh(db_projet)
<<<<<<< HEAD
    return db_projet

def create_projet_complet(db: Session, projet_data: schemas.ProjetCreate, client_id: int, prestations: list):
    # Crée le projet
    db_projet = models.Projet(**projet_data.dict(), client_id=client_id)
    db.add(db_projet)
    db.commit()
    db.refresh(db_projet)
    # Pour chaque prestation choisie (prestations = liste d'IDs)
    for prestation_id in prestations:
        prestation_obj = db.query(models.Prestation).get(prestation_id)
        if not prestation_obj:
            continue  # ou lever une exception
        prestataire_id = prestation_obj.prestataire_id
        db_presta_proj = models.ProjetPrestation(
            projet_id=db_projet.id,
            prestation_id=prestation_id,
            prestataire_id=prestataire_id,
            statut='à faire'
        )
        db.add(db_presta_proj)
        db.commit()
        db.refresh(db_presta_proj)
        # Récupère uniquement les conditions templates liées à la prestation
        conditions = db.query(models.ConditionPrestation).filter(
            models.ConditionPrestation.prestation_id == prestation_id
        ).all()
        for cond in conditions:
            db_cond_proj = models.ConditionProjetPrestation(
                projet_prestation_id=db_presta_proj.id,
                condition_prestation_id=cond.id,
                nom=cond.description,
                remplie=0
            )
            db.add(db_cond_proj)
    db.commit()
    return db_projet

def get_projet_detail(db: Session, projet_id: int):
    projet = db.query(models.Projet).filter(models.Projet.id == projet_id).first()
    if not projet:
        return None
    # On construit la structure détaillée
    prestations_details = []
    for pp in projet.projets_prestations:
        prestation = db.query(models.Prestation).get(pp.prestation_id)
        prestataire = db.query(models.Prestataire).get(pp.prestataire_id)
        conditions = []
        for cond in pp.conditions:
            conditions.append(schemas.ConditionProjetPrestation.from_orm(cond))
        prestations_details.append(
            schemas.ProjetPrestationDetail(
                id=pp.id,
                prestation=schemas.Prestation.from_orm(prestation),
                prestataire=schemas.PrestataireLight.from_orm(prestataire),
                statut=pp.statut,
                conditions=conditions
            )
        )
    return schemas.ProjetDetail(
        id=projet.id,
        titre=projet.titre,
        description=projet.description,
        date_creation=projet.date_creation,
        client_id=projet.client_id,
        projets_prestations=prestations_details
    )

def update_condition_projet_prestation(db: Session, condition_id: int, remplie: bool):
    cond = db.query(models.ConditionProjetPrestation).filter(models.ConditionProjetPrestation.id == condition_id).first()
    if not cond:
        return None
    cond.remplie = 1 if remplie else 0
    db.commit()
    db.refresh(cond)
    return cond

def delete_projet(db: Session, projet_id: int):
    projet = db.query(models.Projet).filter(models.Projet.id == projet_id).first()
    if not projet:
        return False
    db.delete(projet)
    db.commit()
    return True

def get_projets_by_client(db: Session, client_id: int):
    return db.query(models.Projet).filter(models.Projet.client_id == client_id).all() 
=======
    return db_projet 


def get_utilisateur(db: Session, utilisateur_id: int):
    return db.query(models.Utilisateur).filter(models.Utilisateur.id == utilisateur_id).first()

def get_utilisateur_by_email(db: Session, email: str):
    return db.query(models.Utilisateur).filter(models.Utilisateur.email == email).first()

def get_utilisateurs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Utilisateur).offset(skip).limit(limit).all()

def create_utilisateur(db: Session, utilisateur: schemas.UtilisateurCreate):
    password = utilisateur.password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password, salt)
    
    db_utilisateur = models.Utilisateur(
        email=utilisateur.email,
        hashed_password=hashed_password,
        is_active=True,
        role=utilisateur.role,
    )
    db.add(db_utilisateur)
    db.commit()
    db.refresh(db_utilisateur)
    return db_utilisateur
>>>>>>> 8a9aeaf (creer model, crud, schema utilisateur et l'ajouter au faker)
