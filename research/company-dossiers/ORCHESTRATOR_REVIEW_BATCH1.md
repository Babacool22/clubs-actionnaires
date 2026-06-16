# Revue orchestrateur - Batch 1

Date de revue : 2026-06-10
Date de référence des recherches : 2026-06-09
Périmètre : 20 rapports dans `research/company-dossiers/raw/`

## Résultat

- 20 rapports passent individuellement `scripts/validate-company-research.mjs`.
- 19 rapports sont `ready_for_development`.
- 1 rapport est `needs_research_revision`.
- 0 rapport reste en `blocked_metadata_conflict`.

Le validateur structurel ne suffit pas à approuver une fiche. La présente revue
contrôle également la classification, l'admissibilité des bénéfices, les seuils,
les conflits, les métadonnées et la capacité d'un développeur à produire le
dossier final sans nouvelle recherche.

## Tableau de décision

| Société | Décision | Bénéfices approuvés | Décision de l'orchestrateur |
|---|---:|---:|---|
| 3M | `ready_for_development` | 0 | La Holiday Gift Box 2026 n'est pas prouvée. Produire une fiche sans club et sans bénéfice actif. |
| Air Liquide | `ready_for_development` | 5 | Prime de fidélité, attribution 2026 et frais du nominatif prouvés. Les deux attributions du 10 juin 2026 doivent rester strictement datées. |
| Airbus | `ready_for_development` | 1 | `Airbus` reste le nom public canonique; `Airbus SE` est la raison sociale. Conserver le secteur et l'indice normalisés du manifeste. |
| Alstom | `ready_for_development` | 1 | Le manifeste est corrigé de `CAC40` vers `SBF 120`. Le seul blocage du rapport est donc levé par décision de l'orchestrateur. |
| ArcelorMittal | `ready_for_development` | 0 | Simple espace de relations investisseurs; aucun club, visite ou avantage actuel prouvé. |
| Banco Santander | `ready_for_development` | 8 | Programme actif. Conserver les restrictions espagnoles, les comptes requis et les seuils propres aux avantages. |
| Berkshire Hathaway | `ready_for_development` | 1 | Seule la réduction GEICO de 8 % au New Jersey reste active. Les offres du week-end 2026 sont expirées. |
| Bouygues | `needs_research_revision` | 1 après correction | OLIS est un portail standard de gestion des titres, pas un bénéfice admissible. Le rapport doit être corrigé avant développement. |
| Capgemini | `ready_for_development` | 1 | Seule la gratuité de la gestion courante au nominatif pur est admise. |
| Carnival Corporation | `ready_for_development` | 1 | Le crédit à bord est un bénéfice unique consolidant durées, devises et marques. |
| Crédit Agricole S.A. | `ready_for_development` | 5 | Club actif à partir de 50 actions ACA hors PEE. Les billets ne doivent pas être décrits comme gratuits ou illimités. |
| Danone | `ready_for_development` | 1 | Seuls les droits de garde gratuits au nominatif pur sont retenus. La prime de fidélité historique est contredite. |
| Edenred | `ready_for_development` | 2 | Le manifeste est corrigé de `CAC40` vers `CAC Next 20`. Seuil de 1 action au nominatif et de 30 actions au porteur. |
| EssilorLuxottica | `ready_for_development` | 1 | Seule l'absence de frais de garde et d'administration au nominatif pur est retenue. |
| Eurofins Scientific | `ready_for_development` | 0 | Relations investisseurs uniquement, sans bénéfice concret réservé. |
| Generali | `ready_for_development` | 6 | Club formel et offres 2026 prouvées. L'initiative Leone Alato ne doit comporter aucune promesse de remise non publiée. |
| Iberdrola | `ready_for_development` | 3 | Les invitations, visites et tirages sont admis comme catégories discrétionnaires, sans campagne garantie ouverte au cutoff. |
| Intesa Sanpaolo | `ready_for_development` | 7 | Club actif à partir de 1 000 actions détenues 12 mois. Les quatre offres Plus expirent le 30 juin 2026. |
| Kering | `ready_for_development` | 2 | Invitations discrétionnaires et frais du nominatif pur seulement. Aucun club ni événement déterminé garanti. |
| Legrand | `ready_for_development` | 1 | Conserver la taxonomie du manifeste. Les visites 2025 sont expirées; seule la gratuité au nominatif pur est admise. |

## Arbitrages de métadonnées

### Airbus

