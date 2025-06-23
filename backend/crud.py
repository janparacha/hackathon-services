from sqlalchemy.orm import Session
import models, schemas

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
    return db_projet 