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

class Utilisateur(Base):
    __tablename__ = 'utilisateurs'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, nullable=False)  # 'client', 'prestataire'
    client = relationship("Client", back_populates="utilisateur", uselist=False)
    prestataire = relationship("Prestataire", back_populates="utilisateur", uselist=False)
