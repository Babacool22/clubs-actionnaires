# Brief d'implémentation — accès actionnaires

Date de consolidation : 31 juillet 2026
Périmètre : 52 entreprises auditées dans `group-1.json` à `group-5.json`
Source canonique : `consolidated.json`

## Décision de modèle

Le champ `minShares` ne doit plus servir à déduire le statut du programme. Une valeur `null` possède trois sens possibles, déterminés par `programStatus` :

- `no_program` : aucun seuil n'est applicable, car aucun programme n'existe ;
- `unclear` : une offre est possible ou historique, mais son seuil actuel n'est pas vérifiable ;
- `formal_club`, `shareholder_benefit` ou `shareholder_services` : le programme ou service existe, mais aucun seuil chiffré n'est officiellement publié.

Le rendu doit donc consommer explicitement `programStatus`, `thresholdLabelFr` et `alternateThresholds`. Il ne doit jamais traduire automatiquement `minShares = null` par « À vérifier ».

## Corrections de seuil prioritaires

| Entreprise | Donnée actuelle | Donnée canonique | Motif |
| --- | ---: | ---: | --- |
| Airbus | `null` | 1 | Une action suffit pour les droits et services ; aucun seuil supérieur n'est publié. |
| Alstom | `null` | 1 | Aucun minimum supérieur n'est requis pour le nominatif pur. |
| Berkshire Hathaway | `null` | 1 | Une action A ou B suffit pour demander l'accréditation au week-end actionnaires. |
| Bouygues | `null` | 1 | Une action inscrite au nominatif donne accès à Olis. |
| Capgemini | `null` | 1 | L'avantage du nominatif pur s'applique à partir d'une action. |
| Danone | `null` | 1 | La gratuité des droits de garde au nominatif pur s'applique dès une action. |
| Dassault Systèmes | 1 | `null` | Aucun programme réservé n'est vérifié ; les droits ordinaires ne constituent pas un avantage. |
| EssilorLuxottica | `null` | 1 | Les frais de garde et d'administration sont gratuits au nominatif pur dès une action. |
| Iberdrola | `null` | 1 | Le Club OLS exige simplement la qualité d'actionnaire. |
| Legrand | `null` | 1 | Les visites ponctuelles sont ouvertes aux actionnaires sans seuil supérieur publié. |
| Michelin | 1 | `null` | Aucun club actif ; le comité consultatif restreint n'est pas un programme ouvert. |
| Rémy Cointreau | 1 | `null` | Le Club est confirmé, mais le chiffre d'une action n'est pas explicitement publié. |
| Sanofi | 1 | `null` | Sanofi confirme explicitement l'absence de club ou comité actionnaires. |
| Schneider Electric | `null` | 1 | Une action suffit pour les services généraux ; 25 actions ne concernent que le Comité consultatif. |
| Telefónica | `null` | 1 | L'espace d'offres exige la qualité d'actionnaire, sans seuil supérieur publié. |

## Seuils multiples à représenter

- Compagnie des Alpes : 1 action pour le Club ; 400 actions au nominatif depuis deux ans pour les Bons Actionnaires.
- Edenred : 1 action au nominatif ; 30 actions au porteur. La page opérationnelle actuelle prime sur l'ancien PDF contradictoire.
- Mapfre : 1 action pour le dispositif général d'information ; 1 000 actions et résidence en Espagne pour le véritable Club.
- Orange : 1 action pour le Club classique ; plus de 1 500 actions pour les After Hours Premium.
- Repsol : 1 action pour le Club ; 50, 850, 2 500 et 12 500 actions pour les paliers Waylet.
- TotalEnergies : 50 actions au nominatif ; 100 actions au porteur.

## Statuts à corriger

### Clubs formels — 19

Arkema, Compagnie des Alpes, Crédit Agricole, Edenred, FDJ United, Generali, Iberdrola, Intesa Sanpaolo, Jungfraubahn Holding, LVMH, Mapfre, Orange, OVHcloud, Pernod Ricard, Rémy Cointreau, Repsol, Saint-Gobain, TotalEnergies et Vinci.

### Avantages actionnaires sans club — 7

Berkshire Hathaway, Carnival Corporation, Legrand, Norwegian Cruise Line, Royal Caribbean, Telefónica et Whitbread.

### Services actionnaires sans club d'avantages — 13

Airbus, Alstom, Banco Santander, Bouygues, Capgemini, Danone, EssilorLuxottica, Publicis, Schneider Electric, Stellantis, Teleperformance, Thales et Veolia.

### Aucun programme — 11

ArcelorMittal, Coca-Cola, Dassault Systèmes, Eurofins Scientific, Kering, McDonald's, Michelin, Procter & Gamble, Sanofi, STMicroelectronics et Walmart.

### Situation réellement incertaine — 2

- 3M : l'offre Holiday Gift Box 2025 est officielle, mais aucune édition 2026 ni aucun seuil 2026 ne sont publiés.
- Hershey : une sample box ponctuelle est mentionnée pour l'assemblée 2026, sans conditions publiques encore vérifiables.

## Libellés honnêtes à conserver

- 3M : « Offre saisonnière 2026 non confirmée — seuil non publié ».
- Hershey : « Sample box ponctuelle mentionnée — conditions non publiées ».
- Rémy Cointreau : « Club confirmé — seuil chiffré non publié ». Ne pas afficher « 1 action » tant qu'une source officielle ne l'énonce pas.
- Banco Santander : « Services actionnaires actifs — anciens avantages commerciaux non confirmés ».

