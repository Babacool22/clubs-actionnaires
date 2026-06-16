# Contrat commun de recherche des fiches entreprises

Version : 1.0
Date de référence obligatoire : 2026-06-09
Sortie chercheur : `research/company-dossiers/raw/<slug>.json`
Sortie développeur : `prisma/seed-data/companies/<slug>.json`

## 1. Objectif

Ce contrat est identique pour les 39 chercheurs, l'orchestrateur et les 39
développeurs. Il doit produire des fiches homogènes, vérifiables et directement
compatibles avec `prisma/update-from-dossiers.ts`.

Le chercheur collecte et qualifie les faits. Il ne modifie aucun fichier
applicatif ou dossier final. Le développeur transforme ensuite le rapport validé
en JSON final sans refaire de recherche. L'orchestrateur contrôle la conformité,
arbitre les conflits et autorise le passage de `pending_research` à
`ready_for_development`.

Les données existantes dans `prisma/seed.ts`, les FAQ historiques et les fiches
du site sont uniquement des pistes de recherche. Elles ne constituent jamais
une preuve.

## 2. Règles non négociables

1. Vérifier chaque information au **9 juin 2026**. Toute date relative doit être
   reformulée avec une date absolue.
2. Donner la priorité aux pages officielles, règlements, formulaires, FAQ,
   brochures et documents datés de la société.
3. Une source secondaire ne peut jamais être la seule preuve d'un avantage.
4. Utiliser l'URL précise du document ou de la page qui prouve le fait, et non
   une page d'accueil générique.
5. Ne rien inventer, compléter par analogie ou déduire d'une pratique ancienne.
6. Signaler explicitement tout conflit, page supprimée, condition ambiguë,
   traduction incertaine ou information non datée.
7. Distinguer les catégories suivantes :
   - `shareholder_club` : club formel avec adhésion ou statut de membre ;
   - `shareholder_program` : programme formel sans nécessairement porter le nom
     de club ;
   - `shareholder_benefit` : avantage concret réservé aux actionnaires ;
   - `investor_relations_only` : simple espace d'information financière ;
   - `none` : aucun dispositif spécifique prouvé ;
   - `unclear` : existence ou statut impossible à confirmer.
8. Ne pas présenter comme avantage un droit légal ou un service générique :
   droit de vote, participation ordinaire à l'assemblée générale, dividende
   ordinaire, accès aux rapports publics, cotation, service investisseurs
   standard, inscription au registre, DRS, DSPP ou DRIP accessible sans
   avantage économique propre aux actionnaires.
9. Un dividende majoré, une action gratuite de fidélité ou un tarif réservé peut
   être retenu uniquement si ses conditions spécifiques sont officiellement
   prouvées et encore applicables.
10. Séparer le seuil global d'adhésion du seuil propre à chaque avantage. Ne
    jamais remplacer un seuil inconnu par `1`.
11. Documenter le mode de détention requis : porteur, nominatif administré,
    nominatif pur, compte chez un établissement précis, classe de titre et durée
    minimale de détention.
12. Documenter les frais, justificatifs, procédure, contacts, dates de validité,
    échéances de demande, limites, exclusions et disponibilité.
13. Retenir au maximum **6 à 8 bénéfices**, uniquement lorsqu'ils sont réellement
    distincts et prouvés. Une fiche peut et doit en contenir moins, voire aucun.
14. Produire **5 à 6 FAQ** utiles et sourcées. En l'absence d'avantages, les FAQ
    doivent expliquer clairement cette absence et les confusions fréquentes.
15. Écrire en français naturel, précis et factuel. Éviter le ton promotionnel,
    les estimations spéculatives et les valeurs monétaires non datées.

## 3. Hiérarchie des sources

Ordre de priorité :

1. Conditions officielles, règlement, formulaire ou brochure de l'avantage.
2. Page officielle actionnaires individuels ou page officielle du programme.
3. Rapport annuel, avis d'assemblée, communiqué officiel ou dépôt réglementaire.
4. Teneur de registre, agent de transfert ou partenaire officiellement désigné.
5. Archive officielle ou copie archivée d'un document officiel, avec date.
6. Source secondaire reconnue, uniquement pour orienter ou corroborer.

