from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

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
        from_attributes = True

class ClientBase(BaseModel):
    nom: str
    email: str
    telephone: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class Client(BaseModel):
    id: int
    projets: List[Projet] = []
    class Config:
        from_attributes = True

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
        from_attributes = True

class PrestataireBase(BaseModel):
    nom: str
    description: Optional[str] = None
    email: str
    telephone: Optional[str] = None

class PrestataireCreate(PrestataireBase):
    pass

class Prestataire(BaseModel):
    id: int
    prestations: List[Prestation] = []
    class Config:
<<<<<<< HEAD
        from_attributes = True

class PrestataireLight(BaseModel):
    id: int
    nom: str
    description: Optional[str] = None
    email: str
    telephone: Optional[str] = None
    note: Optional[float] = None
    class Config:
        from_attributes = True

class ConditionProjetPrestationBase(BaseModel):
    nom: str
    remplie: bool = False

class ConditionProjetPrestationCreate(ConditionProjetPrestationBase):
    condition_prestation_id: int

class ConditionProjetPrestation(BaseModel):
    id: int
    condition_prestation_id: int
    nom: str
    remplie: bool = False
    class Config:
        from_attributes = True

class ProjetPrestationBase(BaseModel):
    prestation_id: int
    prestataire_id: int
    statut: Optional[str] = 'à faire'

class ProjetPrestationCreate(ProjetPrestationBase):
    pass

class ProjetPrestation(BaseModel):
    id: int
    prestation_id: int
    prestataire_id: int
    statut: Optional[str] = 'à faire'
    conditions: List[ConditionProjetPrestation] = []
    class Config:
        from_attributes = True

class ConditionPrestationBase(BaseModel):
    description: str
    obligatoire: bool = True
    prestation_id: Optional[int] = None
    categorie_metier_id: Optional[int] = None

class ConditionPrestationCreate(ConditionPrestationBase):
    pass

class ConditionPrestation(BaseModel):
    id: int
    description: str
    obligatoire: bool = True
    prestation_id: Optional[int] = None
    categorie_metier_id: Optional[int] = None
    class Config:
        from_attributes = True

class ProjetPrestationDetail(BaseModel):
    id: int
    prestation: Prestation
    prestataire: PrestataireLight
    statut: str
    conditions: List[ConditionProjetPrestation] = []
    class Config:
        from_attributes = True

class ProjetDetail(ProjetBase):
    id: int
    date_creation: datetime
    client_id: int
    projets_prestations: List[ProjetPrestationDetail] = []
    class Config:
        from_attributes = True 
=======
        orm_mode = True 

class RoleEnum(str, Enum):
    client = "client"
    prestataire = "prestataire"

class UtilisateurBase(BaseModel):
    email: EmailStr
    role: RoleEnum

class UtilisateurCreate(UtilisateurBase):
    password: str

class Utilisateur(UtilisateurBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True



>>>>>>> 8a9aeaf (creer model, crud, schema utilisateur et l'ajouter au faker)
