# Revue orchestrateur - Batch 2

Date de revue : 2026-06-15
Date de référence des recherches : 2026-06-09
Périmètre : 17 rapports dans `research/company-dossiers/raw/`

## Résultat

- 17 rapports passent individuellement `scripts/validate-company-research.mjs`.
- 17 rapports sont `ready_for_development`.
- 0 rapport est `needs_research_revision`.
- 0 rapport reste en `blocked_metadata_conflict`.
- Bouygues révisé est confirmé conforme.
- Le conflit Teleperformance est levé par correction du manifeste vers
  `CAC Large 60`.
- Hershey, Walmart et Whitbread restent hors de cette revue.

La validation structurelle a été complétée par une revue de la classification,
des seuils, des modes de détention, des dates, des sources primaires, des
conflits, des affirmations rejetées et de la capacité à produire chaque dossier
final sans nouvelle recherche.

## Tableau de décision

| Société | Décision | Bénéfices approuvés | Décision de l'orchestrateur |
|---|---:|---:|---|
| Bouygues | `ready_for_development` | 1 | Révision confirmée. OLIS est désormais rejeté comme service générique; seule la gratuité de garde et de gestion au nominatif pur est admise. |
| Mapfre | `ready_for_development` | 5 | Club MAPFRE Accionista actif à partir de 1 000 actions avec résidence en Espagne. Ne pas confondre le niveau d'information accessible dès une action avec le niveau Plata. |
| McDonald's | `ready_for_development` | 0 | Relations investisseurs uniquement. Les coupons japonais concernent un autre émetteur et aucun cadeau, DSPP ou avantage actif n'est admissible. |
| Norwegian Cruise Line Holdings | `ready_for_development` | 1 | Crédit à bord unique et consolidé pour 100 actions, avec demande au moins quinze jours avant le départ et exclusions par réservation. |
| Pernod Ricard | `ready_for_development` | 3 | Club Premium à partir de 24 actions. Les événements sont soumis à candidature et tirage; les communications sont réservées aux membres; la garde gratuite au nominatif pur a un seuil distinct inconnu. |
| Procter & Gamble | `ready_for_development` | 0 | Relations investisseurs uniquement. EQ est l'agent actuel; DSPP, DRIP, DRS, coupons consommateurs et anciens sacs de produits sont exclus. |
| Repsol | `ready_for_development` | 3 | Club En acción dès une action. L'extra Waylet exige 50 actions; événements et tirages restent ponctuels et non garantis. |
| Royal Caribbean Group | `ready_for_development` | 1 | Crédit à bord unique pour 100 actions, à demander trois semaines avant le départ. Aucun cumul universel ne doit être promis. |
| Safran | `ready_for_development` | 3 | Cinq visites 2026, deux réunions régionales annoncées et gratuité au nominatif pur. Les salariés actionnaires et le FCPE restent exclus. |
| Saint-Gobain | `ready_for_development` | 6 | Club actuel dès une action. Visites, conférences, activités et jeux sont des catégories soumises aux places; garde et courtage au nominatif pur sont distincts. |
| Schneider Electric | `ready_for_development` | 1 | Le Comité Consultatif est sélectif et n'est pas un club ouvert. Seule la gratuité de garde et de gestion au nominatif pur est admise. |
| Stellantis | `ready_for_development` | 0 | Le Loyalty Voting Program est formel mais produit des droits de vote, pas un bénéfice commercial ou économique admissible. |
| STMicroelectronics | `ready_for_development` | 0 | Relations investisseurs uniquement. Global Invest Direct et l'ancienne page actionnaires ne prouvent aucun avantage réservé. |
| Telefónica | `ready_for_development` | 5 | Zona Accionistas active sans seuil numérique prouvé. Conserver les restrictions d'identification, les dates du tirage et les conditions propres à chaque offre. |
| Teleperformance | `ready_for_development` | 1 | Le manifeste est corrigé de `CAC40` vers `CAC Large 60`. Seule la gratuité au nominatif pur est admise. |
| Thales | `ready_for_development` | 1 | Malgré l'interruption initiale de l'agent, le rapport final est complet. Seule l'exonération des droits de garde au nominatif pur est retenue. |
| The Coca-Cola Company | `ready_for_development` | 1 | Le proxy 2026 prouve la plantation d'un arbre après inscription à l'e-delivery. Aucun bien, paiement ou avantage d'embouteilleur ne doit être ajouté. |

