"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Euro,
  Star,
  Briefcase,
  FileText,
  CheckCircle,
  TrendingUp,
  Building,
  Computer,
  X,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import type { Projet } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { fetchPost } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { ClientIdContext } from '@/components/ClientIdProvider'
import { useRouter } from "next/navigation"

const FakeProjects: Projet[] = [
  {
    "plan": 1,
    "label": "Économique",
    "description": "Le moins cher possible, durée potentiellement longue.",
    "budget": [
      4648,
      4756
    ],
    "duree": [
      96,
      267
    ],
    "prestations": [
      {
        "titre": "Rénovation des murs",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 353,
              "nom": "Bâtiment Pro 353",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro353@test.com",
              "telephone": "0694542250",
              "note": 8.22
            },
            "prestation": {
              "id": 8814,
              "titre": "Création de passerelle extérieure",
              "description": "Construction de passerelles piétonnes ou techniques.",
              "prix": 522,
              "duree_estimee": 30
            },
            "score": 0.34302374720573425,
            "score_total": 9.431098862597219
          },
          {
            "prestataire": {
              "id": 314,
              "nom": "Bâtiment Pro 314",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro314@test.com",
              "telephone": "0624952486",
              "note": 9
            },
            "prestation": {
              "id": 7840,
              "titre": "Installation de plancher technique surélevé",
              "description": "Pose de planchers pour passage de câbles et réseaux.",
              "prix": 524,
              "duree_estimee": 10
            },
            "score": 0.31088733673095703,
            "score_total": 3.482262317401145
          },
          {
            "prestataire": {
              "id": 48,
              "nom": "Bâtiment Pro 48",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro48@test.com",
              "telephone": "0657241362",
              "note": 9.5
            },
            "prestation": {
              "id": 1197,
              "titre": "Création de mur végétalisé extérieur",
              "description": "Installation de murs verts pour façade ou clôture.",
              "prix": 536,
              "duree_estimee": 28
            },
            "score": 0.5751976370811462,
            "score_total": 8.46146149035194
          }
        ]
      },
      {
        "titre": "Changement de sol",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 353,
              "nom": "Bâtiment Pro 353",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro353@test.com",
              "telephone": "0694542250",
              "note": 8.22
            },
            "prestation": {
              "id": 8814,
              "titre": "Création de passerelle extérieure",
              "description": "Construction de passerelles piétonnes ou techniques.",
              "prix": 522,
              "duree_estimee": 30
            },
            "score": 0.25740697979927063,
            "score_total": 9.39590419450962
          },
          {
            "prestataire": {
              "id": 314,
              "nom": "Bâtiment Pro 314",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro314@test.com",
              "telephone": "0624952486",
              "note": 9
            },
            "prestation": {
              "id": 7840,
              "titre": "Installation de plancher technique surélevé",
              "description": "Pose de planchers pour passage de câbles et réseaux.",
              "prix": 524,
              "duree_estimee": 10
            },
            "score": 0.19997954368591309,
            "score_total": 3.516870191480631
          },
          {
            "prestataire": {
              "id": 48,
              "nom": "Bâtiment Pro 48",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro48@test.com",
              "telephone": "0657241362",
              "note": 9.5
            },
            "prestation": {
              "id": 1197,
              "titre": "Création de mur végétalisé extérieur",
              "description": "Installation de murs verts pour façade ou clôture.",
              "prix": 536,
              "duree_estimee": 28
            },
            "score": 0.27902698516845703,
            "score_total": 8.750363496874437
          }
        ]
      },
      {
        "titre": "Peinture intérieure",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 353,
              "nom": "Bâtiment Pro 353",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro353@test.com",
              "telephone": "0694542250",
              "note": 8.22
            },
            "prestation": {
              "id": 8814,
              "titre": "Création de passerelle extérieure",
              "description": "Construction de passerelles piétonnes ou techniques.",
              "prix": 522,
              "duree_estimee": 30
            },
            "score": 0.4102414846420288,
            "score_total": 9.211537948201867
          },
          {
            "prestataire": {
              "id": 314,
              "nom": "Bâtiment Pro 314",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro314@test.com",
              "telephone": "0624952486",
              "note": 9
            },
            "prestation": {
              "id": 7840,
              "titre": "Installation de plancher technique surélevé",
              "description": "Pose de planchers pour passage de câbles et réseaux.",
              "prix": 524,
              "duree_estimee": 10
            },
            "score": 0.2529746890068054,
            "score_total": 3.459814652051299
          },
          {
            "prestataire": {
              "id": 48,
              "nom": "Bâtiment Pro 48",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro48@test.com",
              "telephone": "0657241362",
              "note": 9.5
            },
            "prestation": {
              "id": 1197,
              "titre": "Création de mur végétalisé extérieur",
              "description": "Installation de murs verts pour façade ou clôture.",
              "prix": 536,
              "duree_estimee": 28
            },
            "score": 0.4601915180683136,
            "score_total": 8.532681953163909
          }
        ]
      },
      {
        "titre": "Amélioration électriques",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 353,
              "nom": "Bâtiment Pro 353",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro353@test.com",
              "telephone": "0694542250",
              "note": 8.22
            },
            "prestation": {
              "id": 8814,
              "titre": "Création de passerelle extérieure",
              "description": "Construction de passerelles piétonnes ou techniques.",
              "prix": 522,
              "duree_estimee": 30
            },
            "score": 0.24240581691265106,
            "score_total": 9.360716683121387
          },
          {
            "prestataire": {
              "id": 314,
              "nom": "Bâtiment Pro 314",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro314@test.com",
              "telephone": "0624952486",
              "note": 9
            },
            "prestation": {
              "id": 7840,
              "titre": "Installation de plancher technique surélevé",
              "description": "Pose de planchers pour passage de câbles et réseaux.",
              "prix": 524,
              "duree_estimee": 10
            },
            "score": 0.13155190646648407,
            "score_total": 3.5501728973463775
          },
          {
            "prestataire": {
              "id": 48,
              "nom": "Bâtiment Pro 48",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro48@test.com",
              "telephone": "0657241362",
              "note": 9.5
            },
            "prestation": {
              "id": 1197,
              "titre": "Création de mur végétalisé extérieur",
              "description": "Installation de murs verts pour façade ou clôture.",
              "prix": 536,
              "duree_estimee": 28
            },
            "score": 0.24273131787776947,
            "score_total": 8.76016038176648
          }
        ]
      },
      {
        "titre": "Installation d'équipements électroniques",
        "metier": "Informatique",
        "matches": [
          {
            "prestataire": {
              "id": 125,
              "nom": "Informatique Pro 125",
              "description": "Prestataire spécialisé en informatique.",
              "email": "informatiquepro125@test.com",
              "telephone": "0653451640",
              "note": 7.82
            },
            "prestation": {
              "id": 3101,
              "titre": "Déploiement CI/CD",
              "description": "Mise en place de pipelines d'intégration et déploiement continu.",
              "prix": 504,
              "duree_estimee": 8
            },
            "score": 0.3410189151763916,
            "score_total": 2.4864525812765197
          },
          {
            "prestataire": {
              "id": 296,
              "nom": "Informatique Pro 296",
              "description": "Prestataire spécialisé en informatique.",
              "email": "informatiquepro296@test.com",
              "telephone": "0627159534",
              "note": 7.06
            },
            "prestation": {
              "id": 7384,
              "titre": "Développement d'outils de gestion de production industrielle",
              "description": "Suivi des chaînes de production et des stocks.",
              "prix": 510,
              "duree_estimee": 24
            },
            "score": 0.14627276360988617,
            "score_total": 7.5830251252718694
          },
          {
            "prestataire": {
              "id": 493,
              "nom": "Informatique Pro 493",
              "description": "Prestataire spécialisé en informatique.",
              "email": "informatiquepro493@test.com",
              "telephone": "0666485783",
              "note": 7.19
            },
            "prestation": {
              "id": 12306,
              "titre": "Développement site web vitrine",
              "description": "Création d'un site web vitrine pour présenter une entreprise.",
              "prix": 520,
              "duree_estimee": 27
            },
            "score": 0.14841903746128082,
            "score_total": 8.479756635029066
          }
        ]
      },
      {
        "titre": "Rénovation des cuisines",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 353,
              "nom": "Bâtiment Pro 353",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro353@test.com",
              "telephone": "0694542250",
              "note": 8.22
            },
            "prestation": {
              "id": 8814,
              "titre": "Création de passerelle extérieure",
              "description": "Construction de passerelles piétonnes ou techniques.",
              "prix": 522,
              "duree_estimee": 30
            },
            "score": 0.3747745156288147,
            "score_total": 9.296138782832942
          },
          {
            "prestataire": {
              "id": 314,
              "nom": "Bâtiment Pro 314",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro314@test.com",
              "telephone": "0624952486",
              "note": 9
            },
            "prestation": {
              "id": 7840,
              "titre": "Installation de plancher technique surélevé",
              "description": "Pose de planchers pour passage de câbles et réseaux.",
              "prix": 524,
              "duree_estimee": 10
            },
            "score": 0.19521917402744293,
            "score_total": 3.5372547611619063
          },
          {
            "prestataire": {
              "id": 48,
              "nom": "Bâtiment Pro 48",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro48@test.com",
              "telephone": "0657241362",
              "note": 9.5
            },
            "prestation": {
              "id": 1197,
              "titre": "Création de mur végétalisé extérieur",
              "description": "Installation de murs verts pour façade ou clôture.",
              "prix": 536,
              "duree_estimee": 28
            },
            "score": 0.36767104268074036,
            "score_total": 8.705677684957118
          }
        ]
      },
      {
        "titre": "Rénovation des salles de bains",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 353,
              "nom": "Bâtiment Pro 353",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro353@test.com",
              "telephone": "0694542250",
              "note": 8.22
            },
            "prestation": {
              "id": 8814,
              "titre": "Création de passerelle extérieure",
              "description": "Construction de passerelles piétonnes ou techniques.",
              "prix": 522,
              "duree_estimee": 30
            },
            "score": 0.3357889950275421,
            "score_total": 9.492050589820094
          },
          {
            "prestataire": {
              "id": 314,
              "nom": "Bâtiment Pro 314",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro314@test.com",
              "telephone": "0624952486",
              "note": 9
            },
            "prestation": {
              "id": 7840,
              "titre": "Installation de plancher technique surélevé",
              "description": "Pose de planchers pour passage de câbles et réseaux.",
              "prix": 524,
              "duree_estimee": 10
            },
            "score": 0.261765718460083,
            "score_total": 3.559678443490683
          },
          {
            "prestataire": {
              "id": 48,
              "nom": "Bâtiment Pro 48",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro48@test.com",
              "telephone": "0657241362",
              "note": 9.5
            },
            "prestation": {
              "id": 1197,
              "titre": "Création de mur végétalisé extérieur",
              "description": "Installation de murs verts pour façade ou clôture.",
              "prix": 536,
              "duree_estimee": 28
            },
            "score": 0.39147791266441345,
            "score_total": 8.841173053082205
          }
        ]
      },
      {
        "titre": "Mise aux normes sécurité",
        "metier": "Juridique",
        "matches": [
          {
            "prestataire": {
              "id": 266,
              "nom": "Juridique Pro 266",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro266@test.com",
              "telephone": "0652599396",
              "note": 5.52
            },
            "prestation": {
              "id": 6642,
              "titre": "Conseil en droit des contrats",
              "description": "Rédaction et analyse de contrats civils et commerciaux.",
              "prix": 506,
              "duree_estimee": 30
            },
            "score": 0.4015190899372101,
            "score_total": 9.221225847730162
          },
          {
            "prestataire": {
              "id": 288,
              "nom": "Juridique Pro 288",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro288@test.com",
              "telephone": "0632552286",
              "note": 9.48
            },
            "prestation": {
              "id": 7186,
              "titre": "Rédaction de contrats de bail professionnel",
              "description": "Baux pour professions libérales.",
              "prix": 510,
              "duree_estimee": 14
            },
            "score": 0.432096004486084,
            "score_total": 4.363693244233652
          },
          {
            "prestataire": {
              "id": 448,
              "nom": "Juridique Pro 448",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro448@test.com",
              "telephone": "0699273017",
              "note": 6.53
            },
            "prestation": {
              "id": 11189,
              "titre": "Conseil en droit fiscal",
              "description": "Optimisation et conformité fiscale des particuliers et entreprises.",
              "prix": 510,
              "duree_estimee": 27
            },
            "score": 0.3274790346622467,
            "score_total": 8.460537390632421
          }
        ]
      },
      {
        "titre": "Conseil en matière de réglementation et permis de construire",
        "metier": "Juridique",
        "matches": [
          {
            "prestataire": {
              "id": 266,
              "nom": "Juridique Pro 266",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro266@test.com",
              "telephone": "0652599396",
              "note": 5.52
            },
            "prestation": {
              "id": 6642,
              "titre": "Conseil en droit des contrats",
              "description": "Rédaction et analyse de contrats civils et commerciaux.",
              "prix": 506,
              "duree_estimee": 30
            },
            "score": 0.552702784538269,
            "score_total": 9.079248247313737
          },
          {
            "prestataire": {
              "id": 288,
              "nom": "Juridique Pro 288",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro288@test.com",
              "telephone": "0632552286",
              "note": 9.48
            },
            "prestation": {
              "id": 7186,
              "titre": "Rédaction de contrats de bail professionnel",
              "description": "Baux pour professions libérales.",
              "prix": 510,
              "duree_estimee": 14
            },
            "score": 0.492249995470047,
            "score_total": 4.397939637318357
          },
          {
            "prestataire": {
              "id": 448,
              "nom": "Juridique Pro 448",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro448@test.com",
              "telephone": "0699273017",
              "note": 6.53
            },
            "prestation": {
              "id": 11189,
              "titre": "Conseil en droit fiscal",
              "description": "Optimisation et conformité fiscale des particuliers et entreprises.",
              "prix": 510,
              "duree_estimee": 27
            },
            "score": 0.4017705023288727,
            "score_total": 8.475584655412066
          }
        ]
      }
    ]
  },
  {
    "plan": 2,
    "label": "Rapide",
    "description": "Le plus rapide possible, quitte à payer plus cher.",
    "budget": [
      22583,
      70153
    ],
    "duree": [
      9,
      9
    ],
    "prestations": [
      {
        "titre": "Rénovation des murs",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 171,
              "nom": "Bâtiment Pro 171",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro171@test.com",
              "telephone": "0626112198",
              "note": 7.39
            },
            "prestation": {
              "id": 4256,
              "titre": "Rénovation énergétique globale",
              "description": "Travaux d'isolation, chauffage, menuiseries pour économies d'énergie.",
              "prix": 7845,
              "duree_estimee": 1
            },
            "score": 0.5610784888267517,
            "score_total": 0.38394018019039017
          },
          {
            "prestataire": {
              "id": 330,
              "nom": "Bâtiment Pro 330",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro330@test.com",
              "telephone": "0670895160",
              "note": 5.2
            },
            "prestation": {
              "id": 8228,
              "titre": "Rénovation énergétique globale",
              "description": "Travaux d'isolation, chauffage, menuiseries pour économies d'énergie.",
              "prix": 4800,
              "duree_estimee": 1
            },
            "score": 0.5610784888267517,
            "score_total": 0.38394018019039017
          },
          {
            "prestataire": {
              "id": 79,
              "nom": "Bâtiment Pro 79",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro79@test.com",
              "telephone": "0621999422",
              "note": 7.82
            },
            "prestation": {
              "id": 1965,
              "titre": "Création de mur en pierre sèche",
              "description": "Montage de murs sans liant pour esthétique et drainage.",
              "prix": 7085,
              "duree_estimee": 1
            },
            "score": 0.5426107048988342,
            "score_total": 0.4133422078084491
          }
        ]
      },
      {
        "titre": "Changement de sol",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 353,
              "nom": "Bâtiment Pro 353",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro353@test.com",
              "telephone": "0694542250",
              "note": 8.22
            },
            "prestation": {
              "id": 8810,
              "titre": "Création de toiture terrasse",
              "description": "Transformation de toits plats en terrasses accessibles.",
              "prix": 6473,
              "duree_estimee": 1
            },
            "score": 0.44535866379737854,
            "score_total": 0.3
          },
          {
            "prestataire": {
              "id": 495,
              "nom": "Bâtiment Pro 495",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro495@test.com",
              "telephone": "0611707931",
              "note": 5.15
            },
            "prestation": {
              "id": 12364,
              "titre": "Création de toiture terrasse",
              "description": "Transformation de toits plats en terrasses accessibles.",
              "prix": 8491,
              "duree_estimee": 1
            },
            "score": 0.44535866379737854,
            "score_total": 0.3
          },
          {
            "prestataire": {
              "id": 171,
              "nom": "Bâtiment Pro 171",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro171@test.com",
              "telephone": "0626112198",
              "note": 7.39
            },
            "prestation": {
              "id": 4256,
              "titre": "Rénovation énergétique globale",
              "description": "Travaux d'isolation, chauffage, menuiseries pour économies d'énergie.",
              "prix": 7845,
              "duree_estimee": 1
            },
            "score": 0.43104422092437744,
            "score_total": 0.3301521532286272
          }
        ]
      },
      {
        "titre": "Peinture intérieure",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 84,
              "nom": "Bâtiment Pro 84",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro84@test.com",
              "telephone": "0621985121",
              "note": 7.6
            },
            "prestation": {
              "id": 2094,
              "titre": "Création de clôture extérieure",
              "description": "Installation de clôtures pour sécuriser le terrain.",
              "prix": 6528,
              "duree_estimee": 1
            },
            "score": 0.4369485080242157,
            "score_total": 0.46937563601017723
          },
          {
            "prestataire": {
              "id": 303,
              "nom": "Bâtiment Pro 303",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro303@test.com",
              "telephone": "0641821320",
              "note": 7.62
            },
            "prestation": {
              "id": 7569,
              "titre": "Création de clôture extérieure",
              "description": "Installation de clôtures pour sécuriser le terrain.",
              "prix": 2857,
              "duree_estimee": 1
            },
            "score": 0.4369485080242157,
            "score_total": 0.46937563601017723
          },
          {
            "prestataire": {
              "id": 222,
              "nom": "Bâtiment Pro 222",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro222@test.com",
              "telephone": "0676834133",
              "note": 5.43
            },
            "prestation": {
              "id": 5547,
              "titre": "Installation de parquet massif",
              "description": "Pose de parquet bois massif ou contrecollé.",
              "prix": 7383,
              "duree_estimee": 1
            },
            "score": 0.4265134334564209,
            "score_total": 0.4858494625903562
          }
        ]
      },
      {
        "titre": "Amélioration électriques",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 110,
              "nom": "Bâtiment Pro 110",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro110@test.com",
              "telephone": "0691279027",
              "note": 9.64
            },
            "prestation": {
              "id": 2745,
              "titre": "Installation de bornes de recharge électrique",
              "description": "Pose de bornes pour véhicules électriques.",
              "prix": 7649,
              "duree_estimee": 1
            },
            "score": 0.4534670114517212,
            "score_total": 0.3
          },
          {
            "prestataire": {
              "id": 163,
              "nom": "Bâtiment Pro 163",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro163@test.com",
              "telephone": "0667675583",
              "note": 8.56
            },
            "prestation": {
              "id": 4064,
              "titre": "Installation de bornes de recharge électrique",
              "description": "Pose de bornes pour véhicules électriques.",
              "prix": 2418,
              "duree_estimee": 1
            },
            "score": 0.4534670114517212,
            "score_total": 0.3
          },
          {
            "prestataire": {
              "id": 402,
              "nom": "Bâtiment Pro 402",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro402@test.com",
              "telephone": "0698378680",
              "note": 8.05
            },
            "prestation": {
              "id": 10042,
              "titre": "Installation de bornes de recharge électrique",
              "description": "Pose de bornes pour véhicules électriques.",
              "prix": 955,
              "duree_estimee": 1
            },
            "score": 0.4534670114517212,
            "score_total": 0.3
          }
        ]
      },
      {
        "titre": "Installation d'équipements électroniques",
        "metier": "Informatique",
        "matches": [
          {
            "prestataire": {
              "id": 81,
              "nom": "Informatique Pro 81",
              "description": "Prestataire spécialisé en informatique.",
              "email": "informatiquepro81@test.com",
              "telephone": "0670911662",
              "note": 8.91
            },
            "prestation": {
              "id": 2009,
              "titre": "Développement d'outils de gestion de la conformité eIDAS",
              "description": "Signature électronique et identité numérique européenne.",
              "prix": 2133,
              "duree_estimee": 1
            },
            "score": 0.39778852462768555,
            "score_total": 0.3
          },
          {
            "prestataire": {
              "id": 15,
              "nom": "Informatique Pro 15",
              "description": "Prestataire spécialisé en informatique.",
              "email": "informatiquepro15@test.com",
              "telephone": "0686505877",
              "note": 9.41
            },
            "prestation": {
              "id": 373,
              "titre": "Développement d'outils de signature électronique",
              "description": "Solutions de signature légale de documents en ligne.",
              "prix": 6573,
              "duree_estimee": 1
            },
            "score": 0.3323887288570404,
            "score_total": 0.3995952097253792
          },
          {
            "prestataire": {
              "id": 411,
              "nom": "Informatique Pro 411",
              "description": "Prestataire spécialisé en informatique.",
              "email": "informatiquepro411@test.com",
              "telephone": "0674391011",
              "note": 5.8
            },
            "prestation": {
              "id": 10262,
              "titre": "Développement d'outils de gestion de la conformité ISO 27001",
              "description": "Mise en conformité sécurité de l'information.",
              "prix": 1628,
              "duree_estimee": 1
            },
            "score": 0.27708151936531067,
            "score_total": 0.4838207499391719
          }
        ]
      },
      {
        "titre": "Rénovation des cuisines",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 171,
              "nom": "Bâtiment Pro 171",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro171@test.com",
              "telephone": "0626112198",
              "note": 7.39
            },
            "prestation": {
              "id": 4256,
              "titre": "Rénovation énergétique globale",
              "description": "Travaux d'isolation, chauffage, menuiseries pour économies d'énergie.",
              "prix": 7845,
              "duree_estimee": 1
            },
            "score": 0.5464590787887573,
            "score_total": 0.3655920831853603
          },
          {
            "prestataire": {
              "id": 330,
              "nom": "Bâtiment Pro 330",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro330@test.com",
              "telephone": "0670895160",
              "note": 5.2
            },
            "prestation": {
              "id": 8228,
              "titre": "Rénovation énergétique globale",
              "description": "Travaux d'isolation, chauffage, menuiseries pour économies d'énergie.",
              "prix": 4800,
              "duree_estimee": 1
            },
            "score": 0.5464590787887573,
            "score_total": 0.3655920831853603
          },
          {
            "prestataire": {
              "id": 322,
              "nom": "Bâtiment Pro 322",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro322@test.com",
              "telephone": "0691549260",
              "note": 7.49
            },
            "prestation": {
              "id": 8026,
              "titre": "Installation de plomberie salle de bain",
              "description": "Création ou rénovation complète d'une salle de bain.",
              "prix": 2069,
              "duree_estimee": 1
            },
            "score": 0.4675118029117584,
            "score_total": 0.47160647122706817
          }
        ]
      },
      {
        "titre": "Rénovation des salles de bains",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 322,
              "nom": "Bâtiment Pro 322",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro322@test.com",
              "telephone": "0691549260",
              "note": 7.49
            },
            "prestation": {
              "id": 8026,
              "titre": "Installation de plomberie salle de bain",
              "description": "Création ou rénovation complète d'une salle de bain.",
              "prix": 2069,
              "duree_estimee": 1
            },
            "score": 0.8743717670440674,
            "score_total": 0.3
          },
          {
            "prestataire": {
              "id": 110,
              "nom": "Bâtiment Pro 110",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro110@test.com",
              "telephone": "0691279027",
              "note": 9.64
            },
            "prestation": {
              "id": 2739,
              "titre": "Création de salle de bain PMR",
              "description": "Aménagement de salles de bain accessibles aux personnes à mobilité réduite.",
              "prix": 1990,
              "duree_estimee": 1
            },
            "score": 0.5991019010543823,
            "score_total": 0.5514872494209055
          },
          {
            "prestataire": {
              "id": 475,
              "nom": "Bâtiment Pro 475",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro475@test.com",
              "telephone": "0663775232",
              "note": 7.13
            },
            "prestation": {
              "id": 11867,
              "titre": "Création de salle de bain PMR",
              "description": "Aménagement de salles de bain accessibles aux personnes à mobilité réduite.",
              "prix": 8941,
              "duree_estimee": 1
            },
            "score": 0.5991019010543823,
            "score_total": 0.5514872494209055
          }
        ]
      },
      {
        "titre": "Mise aux normes sécurité",
        "metier": "Juridique",
        "matches": [
          {
            "prestataire": {
              "id": 128,
              "nom": "Juridique Pro 128",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro128@test.com",
              "telephone": "0614999722",
              "note": 8.33
            },
            "prestation": {
              "id": 3198,
              "titre": "Conseil en droit social",
              "description": "Conseil sur la protection sociale et la sécurité sociale.",
              "prix": 7874,
              "duree_estimee": 1
            },
            "score": 0.5190942287445068,
            "score_total": 0.3
          },
          {
            "prestataire": {
              "id": 469,
              "nom": "Juridique Pro 469",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro469@test.com",
              "telephone": "0686605082",
              "note": 5.29
            },
            "prestation": {
              "id": 11713,
              "titre": "Conseil en droit social",
              "description": "Conseil sur la protection sociale et la sécurité sociale.",
              "prix": 5112,
              "duree_estimee": 1
            },
            "score": 0.5190942287445068,
            "score_total": 0.3
          },
          {
            "prestataire": {
              "id": 18,
              "nom": "Juridique Pro 18",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro18@test.com",
              "telephone": "0670433527",
              "note": 9.21
            },
            "prestation": {
              "id": 441,
              "titre": "Rédaction de contrats de bail professionnel",
              "description": "Baux pour professions libérales.",
              "prix": 619,
              "duree_estimee": 1
            },
            "score": 0.432096004486084,
            "score_total": 0.4636932442336517
          }
        ]
      },
      {
        "titre": "Conseil en matière de réglementation et permis de construire",
        "metier": "Juridique",
        "matches": [
          {
            "prestataire": {
              "id": 241,
              "nom": "Juridique Pro 241",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro241@test.com",
              "telephone": "0671134851",
              "note": 7.31
            },
            "prestation": {
              "id": 6009,
              "titre": "Conseil en droit bancaire",
              "description": "Litiges et conseils sur les produits bancaires.",
              "prix": 1192,
              "duree_estimee": 1
            },
            "score": 0.5689213275909424,
            "score_total": 0.3474051934457155
          },
          {
            "prestataire": {
              "id": 205,
              "nom": "Juridique Pro 205",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro205@test.com",
              "telephone": "0681587165",
              "note": 7.16
            },
            "prestation": {
              "id": 5107,
              "titre": "Rédaction de contrats de cession de droits de propriété intellectuelle",
              "description": "Contrats pour vente de droits de PI.",
              "prix": 7552,
              "duree_estimee": 1
            },
            "score": 0.518212616443634,
            "score_total": 0.4469653213436125
          },
          {
            "prestataire": {
              "id": 319,
              "nom": "Juridique Pro 319",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro319@test.com",
              "telephone": "0683242693",
              "note": 5.35
            },
            "prestation": {
              "id": 7954,
              "titre": "Rédaction de contrats de cession de droits de propriété intellectuelle",
              "description": "Contrats pour vente de droits de PI.",
              "prix": 5448,
              "duree_estimee": 1
            },
            "score": 0.518212616443634,
            "score_total": 0.4469653213436125
          }
        ]
      }
    ]
  },
  {
    "plan": 3,
    "label": "Mieux noté",
    "description": "Les meilleures notes de prestataires pour chaque prestation.",
    "budget": [
      33971,
      68579
    ],
    "duree": [
      112,
      236
    ],
    "prestations": [
      {
        "titre": "Rénovation des murs",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5415,
              "titre": "Création de mur rideau vitré",
              "description": "Façades vitrées pour bâtiments modernes.",
              "prix": 2709,
              "duree_estimee": 21
            },
            "score": 0.5181301832199097,
            "score_total": 6.452316942260488
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5407,
              "titre": "Création de salle de jeux enfants",
              "description": "Aménagement d'espaces ludiques et sécurisés.",
              "prix": 7211,
              "duree_estimee": 27
            },
            "score": 0.4946688711643219,
            "score_total": 8.289669022385896
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5414,
              "titre": "Création de murs antibruit",
              "description": "Construction de murs pour réduire les nuisances sonores.",
              "prix": 5813,
              "duree_estimee": 9
            },
            "score": 0.4122028350830078,
            "score_total": 3.0209608265286385
          }
        ]
      },
      {
        "titre": "Changement de sol",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5421,
              "titre": "Création de toiture terrasse",
              "description": "Transformation de toits plats en terrasses accessibles.",
              "prix": 9200,
              "duree_estimee": 17
            },
            "score": 0.44535866379737854,
            "score_total": 5.1
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5423,
              "titre": "Installation de panneaux solaires thermiques",
              "description": "Production d'eau chaude sanitaire par énergie solaire.",
              "prix": 2398,
              "duree_estimee": 24
            },
            "score": 0.41790497303009033,
            "score_total": 7.257828858450924
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5410,
              "titre": "Création de salle de sport à domicile",
              "description": "Aménagement d'une pièce dédiée au sport.",
              "prix": 6932,
              "duree_estimee": 20
            },
            "score": 0.4058063328266144,
            "score_total": 6.083313612311747
          }
        ]
      },
      {
        "titre": "Peinture intérieure",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5406,
              "titre": "Création de terrasse en pierre naturelle",
              "description": "Pose de dalles ou pavés en pierre pour terrasses.",
              "prix": 7843,
              "duree_estimee": 2
            },
            "score": 0.42111507058143616,
            "score_total": 0.7943718447967891
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5410,
              "titre": "Création de salle de sport à domicile",
              "description": "Aménagement d'une pièce dédiée au sport.",
              "prix": 6932,
              "duree_estimee": 20
            },
            "score": 0.41950723528862,
            "score_total": 6.19691013042295
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5416,
              "titre": "Pose de carrelage",
              "description": "Fourniture et pose de carrelage intérieur/extérieur.",
              "prix": 1013,
              "duree_estimee": 11
            },
            "score": 0.4145384728908539,
            "score_total": 3.5047543034115676
          }
        ]
      },
      {
        "titre": "Amélioration électriques",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5407,
              "titre": "Création de salle de jeux enfants",
              "description": "Aménagement d'espaces ludiques et sécurisés.",
              "prix": 7211,
              "duree_estimee": 27
            },
            "score": 0.2981484532356262,
            "score_total": 8.365449057413226
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5405,
              "titre": "Création de local vélo sécurisé",
              "description": "Aménagement d'espaces de stationnement pour vélos.",
              "prix": 7173,
              "duree_estimee": 6
            },
            "score": 0.27524304389953613,
            "score_total": 2.104595823825195
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5422,
              "titre": "Création de fontaine de jardin",
              "description": "Installation de fontaines décoratives ou fonctionnelles.",
              "prix": 7743,
              "duree_estimee": 12
            },
            "score": 0.2523912787437439,
            "score_total": 3.9436509090030643
          }
        ]
      },
      {
        "titre": "Installation d'équipements électroniques",
        "metier": "Informatique",
        "matches": [
          {
            "prestataire": {
              "id": 45,
              "nom": "Informatique Pro 45",
              "description": "Prestataire spécialisé en informatique.",
              "email": "informatiquepro45@test.com",
              "telephone": "0687713277",
              "note": 9.97
            },
            "prestation": {
              "id": 1112,
              "titre": "Déploiement CI/CD",
              "description": "Mise en place de pipelines d'intégration et déploiement continu.",
              "prix": 4883,
              "duree_estimee": 18
            },
            "score": 0.3410189151763916,
            "score_total": 5.486452581276519
          },
          {
            "prestataire": {
              "id": 45,
              "nom": "Informatique Pro 45",
              "description": "Prestataire spécialisé en informatique.",
              "email": "informatiquepro45@test.com",
              "telephone": "0687713277",
              "note": 9.97
            },
            "prestation": {
              "id": 1118,
              "titre": "Déploiement infrastructure cloud AWS",
              "description": "Mise en place d'une architecture scalable sur AWS.",
              "prix": 1346,
              "duree_estimee": 21
            },
            "score": 0.19082055985927582,
            "score_total": 6.615184743540084
          },
          {
            "prestataire": {
              "id": 45,
              "nom": "Informatique Pro 45",
              "description": "Prestataire spécialisé en informatique.",
              "email": "informatiquepro45@test.com",
              "telephone": "0687713277",
              "note": 9.97
            },
            "prestation": {
              "id": 1122,
              "titre": "Développement plugin WordPress",
              "description": "Création de plugins personnalisés pour WordPress.",
              "prix": 1781,
              "duree_estimee": 30
            },
            "score": 0.18399156630039215,
            "score_total": 9.32558439445177
          }
        ]
      },
      {
        "titre": "Rénovation des cuisines",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5407,
              "titre": "Création de salle de jeux enfants",
              "description": "Aménagement d'espaces ludiques et sécurisés.",
              "prix": 7211,
              "duree_estimee": 27
            },
            "score": 0.42207711935043335,
            "score_total": 8.332618458279377
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5422,
              "titre": "Création de fontaine de jardin",
              "description": "Installation de fontaines décoratives ou fonctionnelles.",
              "prix": 7743,
              "duree_estimee": 12
            },
            "score": 0.4046081602573395,
            "score_total": 3.8560766585454043
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5415,
              "titre": "Création de mur rideau vitré",
              "description": "Façades vitrées pour bâtiments modernes.",
              "prix": 2709,
              "duree_estimee": 21
            },
            "score": 0.3999680280685425,
            "score_total": 6.562307662325629
          }
        ]
      },
      {
        "titre": "Rénovation des salles de bains",
        "metier": "Bâtiment",
        "matches": [
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5407,
              "titre": "Création de salle de jeux enfants",
              "description": "Aménagement d'espaces ludiques et sécurisés.",
              "prix": 7211,
              "duree_estimee": 27
            },
            "score": 0.5486894845962524,
            "score_total": 8.397544161266794
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5410,
              "titre": "Création de salle de sport à domicile",
              "description": "Aménagement d'une pièce dédiée au sport.",
              "prix": 6932,
              "duree_estimee": 20
            },
            "score": 0.5261464715003967,
            "score_total": 6.318139515345066
          },
          {
            "prestataire": {
              "id": 217,
              "nom": "Bâtiment Pro 217",
              "description": "Prestataire spécialisé en bâtiment.",
              "email": "bâtimentpro217@test.com",
              "telephone": "0614873138",
              "note": 9.92
            },
            "prestation": {
              "id": 5413,
              "titre": "Installation de système de chauffage solaire",
              "description": "Pose de capteurs solaires pour chauffage central.",
              "prix": 6942,
              "duree_estimee": 9
            },
            "score": 0.4090692400932312,
            "score_total": 3.1251015716186217
          }
        ]
      },
      {
        "titre": "Mise aux normes sécurité",
        "metier": "Juridique",
        "matches": [
          {
            "prestataire": {
              "id": 426,
              "nom": "Juridique Pro 426",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro426@test.com",
              "telephone": "0613699861",
              "note": 9.95
            },
            "prestation": {
              "id": 10641,
              "titre": "Rédaction de contrats de bail professionnel",
              "description": "Baux pour professions libérales.",
              "prix": 9896,
              "duree_estimee": 14
            },
            "score": 0.432096004486084,
            "score_total": 4.363693244233652
          },
          {
            "prestataire": {
              "id": 426,
              "nom": "Juridique Pro 426",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro426@test.com",
              "telephone": "0613699861",
              "note": 9.95
            },
            "prestation": {
              "id": 10638,
              "titre": "Conseil en droit international",
              "description": "Conseil sur les litiges et contrats internationaux.",
              "prix": 6849,
              "duree_estimee": 25
            },
            "score": 0.42953190207481384,
            "score_total": 7.668517782272513
          },
          {
            "prestataire": {
              "id": 426,
              "nom": "Juridique Pro 426",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro426@test.com",
              "telephone": "0613699861",
              "note": 9.95
            },
            "prestation": {
              "id": 10644,
              "titre": "Consultation droit du travail",
              "description": "Conseil sur contrats, licenciements, litiges employeur/salarié.",
              "prix": 5619,
              "duree_estimee": 27
            },
            "score": 0.40174198150634766,
            "score_total": 8.320806461652165
          }
        ]
      },
      {
        "titre": "Conseil en matière de réglementation et permis de construire",
        "metier": "Juridique",
        "matches": [
          {
            "prestataire": {
              "id": 426,
              "nom": "Juridique Pro 426",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro426@test.com",
              "telephone": "0613699861",
              "note": 9.95
            },
            "prestation": {
              "id": 10648,
              "titre": "Conseil en droit de la consommation",
              "description": "Litiges entre consommateurs et professionnels.",
              "prix": 4072,
              "duree_estimee": 25
            },
            "score": 0.5158803462982178,
            "score_total": 7.651544438199799
          },
          {
            "prestataire": {
              "id": 426,
              "nom": "Juridique Pro 426",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro426@test.com",
              "telephone": "0613699861",
              "note": 9.95
            },
            "prestation": {
              "id": 10638,
              "titre": "Conseil en droit international",
              "description": "Conseil sur les litiges et contrats internationaux.",
              "prix": 6849,
              "duree_estimee": 25
            },
            "score": 0.5141823887825012,
            "score_total": 7.65487816259557
          },
          {
            "prestataire": {
              "id": 426,
              "nom": "Juridique Pro 426",
              "description": "Prestataire spécialisé en juridique.",
              "email": "juridiquepro426@test.com",
              "telephone": "0613699861",
              "note": 9.95
            },
            "prestation": {
              "id": 10643,
              "titre": "Rédaction de contrats de cession de droits de propriété industrielle internationale",
              "description": "Contrats pour vente de droits industriels à l'étranger.",
              "prix": 4514,
              "duree_estimee": 27
            },
            "score": 0.5095415115356445,
            "score_total": 8.26398993691997
          }
        ]
      }
    ]
  }
]


