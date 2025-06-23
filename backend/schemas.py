from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProjetBase(BaseModel):
    titre: str
    description: Optional[str] = None

class ProjetCreate(ProjetBase):
    pass

class Projet(ProjetBase):
    id: int
    date_creation: datetime
    client_id: int
    class Config:
        orm_mode = True

class ClientBase(BaseModel):
    nom: str
    email: str
    telephone: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    projets: List[Projet] = []
    class Config:
        orm_mode = True

class PrestationBase(BaseModel):
    titre: str
    description: Optional[str] = None
    prix: Optional[float] = None
    duree_estimee: Optional[int] = None

class PrestationCreate(PrestationBase):
    pass

class Prestation(PrestationBase):
    id: int
    prestataire_id: int
    class Config:
        orm_mode = True

class PrestataireBase(BaseModel):
    nom: str
    description: Optional[str] = None
    email: str
    telephone: Optional[str] = None

class PrestataireCreate(PrestataireBase):
    pass

class Prestataire(PrestataireBase):
    id: int
    prestations: List[Prestation] = []
    class Config:
        orm_mode = True 