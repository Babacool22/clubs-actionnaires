# Google Search Console API

Ce dossier configure le suivi Search Console pour `clubsactionnaires.fr` sans committer de secret.

## Ce que Google permet

- L'API Search Analytics donne les clics, impressions, CTR et position par dimensions (`date`, `page`, `query`, `country`, `device`, `hour`).
- `dataState=all` inclut les donnees fraiches, mais elles restent partielles.
- Le "temps reel" GSC n'est pas instantane: il faut le lire comme un suivi quasi temps reel / quotidien.
- Le Bulk Data Export se configure dans Search Console et pousse les donnees vers BigQuery chaque jour.

Sources:
- Search Analytics API: https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- Auth Search Console API: https://developers.google.com/webmaster-tools/v1/how-tos/authorizing
- Bulk export BigQuery: https://support.google.com/webmasters/answer/12918484

## 1. Activer l'API

1. Ouvre Google Cloud Console.
2. Cree ou choisis un projet.
3. Active `Google Search Console API`.
4. Cree un service account.
5. Telecharge le JSON du service account dans `secrets/google-service-account.json`.
6. Dans Search Console, ajoute l'e-mail du service account comme utilisateur de la propriete.

La propriete doit correspondre exactement a la valeur de `GSC_SITE_URL`:

```env
GSC_SITE_URL="sc-domain:clubsactionnaires.fr"
GOOGLE_APPLICATION_CREDENTIALS="./secrets/google-service-account.json"
GSC_DATA_STATE="all"
```

Puis teste l'acces:

```bash
npm run gsc:sites
```

## 2. Télécharger les performances Search Analytics

Derniers jours finalises + donnees fraiches:

```bash
npm run gsc:download
```

Exemples utiles:

```bash
npm run gsc:download -- --start 2026-07-01 --end 2026-07-25 --dimensions date,page,query
npm run gsc:download -- --dimensions page,query --pageContains /entreprises/lvmh
npm run gsc:download -- --dimensions date,hour,page --dataState hourly_all --maxRows 25000
```

Les exports locaux vont dans `data/gsc/`:

- `.json` complet
- `.csv` exploitable dans un tableur
- `.md` rapport lisible

## 3. Activer le Bulk Data Export GSC vers BigQuery

1. Dans Google Cloud, active BigQuery et la facturation.
2. Cree un dataset, par exemple `search_console`.
3. Dans Search Console: `Settings > Bulk data export`.
4. Renseigne le projet Cloud et le dataset.
5. Attends le premier export quotidien.

Configure ensuite:

```env
GSC_BQ_PROJECT_ID="ton-projet-google-cloud"
GSC_BQ_DATASET="search_console"
GSC_BQ_TABLE="searchdata_url_impression"
```

Puis:

```bash
npm run gsc:bulk -- --start 2026-07-01 --end 2026-07-25 --limit 10000
```

## 4. Routine de suivi recommandee

- Chaque matin: `npm run gsc:download`
- Chaque semaine: exporter `date,page,query` et regarder les pages avec fortes impressions / CTR faible.
- Chaque mois: utiliser `npm run gsc:bulk` pour analyser toutes les lignes BigQuery, surtout les requetes longues et pages profondes.

Important: garde `secrets/` et `data/gsc/` hors Git. Ils sont ignores par `.gitignore`.
