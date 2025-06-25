from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas, crud
from ia import find_best_prestataires
from pydantic import BaseModel
import time
from sqlalchemy.exc import OperationalError
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use specific origins for credentials
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Pour dev : reset complet de la base à chaque démarrage
with engine.begin() as conn:
    models.Base.metadata.drop_all(bind=conn)
    models.Base.metadata.create_all(bind=conn)

# Attendre que la base soit prête (utile pour Docker)
for _ in range(30):
    try:
        models.Base.metadata.create_all(bind=engine)
        break
    except OperationalError:
        print("En attente de la base de données...")
        time.sleep(2)
else:
    raise RuntimeError("Impossible de se connecter à la base de données après plusieurs tentatives.")

# Dépendance pour obtenir la session DB

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "API Hackathon prête !"}

@app.post("/clients/", response_model=schemas.Client)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    return crud.create_client(db, client)

@app.get("/clients/", response_model=list[schemas.Client])
def read_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_clients(db, skip=skip, limit=limit)

@app.post("/prestataires/", response_model=schemas.Prestataire)
def create_prestataire(prestataire: schemas.PrestataireCreate, db: Session = Depends(get_db)):
    return crud.create_prestataire(db, prestataire)

@app.get("/prestataires/", response_model=list[schemas.Prestataire])
def read_prestataires(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_prestataires(db, skip=skip, limit=limit)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/match_prestataires/")
def match_prestataires(request: PromptRequest, db: Session = Depends(get_db)):
    results = find_best_prestataires(db, request.prompt)
    return results 