export default function ProjectManagerAI() {
  const [projets, setProjets] = useState<Projet[]>(FakeProjects)
  const [selectedPlan, setSelectedPlan] = useState<number>(1)
  const [prompt, setPrompt] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPrestations, setSelectedPrestations] = useState<{ [key: string]: number }>({})
  const [expandedPrestations, setExpandedPrestations] = useState<{ [key: string]: boolean }>({})
  const { clientId, refreshProjects } = React.useContext(ClientIdContext)
  const [projectTitle, setProjectTitle] = useState<string>("")
  const [projectDescription, setProjectDescription] = useState<string>("")
  const router = useRouter()


  const getProjectFromPrompt = async (prompt: string) => {
    setLoading(true)
    setError(null)
    fetchPost(`http://localhost:8000/match_prestataires/`, {
      prompt: prompt,
      client_id: clientId
    })
      .then(res => {
        setProjets(res)
        setLoading(false)
        setSelectedPrestations({})
        setExpandedPrestations({})
      })
      .catch(() => {
        setError('Une erreur est survenue lors de la génération du projet')
        setLoading(false)
      })
  }

  const currentProjet = projets.find((p: Projet) => p.plan === selectedPlan)

  const renderStars = (note: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(note) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getMetierIcon = (metier: string) => {
    switch (metier.toLowerCase()) {
      case 'bâtiment':
        return <Building className="h-4 w-4" />
      case 'informatique':
        return <Computer className="h-4 w-4" />
      default:
        return <Briefcase className="h-4 w-4" />
    }
  }

  const formatRange = (arr: [number, number], unit: string) => {
    if (arr[0] === arr[1]) return `${arr[0].toLocaleString()}${unit}`
    return `${arr[0].toLocaleString()}${unit} – ${arr[1].toLocaleString()}${unit}`
  }

  const togglePrestationExpansion = (prestationKey: string) => {
    setExpandedPrestations(prev => ({
      ...prev,
      [prestationKey]: !prev[prestationKey]
    }))
  }

  const selectPrestation = (prestationKey: string, prestationId: number) => {
    setSelectedPrestations(prev => ({
      ...prev,
      [prestationKey]: prestationId
    }))
  }

  const createProject = async () => {
    const selectedPrestationIds = Object.values(selectedPrestations)
    if (selectedPrestationIds.length === 0) {
      setError("Veuillez sélectionner au moins une prestation")
      return
    }
    if (!projectTitle.trim() || !projectDescription.trim()) {
      setError("Veuillez renseigner un titre et une description pour le projet")
      return
    }
    setLoading(true)
    try {
      const response = await fetchPost(`http://localhost:8000/projets/complet`, {
        client_id: clientId,
        titre: projectTitle,
        description: projectDescription,
        prestations: selectedPrestationIds
      })
      if (response && response.id) {
        refreshProjects();
        router.push(`/projet/${response.id}`)
      }
      setSelectedPrestations({})
      setError(null)
    } catch (err: any) {
      setError("Erreur lors de la création du projet")
    } finally {
      setLoading(false)
    }
  }

  // Calculer le total budget et durée des prestations sélectionnées
  const selectedMatches = Object.entries(selectedPrestations).map(([key, prestationId]) => {
    const prestation = currentProjet?.prestations?.find((p: any, idx: number) => `${p.titre}-${idx}` === key)
    if (!prestation) return null
    const match = prestation.matches?.find((m: any) => m.prestation.id === prestationId)
    return match || null
  }).filter(Boolean)
  const totalBudget = selectedMatches.reduce((sum, match: any) => sum + (match.prestation.prix || 0), 0)
  const totalDuree = selectedMatches.reduce((sum, match: any) => sum + (match.prestation.duree_estimee || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-32">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <Spinner />
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Skillbridge</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
            Visualisez et gérez vos projets avec leurs prestations et prestataires
          </p>
          {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
        </div>

        {/* Section pitch client */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Décrivez votre besoin ou projet</CardTitle>
              <CardDescription>Ce texte sera visible dans la vue d'ensemble du plan sélectionné</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Exemple : Je souhaite rénover mon appartement, ou je souhaites un site web vitrine pour mon entreprise."
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={() => getProjectFromPrompt(prompt || "")}>
                Générer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sélecteur de plan */}
        {projets.length > 0 &&
          <>
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sélectionner un Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {projets.map((projet: Projet) => {
                      const isSelected = selectedPlan === projet.plan
                      return (
                        <Button
                          key={projet.plan}
                          {...(isSelected ? { variant: "default" } : { variant: "outline" })}
                          onClick={() => setSelectedPlan(projet.plan)}
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          {projet.label}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="prestations">Prestations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {currentProjet?.label}
                      </CardTitle>
                      <CardDescription>{currentProjet?.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Prestations incluses</h4>
                        <div className="space-y-2">
                          {Array.isArray(currentProjet?.prestations) && currentProjet.prestations.length > 0 ? (
                            currentProjet.prestations.map((prestation: any, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                {getMetierIcon(prestation.metier)}
                                <span className="text-sm">{prestation.titre}</span>
                                <Badge>{prestation.metier}</Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-400">Aucune prestation</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Budget et Durée
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentProjet &&
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{formatRange(currentProjet?.duree, " jours")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Euro className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{formatRange(currentProjet?.budget, "€")}</span>
                          </div>
                        </div>
                      }

                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{currentProjet?.prestations?.length}</div>
                        <div className="text-sm text-gray-600">Prestations</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="prestations">
                <Card>
                  <CardHeader>
                    <CardTitle>Prestations du Plan {currentProjet?.plan}</CardTitle>
                    <CardDescription>
                      Sélectionnez les prestations que vous souhaitez inclure dans votre projet
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.isArray(currentProjet?.prestations) && currentProjet.prestations.length > 0 ? (
                        currentProjet.prestations.map((prestationAvecMatches: any, index: number) => {
                          const prestationKey = `${prestationAvecMatches.titre}-${index}`
                          const isExpanded = expandedPrestations[prestationKey]
                          const selectedPrestationId = selectedPrestations[prestationKey]
                          const hasOptions = Array.isArray(prestationAvecMatches.matches) && prestationAvecMatches.matches.length > 0

                          return (
                            <div key={index} className="border rounded-lg overflow-hidden">
                              <div
                                className={`p-4 transition flex justify-between items-center ${hasOptions ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50 cursor-not-allowed'}`}
                                onClick={() => { if (hasOptions) togglePrestationExpansion(prestationKey) }}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">{prestationAvecMatches.titre}</h3>
                                    {getMetierIcon(prestationAvecMatches.metier)}
                                    <Badge>{prestationAvecMatches.metier}</Badge>
                                    {selectedPrestationId && (
                                      <Badge className="bg-green-100 text-green-700">Sélectionnée</Badge>
                                    )}
                                  </div>
                                  <p className="text-gray-600">
                                    {hasOptions ? prestationAvecMatches.matches[0]?.prestation?.description : null}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-sm text-gray-500 mb-1">
                                      {prestationAvecMatches.matches?.length || 0} option(s)
                                    </div>
                                    <div className="text-lg font-bold text-green-600">
                                      {hasOptions ? `À partir de ${Math.min(...prestationAvecMatches.matches.map((m: any) => m?.prestation?.prix || 0))}€` : 'Aucune option'}
                                    </div>
                                  </div>
                                  {hasOptions ? (isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />) : null}
                                </div>
                              </div>
                              {hasOptions && isExpanded && (
                                <div className="border-t bg-gray-50 p-4">
                                  <div className="space-y-3">
                                    {prestationAvecMatches.matches.map((match: any, matchIndex: number) => (
                                      <div
                                        key={matchIndex}
                                        className={`p-3 rounded-lg border cursor-pointer transition ${selectedPrestationId === match.prestation.id
                                          ? 'border-blue-500 bg-blue-50'
                                          : 'border-gray-200 hover:border-gray-300'
                                          }`}
                                        onClick={() => selectPrestation(prestationKey, match.prestation.id)}
                                      >
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                              <h4 className="font-medium">{match.prestation.titre}</h4>
                                              {selectedPrestationId === match.prestation.id && (
                                                <CheckCircle className="h-4 w-4 text-blue-500" />
                                              )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{match.prestation.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                              <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {match.prestation.duree_estimee} jours
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <Euro className="h-4 w-4" />
                                                {match.prestation.prix?.toLocaleString()}€
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-right ml-4">
                                            <div className="text-sm text-gray-500 mb-1">
                                              {match.prestataire.nom}
                                            </div>
                                            <div className="flex items-center gap-1">
                                              {renderStars(match.prestataire.note)}
                                              <span className="text-xs text-gray-600">({match.prestataire.note})</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-gray-400">Aucune prestation</div>
                      )}
                    </div>

                    {/* Bouton de création de projet */}
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Prestations sélectionnées</h3>
                          <p className="text-sm text-gray-600">
                            {Object.keys(selectedPrestations).length} prestation(s) sélectionnée(s)
                          </p>
                        </div>
                        <Button
                          onClick={createProject}
                          disabled={Object.keys(selectedPrestations).length === 0 || loading || !projectTitle.trim() || !projectDescription.trim()}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {loading ? "Création..." : "Créer le projet"}
                        </Button>
                      </div>

                      {Object.keys(selectedPrestations).length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Prestations qui seront créées :</h4>
                          <div className="space-y-1 mb-2">
                            {Object.entries(selectedPrestations).map(([key, prestationId]) => {
                              const [prestationTitle] = key.split('-')
                              return (
                                <div key={key} className="text-sm text-gray-600 flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {prestationTitle}
                                </div>
                              )
                            })}
                          </div>
                          <div className="flex gap-2 mb-4">
                            <Input
                              placeholder="Titre du projet"
                              value={projectTitle}
                              onChange={e => setProjectTitle(e.target.value)}
                              className="w-1/2"
                            />
                            <Input
                              placeholder="Description du projet"
                              value={projectDescription}
                              onChange={e => setProjectDescription(e.target.value)}
                              className="w-1/2"
                            />
                          </div>
                          <div className="flex gap-6 text-sm text-gray-700 font-semibold mt-2">
                            <div>Total budget : <span className="text-blue-700">{totalBudget.toLocaleString()} €</span></div>
                            <div>Total durée : <span className="text-blue-700">{totalDuree} jours</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        }
      </div>
    </div>
  )
} 