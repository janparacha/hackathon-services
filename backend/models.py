from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float, DateTime
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Client(Base):
    __tablename__ = 'clients'
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    telephone = Column(String)
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
    prestations = relationship('Prestation', back_populates='prestataire')

class Prestation(Base):
    __tablename__ = 'prestations'
    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    description = Column(Text)
    prix = Column(Float)
    duree_estimee = Column(Integer)  # durée en jours
    prestataire_id = Column(Integer, ForeignKey('prestataires.id'))
    prestataire = relationship('Prestataire', back_populates='prestations') 