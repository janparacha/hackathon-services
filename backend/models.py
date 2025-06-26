from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float, DateTime, Boolean
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class CategorieMetier(Base):
    __tablename__ = 'categories_metier'
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, unique=True, nullable=False)
    prestations = relationship('Prestation', back_populates='categorie_metier')
    prestataires = relationship('Prestataire', back_populates='categorie_metier')

class Client(Base):
    __tablename__ = 'clients'
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    telephone = Column(String)
    utilisateur_id = Column(Integer, ForeignKey('utilisateurs.id'), unique=True)
    utilisateur = relationship("Utilisateur", back_populates="client")
    projets = relationship('Projet', back_populates='client')

class Projet(Base):
    __tablename__ = 'projets'
    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    description = Column(Text)
    client_id = Column(Integer, ForeignKey('clients.id'))
    date_creation = Column(DateTime, default=datetime.utcnow)
    client = relationship('Client', back_populates='projets')
    projets_prestations = relationship('ProjetPrestation', back_populates='projet', cascade="all, delete-orphan", passive_deletes=True)

class Prestataire(Base):
    __tablename__ = 'prestataires'
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    description = Column(Text)
    email = Column(String, unique=True, nullable=False)
    telephone = Column(String)
    categorie_metier_id = Column(Integer, ForeignKey('categories_metier.id'))
    categorie_metier = relationship('CategorieMetier', back_populates='prestataires')
    utilisateur_id = Column(Integer, ForeignKey('utilisateurs.id'), unique=True)
    utilisateur = relationship("Utilisateur", back_populates="prestataire")
    prestations = relationship('Prestation', back_populates='prestataire')
    note = Column(Float, default=0.0)  # note sur 10

# Prestation = template (catalogue de prestations possibles)
class Prestation(Base):
    __tablename__ = 'prestations'
    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    description = Column(Text)
    prix = Column(Float)
    duree_estimee = Column(Integer)  # durée en jours
    prestataire_id = Column(Integer, ForeignKey('prestataires.id'))
    categorie_metier_id = Column(Integer, ForeignKey('categories_metier.id'))
    prestataire = relationship('Prestataire', back_populates='prestations')
    categorie_metier = relationship('CategorieMetier', back_populates='prestations')

# ProjetPrestation = instance d'une prestation pour un projet donné
class ProjetPrestation(Base):
    __tablename__ = 'projets_prestations'
    id = Column(Integer, primary_key=True, index=True)
    projet_id = Column(Integer, ForeignKey('projets.id', ondelete='CASCADE'))
    prestation_id = Column(Integer, ForeignKey('prestations.id'))
    prestataire_id = Column(Integer, ForeignKey('prestataires.id'))
    statut = Column(String, default='à faire')  # à faire, en cours, terminé, etc.
    conditions = relationship('ConditionProjetPrestation', back_populates='projet_prestation', cascade="all, delete-orphan", passive_deletes=True)
    projet = relationship('Projet', back_populates='projets_prestations')
    prestation = relationship('Prestation')
    prestataire = relationship('Prestataire')

# ConditionProjetPrestation = instance d'une condition à remplir pour une prestation d'un projet donné
class ConditionProjetPrestation(Base):
    __tablename__ = 'conditions_projet_prestation'
    id = Column(Integer, primary_key=True, index=True)
    projet_prestation_id = Column(Integer, ForeignKey('projets_prestations.id', ondelete='CASCADE'))
    condition_prestation_id = Column(Integer, ForeignKey('conditions_prestation.id'))
    nom = Column(String, nullable=False)  # Copie du nom/description de la condition
    remplie = Column(Integer, default=0)  # 0 = False, 1 = True
    projet_prestation = relationship('ProjetPrestation', back_populates='conditions')
    condition_prestation = relationship('ConditionPrestation')

# ConditionPrestation = template (catalogue de conditions possibles pour une prestation ou une catégorie)
class ConditionPrestation(Base):
    __tablename__ = 'conditions_prestation'
    id = Column(Integer, primary_key=True, index=True)
    prestation_id = Column(Integer, ForeignKey('prestations.id'), nullable=True)
    categorie_metier_id = Column(Integer, ForeignKey('categories_metier.id'), nullable=True)
    description = Column(Text, nullable=False)
    obligatoire = Column(Integer, default=1)  # 1 = True, 0 = False 