Une preuve de niveau 5 ou 6 doit être accompagnée d'une incertitude. Une offre
ancienne, expirée ou seulement visible dans une archive ne doit pas être
présentée comme active.

### Notes de preuve

- `A` : source officielle, actuelle, précise et datée ;
- `B` : source officielle et précise, mais date absente ou plus ancienne ;
- `C` : partenaire officiel ou dépôt réglementaire suffisamment précis ;
- `D` : source secondaire ou archive, utilisable seulement comme corroboration ;
- `E` : affirmation non vérifiée, à rejeter du dossier final.

Un bénéfice final doit normalement avoir une preuve `A`, `B` ou `C`. Une preuve
`D` seule est insuffisante.

## 4. Méthode imposée au chercheur

1. Identifier l'entité cotée, le ticker, l'indice, le site officiel et la page
   investisseurs.
2. Rechercher séparément un club, un programme, un avantage commercial, une
   politique de fidélité et un simple espace de relations investisseurs.
3. Ouvrir les conditions, FAQ, formulaires et documents datés associés.
4. Établir le seuil global et toutes les conditions d'éligibilité.
5. Vérifier chaque bénéfice individuellement, y compris sa date de validité.
6. Rechercher les exclusions et la procédure pratique de demande.
7. Examiner les affirmations déjà présentes dans le site comme des hypothèses,
   puis les confirmer ou les classer dans `rejectedClaims`.
8. Rédiger les 5 à 6 FAQ uniquement à partir des faits vérifiés.
9. Lister les conflits et les informations encore inconnues.
10. Remplir le rapport JSON conformément au schéma ci-dessous.

Le chercheur ne doit pas gonfler artificiellement le nombre de bénéfices. Les
variantes d'un même crédit, remise ou service restent un seul bénéfice lorsque
les conditions sont communes.

## 5. Schéma JSON du rapport de recherche

