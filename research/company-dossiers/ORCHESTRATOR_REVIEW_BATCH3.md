# Orchestrator Review - Batch 3

Date de revue : 2026-06-16
Date de recherche cible : 2026-06-09

## Verdict

Les 3 rapports restants sont approuves pour developpement :

- The Hershey Company (`hershey`) : approuve avec zero benefice actif.
- Walmart (`walmart`) : approuve avec zero benefice actif.
- Whitbread (`whitbread`) : approuve avec un benefice actif.

Les trois fiches peuvent etre transformees en dossiers Prisma en conservant les metadonnees normalisees du manifeste.

## Arbitrages

### The Hershey Company

Le rapport ne prouve aucun club actionnaire, catalogue courant ni cadeau actif reserve aux actionnaires. La mention 2026 d'une sample box reste insuffisante : le formulaire n'est pas accessible et aucune condition de prix, seuil, preuve, frais ou periode n'est publiee. Le dossier final doit donc rester sans benefice et sans club.

Exclusions a conserver : catalogues historiques, Holiday Gift, sample boxes non conditionnees, services Computershare, DSPP, DRIP, DRS, dividende ordinaire et assemblee.

### Walmart

Walmart conserve un espace de relations investisseurs, mais aucun avantage commercial reserve aux actionnaires externes n'est publie au 9 juin 2026. L'Associate Celebration 2025 etait ponctuelle et expiree; les avantages associes aux salaries ne s'appliquent pas aux actionnaires externes.

La description peut mentionner le passage de l'action WMT au Nasdaq Global Select Market depuis le 9 decembre 2025. Cette information reste factuelle et ne doit pas etre presentee comme un avantage actionnaire.

### Whitbread

Le seul benefice publiable est le petit-dejeuner Premier Inn gratuit pour les titulaires d'au moins 64 actions, sous reserve de disponibilite et jusqu'au 30 juin 2027. La carte originale et le courriel de confirmation sont requis; une photographie ou copie de la carte ne suffit pas. L'actionnaire doit occuper l'une des chambres, dans la limite de deux adultes par chambre et deux chambres.

La reduction restaurant historique de 10 % reste exclue : la page officielle actuelle mentionne un avantage restaurant sans taux, marques, exclusions ou periode suffisamment precis. Les Premier Inn allemands ne sont pas couverts par les conditions retenues.

## Handoff developpement

Consignes communes :

- utiliser `researchAsOf` comme `lastVerifiedAt`;
- utiliser le secteur et l'indice du manifeste lorsque les sources emploient une variante;
- ne pas ajouter de marqueurs de source dans les descriptions, car l'import Prisma ajoute deja `(Source : URL)`;
- limiter les avantages aux elements de `benefits[]` des rapports bruts;
- conserver 5 ou 6 FAQ selon le rapport brut.
