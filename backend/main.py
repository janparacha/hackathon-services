from fastapi import FastAPI, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas, crud
from ia import find_best_prestataires
from pydantic import BaseModel
import time
from sqlalchemy.exc import OperationalError
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Autoriser le CORS pour le frontend Next.js en dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pour dev : reset complet de la base à chaque démarrage
# with engine.begin() as conn:
#     models.Base.metadata.drop_all(bind=conn)
#     models.Base.metadata.create_all(bind=conn)

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
    try:
        results = find_best_prestataires(db, request.prompt)
        if isinstance(results, dict) and "error" in results:
            raise HTTPException(status_code=400, detail=results["error"])
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class ProjetCompletCreate(BaseModel):
    titre: str
    description: str = ''
    client_id: int
    prestations: list[int]  # Liste d'IDs de prestations

@app.post('/projets/complet')
def create_projet_complet_endpoint(data: ProjetCompletCreate, db: Session = Depends(get_db)):
    projet_data = schemas.ProjetCreate(titre=data.titre, description=data.description)
    projet = crud.create_projet_complet(db, projet_data, data.client_id, data.prestations)
    return {"id": projet.id}

@app.get('/projets/{projet_id}/detail', response_model=schemas.ProjetDetail)
def get_projet_detail_endpoint(projet_id: int = Path(...), db: Session = Depends(get_db)):
    projet = crud.get_projet_detail(db, projet_id)
    if not projet:
        raise HTTPException(status_code=404, detail='Projet non trouvé')
    return projet

class ConditionUpdateRequest(BaseModel):
    remplie: bool

@app.patch('/conditions/{condition_id}', response_model=schemas.ConditionProjetPrestation)
def update_condition_endpoint(condition_id: int, data: ConditionUpdateRequest, db: Session = Depends(get_db)):
    cond = crud.update_condition_projet_prestation(db, condition_id, data.remplie)
    if not cond:
        raise HTTPException(status_code=404, detail='Condition non trouvée')
    return schemas.ConditionProjetPrestation.from_orm(cond)

@app.delete('/projets/{projet_id}')
def delete_projet_endpoint(projet_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_projet(db, projet_id)
    if not ok:
        raise HTTPException(status_code=404, detail='Projet non trouvé')
    return {"detail": "Projet supprimé"}

@app.get('/clients/{client_id}/projets', response_model=list[schemas.Projet])
def get_projets_by_client_endpoint(client_id: int, db: Session = Depends(get_db)):
    return crud.get_projets_by_client(db, client_id) 