## Règles UI pour supprimer les faux « À vérifier »

1. Ajouter une donnée d'accès structurée par entreprise, idéalement une table ou un document versionné reprenant exactement le schéma de `consolidated.json`.
2. Afficher `thresholdLabelFr` comme valeur de référence. `minShares` ne sert qu'au calcul du coût et aux résumés numériques lorsqu'il est non nul.
3. Afficher le calcul d'investissement uniquement pour un seuil d'accès économique réel. Pour `no_program`, afficher « Non applicable » ; pour `unclear`, « Non publié » ; pour un seuil non chiffré mais un programme actif, « Aucun seuil chiffré publié ».
4. Masquer entièrement le parcours d'inscription pour `no_program`. Le remplacer par un bloc factuel « Aucun programme actionnaire actif identifié » avec la source officielle.
5. Adapter le titre du panneau au statut : « Rejoindre le club », « Demander l'avantage » ou « Accéder aux services actionnaires ». Ne jamais afficher « Comment accéder aux avantages ? » pour un simple service ou une absence de programme.
6. Pour `shareholder_services`, ne pas transformer l'AG, le dividende, le vote ou les publications publiques en avantages commerciaux.
7. Pour `alternateThresholds`, rendre chaque condition séparément et préciser l'avantage concerné. Le plus petit seuil ne doit pas masquer les paliers supérieurs.
8. Utiliser directement `holdingModeFr`, `membershipCostFr`, `proofRequirementFr` et `procedureFr`. Les heuristiques textuelles actuelles de `getHoldingMode`, `getMembershipCost` et `getProofRequirement` doivent devenir un secours, pas la source principale.
9. Conserver la date de vérification et au moins une URL officielle visible. Les sources secondaires ne servent qu'à corroborer une source officielle ou à documenter une incertitude.
10. Répliquer le même statut et les mêmes seuils dans la version anglaise ; seules les chaînes doivent être traduites.

## Défauts actuels identifiés dans le rendu

- `RegistrationPanel` affiche « À vérifier » dès que `minShares` est nul, y compris quand le seuil est non applicable.
- Le coût estimé affiche aussi « À vérifier » quand aucun investissement d'accès ne doit être calculé.
- La première étape impose toujours de « détenir les actions requises », même pour une entreprise sans programme ou sans seuil chiffré publié.
- La page française déduit le mode de détention, le justificatif et la gratuité à partir d'une FAQ sélectionnée par score. Cette extraction perd les seuils alternatifs et confond souvent absence d'information et absence de programme.
- La présence de bénéfices ou d'un `clubUrl` suffit actuellement à afficher un parcours d'inscription. Cela crée notamment de faux parcours pour Dassault Systèmes, Michelin, Sanofi et d'autres fiches où les éléments listés sont des droits ordinaires ou de simples relations investisseurs.
- La page anglaise utilise encore `company.minShares ?? 1` dans son texte de synthèse. Cette valeur par défaut invente une action pour les seuils nuls et doit être supprimée.
- Les traductions anglaises de Berkshire Hathaway, Legrand et Royal Caribbean contiennent des formulations contradictoires avec leur avantage actionnaire actif ; elles doivent être réalignées sur la source canonique.

## Divergences documentaires résolues

- Edenred : la page d'adhésion actuelle fixe 30 actions au porteur ; elle prime sur l'ancien règlement PDF indiquant une action.
- FDJ United : le guide 2026 évoque la France métropolitaine, alors que les conditions et le formulaire actifs acceptent plusieurs pays. Ne pas promettre une éligibilité mondiale sans réserve.
- Mapfre : le service général commence dès une action, mais le Club exige bien 1 000 actions et une résidence en Espagne.
- Michelin et Veolia : les comités consultatifs restreints ne sont pas des clubs ouverts à tous les actionnaires.
- McDonald's : le programme de coupons de Japan McDonald's Holdings appartient à une société cotée distincte.
- Stellantis : le registre de fidélité donne un droit de vote spécial après trois ans ; ce n'est pas un club d'avantages ni le programme salarié « The Stellantis Club ».
- TotalEnergies : le seuil varie selon le mode de détention et ne doit pas être réduit au seul chiffre de 50.
- 3M, Hershey et Rémy Cointreau : aucune valeur manquante n'a été comblée par déduction.

## Contrôle des traductions anglaises

Les 52 slugs disposent d'une traduction anglaise. Lors de l'implémentation, traduire les champs canoniques et corriger en priorité :

- les 15 écarts de `minShares` listés plus haut ;
- les trois contradictions détectées pour Berkshire Hathaway, Legrand et Royal Caribbean ;
- tout texte anglais qui présente `null` comme « Check official page » au lieu de distinguer non-applicabilité, absence de seuil publié et incertitude réelle ;
- les intitulés génériques « club » ou « benefits » pour les 13 simples services actionnaires et les 11 absences de programme.

## Garde-fous de validation

- exactement 52 entrées et 52 slugs uniques ;
- un seul des cinq statuts autorisés par entrée ;
- `minShares` entier positif ou `null` ;
- `officialUrl` et chaque `source.url` en HTTPS lorsque la source le permet ;
- aucune valeur `À vérifier` stockée comme donnée métier ;
- toute incertitude portée par `programStatus = unclear`, `thresholdLabelFr` et `notes` ;
- cohérence FR/EN contrôlée par slug avant déploiement.