Le rapport doit être un JSON UTF-8 valide, sans commentaire. Les champs
`null` expriment une donnée réellement inconnue ou non applicable. Un champ
obligatoire ne doit jamais être omis.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://clubsactionnaires.fr/schemas/company-research-report-v1.json",
  "title": "Company shareholder programme research report",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schemaVersion",
    "researchAsOf",
    "company",
    "offerClassification",
    "eligibility",
    "enrollment",
    "benefits",
    "faqs",
    "claims",
    "rejectedClaims",
    "sources",
    "conflicts",
    "handoff"
  ],
  "properties": {
    "schemaVersion": {
      "const": "1.0"
    },
    "researchAsOf": {
      "const": "2026-06-09"
    },
    "company": {
      "$ref": "#/$defs/company"
    },
    "offerClassification": {
      "$ref": "#/$defs/offerClassification"
    },
    "eligibility": {
      "$ref": "#/$defs/eligibility"
    },
    "enrollment": {
      "$ref": "#/$defs/enrollment"
    },
    "benefits": {
      "type": "array",
      "maxItems": 8,
      "items": {
        "$ref": "#/$defs/benefit"
      }
    },
    "faqs": {
      "type": "array",
      "minItems": 5,
      "maxItems": 6,
      "items": {
        "$ref": "#/$defs/faq"
      }
    },
    "claims": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/claim"
      }
    },
    "rejectedClaims": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/rejectedClaim"
      }
    },
    "sources": {
      "type": "array",
      "minItems": 1,
      "items": {
        "$ref": "#/$defs/source"
      }
    },
    "conflicts": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/conflict"
      }
    },
    "handoff": {
      "$ref": "#/$defs/handoff"
    }
  },
  "$defs": {
    "nullableString": {
      "type": [
        "string",
        "null"
      ]
    },
    "sourceIds": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": {
        "type": "string",
        "pattern": "^S[0-9]{2,}$"
      }
    },
    "company": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "slug",
        "name",
        "description",
        "sector",
        "stockIndex",
        "ticker",
        "website",
        "clubName",
        "clubUrl"
      ],
      "properties": {
        "slug": {
          "type": "string",
          "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
        },
        "name": {
          "type": "string",
          "minLength": 1
        },
        "description": {
          "type": "string",
          "minLength": 80,
          "maxLength": 420
        },
        "sector": {
          "type": "string",
          "minLength": 1
        },
        "stockIndex": {
          "type": "string",
          "minLength": 1
        },
        "ticker": {
          "$ref": "#/$defs/nullableString"
        },
        "website": {
          "type": "string",
          "format": "uri"
        },
        "clubName": {
          "$ref": "#/$defs/nullableString"
        },
        "clubUrl": {
          "anyOf": [
            {
              "type": "string",
              "format": "uri"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "offerClassification": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "primaryKind",
        "otherKinds",
        "officialProgrammeName",
        "status",
        "statusReason",
        "sourceIds"
      ],
      "properties": {
        "primaryKind": {
          "enum": [
            "shareholder_club",
            "shareholder_program",
            "shareholder_benefit",
            "investor_relations_only",
            "none",
            "unclear"
          ]
        },
        "otherKinds": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "enum": [
              "shareholder_club",
              "shareholder_program",
              "shareholder_benefit",
              "investor_relations_only"
            ]
          }
        },
        "officialProgrammeName": {
          "$ref": "#/$defs/nullableString"
        },
        "status": {
          "enum": [
            "active",
            "seasonal",
            "suspended",
            "discontinued",
            "not_found",
            "unclear"
          ]
        },
        "statusReason": {
          "type": "string",
          "minLength": 20
        },
        "sourceIds": {
          "$ref": "#/$defs/sourceIds"
        }
      }
    },
    "eligibility": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "globalMinimumShares",
        "eligibleShareClasses",
        "holdingModes",
        "minimumHoldingPeriod",
        "residencyRestrictions",
        "accountRestrictions",
        "proofRequired",
        "fees",
        "sourceIds"
      ],
      "properties": {
        "globalMinimumShares": {
          "type": [
            "integer",
            "null"
          ],
          "minimum": 1
        },
        "eligibleShareClasses": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "holdingModes": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "enum": [
              "bearer",
              "registered_administered",
              "registered_pure",
              "broker_account",
              "transfer_agent",
              "employee_plan",
              "unspecified",
              "unknown"
            ]
          }
        },
        "minimumHoldingPeriod": {
          "$ref": "#/$defs/nullableString"
        },
        "residencyRestrictions": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "accountRestrictions": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "proofRequired": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "fees": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "membershipFee",
            "applicationFee",
            "otherFees",
            "notes"
          ],
          "properties": {
            "membershipFee": {
              "$ref": "#/$defs/nullableString"
            },
            "applicationFee": {
              "$ref": "#/$defs/nullableString"
            },
            "otherFees": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "notes": {
              "$ref": "#/$defs/nullableString"
            }
          }
        },
        "sourceIds": {
          "$ref": "#/$defs/sourceIds"
        }
      }
    },
    "enrollment": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "required",
        "method",
        "applicationUrl",
        "contact",
        "steps",
        "processingTime",
        "renewal",
        "deadlines",
        "sourceIds"
      ],
      "properties": {
        "required": {
          "type": "boolean"
        },
        "method": {
          "enum": [
            "online_form",
            "email",
            "postal_mail",
            "phone",
            "broker_or_bank",
            "transfer_agent",
            "automatic",
            "not_applicable",
            "unknown"
          ]
        },
        "applicationUrl": {
          "anyOf": [
            {
              "type": "string",
              "format": "uri"
            },
            {
              "type": "null"
            }
          ]
        },
        "contact": {
          "$ref": "#/$defs/nullableString"
        },
        "steps": {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 5
          }
        },
        "processingTime": {
          "$ref": "#/$defs/nullableString"
        },
        "renewal": {
          "$ref": "#/$defs/nullableString"
        },
        "deadlines": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "sourceIds": {
          "$ref": "#/$defs/sourceIds"
        }
      }
    },
    "benefit": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "type",
        "title",
        "description",
        "value",
        "requiredShares",
        "requiredHoldingModes",
        "requiredHoldingPeriod",
        "availability",
        "validFrom",
        "validUntil",
        "requestDeadline",
        "procedure",
        "limitsAndExclusions",
        "primarySourceId",
        "supportingSourceIds",
        "sourceUrl",
        "evidenceGrade",
        "uncertainty"
      ],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^B[0-9]{2,}$"
        },
        "type": {
          "enum": [
            "reduction",
            "cadeau",
            "evenement",
            "service",
            "priorite"
          ]
        },
        "title": {
          "type": "string",
          "minLength": 5,
          "maxLength": 100
        },
        "description": {
          "type": "string",
          "minLength": 50,
          "maxLength": 700
        },
        "value": {
          "$ref": "#/$defs/nullableString"
        },
        "requiredShares": {
          "type": [
            "integer",
            "null"
          ],
          "minimum": 1
        },
        "requiredHoldingModes": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "requiredHoldingPeriod": {
          "$ref": "#/$defs/nullableString"
        },
        "availability": {
          "enum": [
            "guaranteed",
            "subject_to_capacity",
            "lottery",
            "seasonal",
            "discretionary",
            "unknown"
          ]
        },
        "validFrom": {
          "$ref": "#/$defs/nullableString"
        },
        "validUntil": {
          "$ref": "#/$defs/nullableString"
        },
        "requestDeadline": {
          "$ref": "#/$defs/nullableString"
        },
        "procedure": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "limitsAndExclusions": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "primarySourceId": {
          "type": "string",
          "pattern": "^S[0-9]{2,}$"
        },
        "supportingSourceIds": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string",
            "pattern": "^S[0-9]{2,}$"
          }
        },
        "sourceUrl": {
          "type": "string",
          "format": "uri"
        },
        "evidenceGrade": {
          "enum": [
            "A",
            "B",
            "C"
          ]
        },
        "uncertainty": {
          "$ref": "#/$defs/nullableString"
        }
      }
    },
    "faq": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "question",
        "answer",
        "sourceIds"
      ],
      "properties": {
        "question": {
          "type": "string",
          "minLength": 15,
          "maxLength": 180
        },
        "answer": {
          "type": "string",
          "minLength": 60,
          "maxLength": 900
        },
        "sourceIds": {
          "$ref": "#/$defs/sourceIds"
        }
      }
    },
    "claim": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "statement",
        "status",
        "sourceIds",
        "notes"
      ],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^C[0-9]{2,}$"
        },
        "statement": {
          "type": "string",
          "minLength": 10
        },
        "status": {
          "enum": [
            "verified",
            "partially_verified",
            "uncertain"
          ]
        },
        "sourceIds": {
          "$ref": "#/$defs/sourceIds"
        },
        "notes": {
          "$ref": "#/$defs/nullableString"
        }
      }
    },
    "rejectedClaim": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "claim",
        "reason",
        "sourceIds"
      ],
      "properties": {
        "claim": {
          "type": "string",
          "minLength": 10
        },
        "reason": {
          "enum": [
            "generic_legal_right",
            "generic_investor_relations",
            "not_shareholder_specific",
            "expired",
            "discontinued",
            "secondary_source_only",
            "contradicted",
            "insufficient_evidence",
            "duplicate"
          ]
        },
        "sourceIds": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string",
            "pattern": "^S[0-9]{2,}$"
          }
        }
      }
    },
    "source": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "url",
        "title",
        "publisher",
        "sourceType",
        "official",
        "publishedAt",
        "lastUpdatedAt",
        "accessedAt",
        "language",
        "status",
        "evidenceGrade",
        "evidenceSummary"
      ],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^S[0-9]{2,}$"
        },
        "url": {
          "type": "string",
          "format": "uri"
        },
        "title": {
          "type": "string",
          "minLength": 3
        },
        "publisher": {
          "type": "string",
          "minLength": 2
        },
        "sourceType": {
          "enum": [
            "official_webpage",
            "official_pdf",
            "official_terms",
            "official_faq",
            "official_form",
            "regulatory_filing",
            "transfer_agent",
            "official_partner",
            "web_archive",
            "reputable_secondary"
          ]
        },
        "official": {
          "type": "boolean"
        },
        "publishedAt": {
          "$ref": "#/$defs/nullableString"
        },
        "lastUpdatedAt": {
          "$ref": "#/$defs/nullableString"
        },
        "accessedAt": {
          "const": "2026-06-09"
        },
        "language": {
          "type": "string",
          "minLength": 2
        },
        "status": {
          "enum": [
            "current",
            "undated",
            "archived",
            "expired",
            "unavailable"
          ]
        },
        "evidenceGrade": {
          "enum": [
            "A",
            "B",
            "C",
            "D",
            "E"
          ]
        },
        "evidenceSummary": {
          "type": "string",
          "minLength": 20,
          "maxLength": 700
        }
      }
    },
    "conflict": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "topic",
        "sourceIds",
        "positions",
        "resolution",
        "impact"
      ],
      "properties": {
        "topic": {
          "type": "string",
          "minLength": 5
        },
        "sourceIds": {
          "$ref": "#/$defs/sourceIds"
        },
        "positions": {
          "type": "array",
          "minItems": 2,
          "items": {
            "type": "string"
          }
        },
        "resolution": {
          "$ref": "#/$defs/nullableString"
        },
        "impact": {
          "enum": [
            "none",
            "wording_only",
            "benefit_excluded",
            "blocks_development"
          ]
        }
      }
    },
    "handoff": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "researchStatus",
        "readyForDevelopment",
        "benefitCount",
        "faqCount",
        "blockingIssues",
        "developerNotes"
      ],
      "properties": {
        "researchStatus": {
          "enum": [
            "complete",
            "complete_with_uncertainties",
            "blocked"
          ]
        },
        "readyForDevelopment": {
          "type": "boolean"
        },
        "benefitCount": {
          "type": "integer",
          "minimum": 0,
          "maximum": 8
        },
        "faqCount": {
          "type": "integer",
          "minimum": 5,
          "maximum": 6
        },
        "blockingIssues": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "developerNotes": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

## 6. Transformation imposée au développeur

Le développeur ne recherche aucune donnée supplémentaire. Il utilise uniquement
le rapport approuvé par l'orchestrateur.

Correspondance vers `prisma/seed-data/companies/<slug>.json` :

| Dossier final | Rapport de recherche |
|---|---|
| `slug` | `company.slug` |
| `name` | `company.name` |
| `description` | `company.description` |
| `sector` | `company.sector` |
| `stockIndex` | `company.stockIndex` |
| `ticker` | `company.ticker`, omis si `null` |
| `website` | `company.website` |
| `clubName` | `company.clubName`, omis si `null` |
| `clubUrl` | `company.clubUrl`, omis si `null` |
| `minShares` | `eligibility.globalMinimumShares` |
| `lastVerifiedAt` | `researchAsOf` |
| `benefits` | champs `type`, `title`, `description`, `value`, `requiredShares`, `sourceUrl` de chaque bénéfice |
| `faqs` | champs `question`, `answer` de chaque FAQ |
| `sources` | URLs dédupliquées de `sources`, en mettant les sources officielles utilisées en premier |

Contraintes de transformation :

- conserver l'ordre des bénéfices du plus concret au plus informatif ;
- ne pas transformer `investor_relations_only` en club ;
- ne pas ajouter l'assemblée générale, le vote, le dividende ordinaire, un
  DSPP/DRIP/DRS ou des publications publiques aux bénéfices ;
- ne pas insérer `(Source : ...)` dans la description : le script d'import le
  fait à partir de `sourceUrl` ;
- conserver `requiredShares: null` lorsque le seuil propre au bénéfice n'est pas
  établi ;
- garder les incertitudes importantes dans le texte final ou exclure le bénéfice
  si elles empêchent une formulation fiable ;
- si `handoff.readyForDevelopment` vaut `false`, ne créer aucun dossier final.

## 7. Contrôle de l'orchestrateur

Une recherche ne passe à `ready_for_development` que si :

- le slug et les métadonnées correspondent au manifeste ;
- toutes les sources ont été consultées le 2026-06-09 ;
- la classification club/programme/avantage/IR est explicite ;
- le seuil global et les seuils par avantage ne sont pas confondus ;
- les modes de détention, frais, preuves, procédures et échéances ont été
  recherchés ;
- chaque bénéfice a une URL primaire précise et une preuve `A`, `B` ou `C` ;
- les bénéfices génériques ou non prouvés sont dans `rejectedClaims` ;
- le rapport contient au plus 8 bénéfices et exactement 5 ou 6 FAQ ;
- les conflits et incertitudes sont visibles ;
- le JSON est valide et respecte ce schéma ;
- un développeur peut générer le dossier final sans nouvelle recherche.