## Arbitrages détaillés

### Bouygues

La correction demandée dans le Batch 1 est entièrement appliquée :

- `benefits` contient uniquement la prise en charge des droits de garde et des
  frais de gestion au nominatif pur;
- OLIS-Actionnaires figure dans `rejectedClaims` avec le motif
  `generic_investor_relations`;
- la FAQ ne présente plus OLIS comme un bénéfice;
- `handoff.benefitCount` vaut 1;
- `handoff.readyForDevelopment` vaut `true`.

Bouygues passe donc à `ready_for_development`.

### Teleperformance

Teleperformance est sortie du CAC 40 lors de la revue annuelle Euronext 2025,
avec effet au 22 septembre 2025. Le titre reste dans le périmètre du
`CAC Large 60`, ce que confirme également le document d'enregistrement
universel 2025 déposé le 11 mars 2026.

Le manifeste est corrigé en :

```json
"stockIndex": "CAC Large 60"
```

Le seul `blockingIssue` du rapport reposait sur cette divergence. La correction
du manifeste lève le blocage et l'autorisation `ready_for_development` du
manifeste prévaut sur `handoff.readyForDevelopment: false` dans le rapport raw.

### Coca-Cola

Le mécanisme de plantation est admissible comme bénéfice de type `service` :

- le proxy officiel 2026 est une preuve `A`, actuelle et datée;
- il indique qu'un arbre est planté au nom de chaque actionnaire qui choisit
  la livraison électronique;
- la détention seule ne déclenche pas la plantation;
- aucun seuil d'actions, paiement, produit, coupon, certificat, lieu ou délai
  de plantation n'est publié.

`Tree Planting Program` doit être traité comme un libellé descriptif, pas comme
le nom d'un club ou d'une marque commerciale. Les admissions historiques au
World of Coca-Cola et les avantages des embouteilleurs restent exclus.

### Stellantis

Le `Loyalty Voting Program` justifie la classification
`shareholder_program`, son seuil d'une action et la description de sa procédure.
Il ne justifie aucun élément dans `benefits` :

- les actions spéciales obtenues après trois ans portent sur le vote;
- le contrat commun exclut les droits de vote des bénéfices;
- aucune remise véhicule, visite ou offre commerciale réservée n'est prouvée;
- l'ancien Club actionnaires PSA ne se transfère pas à Stellantis.

Le dossier final doit donc conserver `minShares: 1` et un tableau `benefits`
vide, en expliquant clairement que le programme relève de la gouvernance.

### Thales

L'interruption de l'agent ne constitue pas un défaut du rapport livré. Le JSON
final contient les sections obligatoires, six FAQ, sept sources officielles et
un handoff complet. La page Thales et les formulaires SGSS prouvent uniquement
l'exonération des droits de garde au nominatif pur.

Les réunions régionales mentionnées dans un guide SGSS générique n'ont ni
calendrier ni conditions propres à Thales et restent exclues.

### Safran

Le programme opérationnel 2026 prime sur les formulations générales :

- retenir cinq visites datées, pas six;
- conserver 15 places, le tirage, les priorités, les échéances et les frais de
  déplacement;
- retenir deux réunions régionales annoncées pour 2026, sans inventer lieux,
  dates, capacités ou garantie de participation;
- appliquer l'exclusion explicite des salariés actionnaires et du FCPE malgré
  les cases contradictoires de certains formulaires;
- exclure la prime de fidélité, les formations non datées et Investir Day.

### Saint-Gobain

La page officielle actuelle confirme un Club gratuit dès une action et publie
explicitement les catégories de visites, conférences, activités et jeux. Ces
catégories sont admissibles, mais leurs descriptions doivent rester prudentes :

- aucune place, date, fréquence, destination ou dotation précise n'est
  garantie;
- les exemples historiques ne doivent pas être reformulés comme programme
  2026;
- l'inscription est volontaire et déclarative, avec justificatif possible;
- la garde gratuite et le courtage à 0,30 % HT exigent le nominatif pur;
- aucun Cercle à 100 actions ni dividende majoré n'est prouvé.

## Autres arbitrages de métadonnées