Le manifeste conserve `name: "Airbus"`, utilisé comme nom public sur le site.
Le rapport peut employer `Airbus SE` dans la description pour désigner la raison
sociale. Il ne s'agit pas de deux entités différentes.

Le dossier final doit reprendre les valeurs canoniques du manifeste :

- `sector: "Aéronautique & Défense"`
- `stockIndex: "CAC40"`

### Alstom

Alstom est sortie du CAC 40 avec effet au 18 mars 2024. Les documents officiels
2025/2026 la rattachent au SBF 120. Le manifeste est corrigé en
`stockIndex: "SBF 120"`.

Le `handoff.readyForDevelopment: false` du rapport reposait uniquement sur ce
conflit. La correction du manifeste lève le blocage; l'autorisation
`ready_for_development` du manifeste constitue l'arbitrage final.

### Edenred

Les sources officielles au 9 juin 2026 placent Edenred dans le CAC Next 20.
Le manifeste est corrigé en `stockIndex: "CAC Next 20"`.

### Legrand

Les différences suivantes sont des variantes de présentation, pas des conflits :

- `CAC 40` dans le rapport correspond à la valeur normalisée `CAC40` ;
- le secteur détaillé du rapport reste résumé par la taxonomie catalogue
  `Industrie & Équipements`.

Le dossier final doit utiliser les valeurs du manifeste.

## Révision obligatoire de Bouygues

Le rapport Bouygues ne peut pas être transmis au développement dans son état
actuel.

Correction attendue, sans nouvelle recherche externe :

1. Supprimer `B02` relatif à OLIS-Actionnaires du tableau `benefits`.
2. Ajouter OLIS dans `rejectedClaims` avec le motif
   `generic_investor_relations`.
3. Modifier la FAQ qui présente OLIS comme un avantage concret.
4. Ramener `handoff.benefitCount` de 2 à 1.
5. Maintenir uniquement la prise en charge des droits de garde et frais de
   gestion au nominatif pur.
6. Passer `handoff.readyForDevelopment` à `true` après validation.

OLIS reste utilisable dans une FAQ de procédure ou de gestion des titres, mais
ne doit pas apparaître dans le tableau des bénéfices.

## Consignes communes aux développeurs

1. Ne prendre en charge que les sociétés dont le manifeste porte le statut
   `ready_for_development`.
2. Considérer les métadonnées du manifeste comme canoniques lorsque cette revue
   arbitre une différence avec le rapport.
3. Utiliser `lastVerifiedAt: "2026-06-09"` dans chaque dossier final.
4. Omettre `clubName` et `clubUrl` lorsqu'ils valent `null`; ne jamais créer un
   club à partir d'un simple espace de relations investisseurs.
5. Utiliser uniquement les bénéfices approuvés dans le tableau et les
   `orchestratorNotes` du manifeste.
6. Ne pas ajouter le vote, l'assemblée générale, le dividende ordinaire, un
   DRS/DSPP/DRIP standard, un portail de compte ou des publications publiques.
7. Conserver les seuils propres à chaque bénéfice. Un seuil inconnu reste
   `null`; il ne devient jamais automatiquement `1`.
8. Conserver les modes de détention, durées, territoires, frais, échéances,
   capacités, tirages et exclusions dans les descriptions finales.
9. Ne pas écrire `(Source : ...)` dans les descriptions : le script d'import
   l'ajoute à partir de `sourceUrl`.
10. Dédupliquer `sources` et placer en premier les sources officielles réellement
    utilisées par les bénéfices et les FAQ.
11. Reprendre les 5 à 6 FAQ du rapport sans réintroduire une affirmation rejetée.
12. Les offres datées ou saisonnières doivent conserver leur date absolue et ne
    jamais être reformulées comme permanentes.
13. Pour Air Liquide, utiliser le type `priorite` pour la majoration du dividende;
    les actions gratuites restent de type `cadeau`.
14. Valider le JSON final avant toute exécution de
    `prisma/update-from-dossiers.ts`.

## Ordre de développement recommandé

La première vague de développement peut traiter les fiches sans bénéfice ou à
bénéfice unique, puis les programmes les plus complexes :

1. 3M, ArcelorMittal, Eurofins Scientific.
2. Airbus, Alstom, Berkshire Hathaway, Capgemini, Carnival Corporation, Danone,
   EssilorLuxottica, Legrand.
3. Air Liquide, Crédit Agricole S.A., Edenred, Generali, Iberdrola, Kering.
4. Banco Santander et Intesa Sanpaolo.

Bouygues reste hors de la file de développement jusqu'à validation d'un rapport
raw révisé.
