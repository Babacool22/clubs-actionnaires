# SEO Audit — fiches `/entreprises/[slug]`

**Date :** 2026-05-15
**Scope :** pages `app/entreprises/[slug]/page.tsx` + données `prisma/seed.ts` + 19 entreprises CAC40

---

## 1. Schéma de données — gaps bloquants

| Gap | Impact | Fix requis |
|---|---|---|
| `Benefit.requiredShares` absent | L'objectif central ("nombre d'actions par avantage") n'est pas stockable. Seul `Company.minShares` existe (seuil global). | Ajouter `requiredShares Int?` au modèle Benefit |
| `Benefit.source` / `sourceUrl` absent | Pas d'évidence E-E-A-T : impossible de citer la source officielle (rapport actionnaire, page club) | Ajouter `sourceUrl String?` |
| `Benefit.conditions` absent | Conditions (durée détention, nominatif/au porteur, plafond) noyées dans description | Ajouter `conditions String?` |
| `Company.lastVerifiedAt` absent | Pas de signal fraîcheur — critique pour Google et AI Overviews | Ajouter `lastVerifiedAt DateTime?` |

## 2. Métadonnées — gaps critiques

`app/entreprises/[slug]/page.tsx:14-22` :

```
title: `${company.name} — CLUBS ACTIONNAIRES`
description: `Avantages actionnaires de ${company.name}.`
```

- ❌ Description générique répliquée 19× → contenu dupliqué côté meta
- ❌ Pas de `keywords` (acceptable mais surtout : titre sans intent keyword "club actionnaire X", "avantages actionnaire X")
- ❌ Pas de `openGraph` ni `twitter` per-page (hérite du layout, donc tous identiques)
- ❌ Pas de `alternates.canonical` per-page
- ❌ Pas de `robots` per-page (hérite layout)

## 3. Schema.org — gaps

- ✅ BreadcrumbList présent (`BreadcrumbSchema`)
- ✅ FAQPage présent (`components/Faq.tsx`)
- ❌ Pas de `Organization` ou `Corporation` JSON-LD pour l'entreprise (logo, sameAs, ticker via `tickerSymbol`)
- ❌ Pas de `ItemList` pour les avantages (or c'est une liste structurée parfaite pour rich results)
- ❌ Pas de `Offer` / `Service` schema sur chaque Benefit

## 4. Contenu — gaps E-E-A-T & AI Overviews

Échantillon `prisma/seed.ts:50-100` (Air France, LVMH) :

| Champ | Problème | Exemple |
|---|---|---|
| `description` Benefit | Vague, marketing, non actionnable | "Tarifs préférentiels sur une sélection de champagnes" → combien ? À partir de combien d'actions ? Quelles maisons ? |
| `value` Benefit | Quasi toujours `null` | Sur Air France : 3 benefits, 0 `value`. Sur LVMH : majorité `null`. |
| Seuil d'actions par avantage | Inexistant | LVMH : club ouvert dès 1 action, mais accès Fondation = sans condition, vins = palier différent, jamais explicité |
| Source / date vérification | Absent | Pas de signal de fraîcheur, pas de citation officielle |

→ Une page comme `/entreprises/lvmh` ne répond pas aux requêtes type *"combien d'actions LVMH pour avoir les avantages"*, *"club actionnaire LVMH conditions"* → mauvais ranking et zéro chance d'AI Overview.

## 5. Autres signaux

- ✅ `robots.ts` + `sitemap.ts` présents (à vérifier en runtime)
- ✅ Generation statique des 19 fiches au build
- ❓ Pas de `lastmod` dynamique dans sitemap (à confirmer)
- ❌ Pas d'image OG dédiée par entreprise (logo company + avantages count serait idéal)
- ❌ Pas de mentions auteur / éditeur (`author`, `publisher` schema) → E-E-A-T faible

---

## 6. Synthèse — chantiers prioritaires

### P0 (bloquant pour l'objectif Bastien)
1. **Schéma Prisma** : ajouter `Benefit.requiredShares`, `Benefit.sourceUrl`, `Benefit.conditions`, `Company.lastVerifiedAt` (migration + regen)
2. **Re-recherche données** : pour chaque benefit des 19 entreprises, retrouver via sources officielles le seuil d'actions précis, la valeur chiffrée et l'URL source

### P1 (SEO immédiat)
3. **`generateMetadata`** : description riche unique par entreprise (inclure : nb d'avantages, secteur, ticker, seuil mini)
4. **JSON-LD Corporation** : logo, sameAs (Wikipedia, Boursorama), tickerSymbol
5. **JSON-LD ItemList** des Benefits
6. **`Faq`** : générer 4-6 FAQs riches par entreprise (combien d'actions, où acheter, conditions, club nominatif/porteur)

### P2 (E-E-A-T)
7. Bandeau "Vérifié le DD/MM/YYYY — Source : club X" sur la fiche
8. Lien vers source officielle dans chaque Benefit

---

## 7. Données attendues côté researchers (output schéma)

Format JSON par entreprise, consommable par le copywriter :

```json
{
  "slug": "lvmh",
  "minShares": 1,
  "clubName": "Club Actionnaires LVMH",
  "clubUrl": "https://www.clublvmh-actionnaires.fr",
  "lastVerifiedAt": "2026-05-15",
  "sources": ["https://...", "https://..."],
  "benefits": [
    {
      "type": "reduction",
      "title": "Tarifs préférentiels Hennessy & Moët",
      "requiredShares": 1,
      "value": "jusqu'à -30%",
      "conditions": "Nominatif administré ou pur — 1 commande/an",
      "description": "...",
      "sourceUrl": "https://..."
    }
  ],
  "faqs": [
    { "question": "Combien d'actions LVMH faut-il pour accéder au club ?", "answer": "..." }
  ]
}
```

Une fois ce dossier produit par les researchers, le copywriter peut écrire les `description` Benefit définitives en respectant le ton Nothing (sec, factuel, capitales pour les data points).