- `STMicroelectronics` reste le nom public canonique du manifeste;
  `STMicroelectronics N.V.` peut être utilisé dans la description.
- Pour Thales, le dossier final reprend `stockIndex: "CAC40"` et
  `sector: "Aéronautique & Défense"` du manifeste; les variantes du rapport
  sont uniquement typographiques ou descriptives.
- `Mapfre` reste la graphie catalogue du manifeste; `MAPFRE` peut être employé
  dans le nom officiel du Club et le corps du texte.
- Les noms publics `Norwegian Cruise Line Holdings` et
  `Royal Caribbean Group` restent canoniques, même lorsque les documents
  réglementaires utilisent une raison sociale plus longue.

## Consignes communes aux développeurs

1. Ne prendre en charge que les sociétés dont le manifeste porte le statut
   `ready_for_development`.
2. Utiliser exclusivement le rapport raw approuvé et les arbitrages de cette
   revue; aucune nouvelle recherche ne doit être nécessaire.
3. Utiliser `lastVerifiedAt: "2026-06-09"` pour chaque dossier final.
4. Reprendre les métadonnées canoniques du manifeste lorsqu'elles diffèrent
   d'une variante descriptive du rapport.
5. Omettre `clubName` et `clubUrl` lorsqu'ils valent `null`; un programme de
   vote, un comité sélectif ou un espace IR ne devient pas un club.
6. Reprendre exactement le nombre de bénéfices approuvé dans le tableau.
7. Ne pas ajouter le vote, l'assemblée générale, le dividende ordinaire, un
   DRS/DSPP/DRIP, un portail de compte ou une publication publique.
8. Conserver chaque seuil propre à chaque bénéfice. Un seuil inconnu reste
   `null` et ne devient jamais automatiquement `1`.
9. Conserver dans les descriptions les modes de détention, territoires,
   durées, frais, échéances, preuves, capacités, tirages et exclusions.
10. Pour un programme événementiel sans calendrier public complet, décrire une
    possibilité soumise à capacité, jamais un événement garanti.
11. Les offres datées ou saisonnières conservent leurs dates absolues et ne
    doivent jamais être reformulées comme permanentes.
12. Ne pas écrire `(Source : ...)` dans les descriptions; le script d'import
    l'ajoute à partir de `sourceUrl`.
13. Dédupliquer `sources` et placer en premier les sources officielles utilisées
    par les bénéfices, l'éligibilité et les FAQ.
14. Reprendre les cinq à six FAQ sans réintroduire une affirmation classée dans
    `rejectedClaims`.
15. Valider chaque dossier final avant toute exécution de
    `prisma/update-from-dossiers.ts`.

## Consignes spécifiques de transformation

- **Mapfre** : conserver le seuil de 1 000 actions et la résidence en Espagne.
- **Croisiéristes** : produire un seul bénéfice de crédit à bord par société,
  pas un bénéfice par durée, devise ou marque.
- **Pernod Ricard** : le seuil de 24 actions ne s'applique pas à la gratuité au
  nominatif pur.
- **Repsol** : le seuil global est 1 action; l'extra Waylet exige 50 actions.
- **Safran** : seules cinq visites sont prouvées pour 2026.
- **Saint-Gobain** : les quatre catégories du Club restent conditionnelles; les
  deux avantages de compte exigent le nominatif pur.
- **Schneider Electric** : le seuil de 25 actions concerne uniquement la
  candidature au Comité Consultatif.
- **Stellantis** : `benefits` reste vide malgré l'existence du programme.
- **Telefónica** : tous les seuils d'actions restent `null`.
- **Teleperformance** : utiliser `CAC Large 60` malgré le handoff raw bloqué.
- **Coca-Cola** : ne pas transformer la plantation en don reçu par
  l'actionnaire et ne nommer aucun partenaire de plantation.

## Ordre de développement recommandé

1. McDonald's, Procter & Gamble, Stellantis et STMicroelectronics.
2. Bouygues, Schneider Electric, Teleperformance, Thales et Coca-Cola.
3. Norwegian Cruise Line Holdings et Royal Caribbean Group.
4. Pernod Ricard, Repsol, Safran et Saint-Gobain.
5. Mapfre et Telefónica.

Hershey, Walmart et Whitbread restent en `pending_research` jusqu'à leur revue
dans un batch ultérieur.
