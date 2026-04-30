import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter } as any);

const companies = [
  {
    slug: "air-france-klm",
    name: "Air France-KLM",
    description:
      "Groupe aérien franco-néerlandais, l'un des leaders mondiaux du transport aérien de passagers et de fret.",
    sector: "Transport aérien",
    stockIndex: "CAC40",
    ticker: "AF",
    website: "https://www.airfranceklm.com",
    clubUrl: "https://www.airfranceklm.com/en/finance",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Newsletter actionnaires",
        description:
          "Réception de newsletters régulières avec les indicateurs clés, actualités et calendrier financier du groupe.",
        value: null,
      },
      {
        type: "evenement",
        title: "Événements exclusifs",
        description:
          "Invitations à des événements privilégiés : rencontres avec les dirigeants, visites de sites aéronautiques et découvertes des coulisses du groupe.",
        value: null,
      },
      {
        type: "evenement",
        title: "Jeux-concours réservés",
        description:
          "Participation à des jeux-concours exclusifs permettant de remporter des invitations à des événements du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "lvmh",
    name: "LVMH",
    description:
      "Conglomérat mondial du luxe regroupant plus de 75 maisons de prestige (Louis Vuitton, Dior, Moët Hennessy...).",
    sector: "Luxe",
    stockIndex: "CAC40",
    ticker: "MC",
    website: "https://www.lvmh.fr",
    clubUrl: "https://www.clublvmh-actionnaires.fr/en",
    minShares: 1,
    benefits: [
      {
        type: "reduction",
        title: "Tarifs réduits champagnes et vins",
        description:
          "Tarifs préférentiels sur une sélection de champagnes, vins et spiritueux des Maisons du groupe LVMH.",
        value: null,
      },
      {
        type: "reduction",
        title: "Fondation Louis Vuitton et presse",
        description:
          "Billets prioritaires pour la Fondation Louis Vuitton et abonnements à tarif réduit aux publications du groupe (Les Échos, Investir, Le Parisien, Connaissance des Arts).",
        value: null,
      },
      {
        type: "evenement",
        title: "Événements des Maisons",
        description:
          "Invitations à des événements exclusifs organisés par les Maisons du groupe : défilés, expositions, inaugurations de boutiques.",
        value: null,
      },
    ],
  },
  {
    slug: "loreal",
    name: "L'Oréal",
    description:
      "Leader mondial de la beauté, présent dans plus de 150 pays avec des marques iconiques (Lancôme, Maybelline, Garnier...).",
    sector: "Cosmétiques & Beauté",
    stockIndex: "CAC40",
    ticker: "OR",
    website: "https://www.loreal.com",
    clubUrl: "https://www.loreal-finance.com/fr/devenir-actionnaire",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Dividende majoré de fidélité",
        description:
          "Prime de fidélité de 10% sur le dividende pour les actionnaires détenant leurs actions au nominatif depuis au moins 2 années civiles pleines.",
        value: "+10% sur le dividende",
      },
      {
        type: "evenement",
        title: "Conférences et webinaires",
        description:
          "Invitations à des conférences et webinaires animés par des membres de la direction, avec présentation des innovations beauté.",
        value: null,
      },
      {
        type: "evenement",
        title: "Visites de sites",
        description:
          "Visites de sites de production et de laboratoires de recherche du groupe L'Oréal.",
        value: null,
      },
    ],
  },
  {
    slug: "totalenergies",
    name: "TotalEnergies",
    description:
      "Groupe énergétique mondial intégré produisant et commercialisant de l'énergie : pétrole, gaz naturel et électricité bas carbone.",
    sector: "Énergie",
    stockIndex: "CAC40",
    ticker: "TTE",
    website: "https://www.totalenergies.com",
    clubUrl: "https://totalenergies.com/investors/individual-shareholders/shareholders-club",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Webzine des actionnaires",
        description:
          "Accès au webzine trimestriel exclusif avec les perspectives énergétiques, actualités et résultats du groupe.",
        value: null,
      },
      {
        type: "evenement",
        title: "Visites de sites industriels",
        description:
          "Visites organisées de raffineries, parcs éoliens et autres sites industriels du groupe.",
        value: null,
      },
      {
        type: "evenement",
        title: "Jeux-concours et événements",
        description:
          "Participation à des jeux-concours pour remporter des cadeaux et invitations à des événements culturels du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "renault",
    name: "Renault",
    description:
      "Constructeur automobile français, pionnier de l'électromobilité avec des véhicules présents dans 130 pays.",
    sector: "Automobile",
    stockIndex: "CAC40",
    ticker: "RNO",
    website: "https://www.renaultgroup.com",
    clubUrl:
      "https://www.renaultgroup.com/en/finance/shareholders/shareholders-club/",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Journée des Actionnaires",
        description:
          "Invitation à la Journée des Actionnaires avec échanges avec les dirigeants et découverte des sites de production.",
        value: null,
      },
      {
        type: "service",
        title: "Magazine Renault Actu",
        description:
          "Réception du magazine biannuel des actionnaires avec actualités du groupe et perspectives stratégiques.",
        value: null,
      },
      {
        type: "evenement",
        title: "Visites de sites et réunions",
        description:
          "Visites des sites de production et d'économie circulaire, et réunions d'actionnaires en région.",
        value: null,
      },
    ],
  },
  {
    slug: "orange",
    name: "Orange",
    description:
      "Opérateur télécom français de référence, présent en Europe et en Afrique avec des services mobile, internet et TV.",
    sector: "Télécommunications",
    stockIndex: "CAC40",
    ticker: "ORA",
    website: "https://www.orange.com",
    clubUrl: "https://investisseurs-individuels.orange.com/fr/",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Événements sportifs et culturels",
        description:
          "Invitations à des événements exclusifs : cocktails dans la loge Orange à Roland-Garros, soirées privées au Château de Chantilly, concerts.",
        value: null,
      },
      {
        type: "service",
        title: "Information privilégiée",
        description:
          "Publications dédiées et rencontres régulières avec les dirigeants sur la stratégie et les activités du groupe.",
        value: null,
      },
      {
        type: "evenement",
        title: "Rencontres actionnaires",
        description:
          "Réunions régionales dans toute la France pour rencontrer les dirigeants et équipes d'Orange.",
        value: null,
      },
    ],
  },
  {
    slug: "hermes",
    name: "Hermès",
    description:
      "Maison de luxe française fondée en 1837, connue pour ses sacs, soieries, parfums et accessoires de prestige.",
    sector: "Luxe",
    stockIndex: "CAC40",
    ticker: "RMS",
    website: "https://www.hermes.com",
    clubUrl: "https://finance.hermes.com/fr/investisseurs/",
    minShares: 1,
    benefits: [
      {
        type: "cadeau",
        title: "Cadeau à l'Assemblée Générale",
        description:
          "Cadeau de prestige offert aux actionnaires présents à l'AG. Le cadeau varie chaque année (pochette en soie en 2024 d'une valeur de ~180€, livre en 2025). La présence physique est requise.",
        value: "Variable selon les années",
      },
      {
        type: "evenement",
        title: "Assemblée Générale",
        description:
          "Participation à l'Assemblée Générale annuelle avec présentation des résultats et échanges avec les dirigeants de la Maison.",
        value: null,
      },
      {
        type: "service",
        title: "Guide de l'actionnaire",
        description:
          "Accès au guide de l'actionnaire et aux informations financières détaillées de la Maison Hermès.",
        value: null,
      },
    ],
  },
  {
    slug: "bnp-paribas",
    name: "BNP Paribas",
    description:
      "Premier groupe bancaire de la zone euro, présent dans 65 pays avec une offre complète de services financiers.",
    sector: "Banque & Finance",
    stockIndex: "CAC40",
    ticker: "BNP",
    website: "https://www.bnpparibas.com",
    clubUrl:
      "https://invest.bnpparibas/actionnaires-individuels",
    minShares: 200,
    benefits: [
      {
        type: "evenement",
        title: "Événements culturels et sportifs",
        description:
          "Invitations à plus de 300 événements par an : concerts, matchs de tennis et de rugby, soirées exclusives dans les lieux partenaires BNP Paribas.",
        value: "~300 événements/an",
      },
      {
        type: "evenement",
        title: "Cinéma Pathé BNP Paribas",
        description:
          "Places de cinéma offertes dans les cinémas Pathé BNP Paribas et invitations aux festivals cinématographiques.",
        value: null,
      },
      {
        type: "service",
        title: "Publications financières",
        description:
          "Accès aux analyses financières, perspectives économiques et publications exclusives de BNP Paribas.",
        value: null,
      },
    ],
  },
  {
    slug: "michelin",
    name: "Michelin",
    description:
      "Leader mondial du pneumatique, présent dans 177 pays et éditeur du célèbre Guide Michelin.",
    sector: "Industrie & Équipements",
    stockIndex: "CAC40",
    ticker: "ML",
    website: "https://www.michelin.com",
    clubUrl: "https://www.michelin.com/en/investors/shareholder",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Assemblée Générale",
        description:
          "Participation à l'Assemblée Générale annuelle à Clermont-Ferrand avec présentation de la stratégie et des résultats du groupe.",
        value: null,
      },
      {
        type: "evenement",
        title: "Visites du musée Aventure Michelin",
        description:
          "Invitation à visiter le musée l'Aventure Michelin à Clermont-Ferrand lors d'événements dédiés aux actionnaires.",
        value: null,
      },
      {
        type: "service",
        title: "Information actionnaires",
        description:
          "Accès aux publications dédiées et au guide de l'actionnaire Michelin avec analyses et perspectives du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "accor",
    name: "Accor",
    description:
      "Groupe hôtelier mondial avec plus de 5 700 établissements sous 40 marques (Ibis, Novotel, Sofitel, Raffles...).",
    sector: "Hôtellerie & Tourisme",
    stockIndex: "CAC40",
    ticker: "AC",
    website: "https://www.group.accor.com",
    clubUrl: "https://group.accor.com/fr/finance/individual-shareholders",
    minShares: 50,
    benefits: [
      {
        type: "service",
        title: "Statut ALL Gold",
        description:
          "Carte de fidélité ALL (Accor Live Limitless) avec statut Gold offrant la garantie de chambre disponible jusqu'à 3 jours avant l'arrivée et le surclassement dans la catégorie supérieure.",
        value: "Statut Gold offert",
      },
      {
        type: "evenement",
        title: "Événements exclusifs",
        description:
          "Invitations à des événements privilégiés organisés dans les établissements premium du groupe Accor.",
        value: null,
      },
      {
        type: "service",
        title: "Information privilégiée",
        description:
          "Accès aux publications et informations exclusives sur la stratégie et les résultats du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "vinci",
    name: "Vinci",
    description:
      "Leader mondial des concessions et de la construction, opérateur d'aéroports, d'autoroutes et d'infrastructures.",
    sector: "Construction & Concessions",
    stockIndex: "CAC40",
    ticker: "DG",
    website: "https://www.vinci.com",
    clubUrl: "https://www.vinci.com/en/finance/shareholders/club",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Événements culturels et sportifs",
        description:
          "Invitations à des concerts, expositions et événements sportifs dans les stades et salles gérés par Vinci.",
        value: null,
      },
      {
        type: "cadeau",
        title: "Cadeau à l'Assemblée Générale",
        description:
          "Cadeau solidaire offert lors de l'AG, en partenariat avec les associations soutenues par la Fondation Vinci.",
        value: null,
      },
      {
        type: "evenement",
        title: "Visites de grands chantiers",
        description:
          "Visites exclusives des grands projets de construction et d'infrastructure en cours.",
        value: null,
      },
    ],
  },
  {
    slug: "sanofi",
    name: "Sanofi",
    description:
      "Groupe pharmaceutique mondial spécialisé dans les vaccins, les maladies rares et l'immunologie.",
    sector: "Santé & Pharmacie",
    stockIndex: "CAC40",
    ticker: "SAN",
    website: "https://www.sanofi.com",
    clubUrl:
      "https://www.sanofi.com/fr/investisseurs/actionnaires-individuels",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Rencontres actionnaires",
        description:
          "Réunions d'information en région avec présentation des résultats et de la stratégie par les dirigeants du groupe.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires avec les actualités, résultats et perspectives du groupe Sanofi.",
        value: null,
      },
      {
        type: "evenement",
        title: "Assemblée Générale",
        description:
          "Invitation à l'Assemblée Générale annuelle avec présentation des avancées médicales et scientifiques.",
        value: null,
      },
    ],
  },
  {
    slug: "engie",
    name: "Engie",
    description:
      "Groupe énergétique mondial spécialisé dans la transition énergétique, le gaz naturel et l'électricité verte.",
    sector: "Énergie",
    stockIndex: "CAC40",
    ticker: "ENGI",
    website: "https://www.engie.com",
    clubUrl: "https://clubactionnaires.engie.com/fr/",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Dividende majoré de fidélité",
        description:
          "Prime de fidélité de 10% sur le dividende pour les actionnaires détenant leurs actions au nominatif depuis au moins 2 années civiles.",
        value: "+10% sur le dividende",
      },
      {
        type: "evenement",
        title: "Journées portes ouvertes",
        description:
          "Invitations aux journées portes ouvertes des centrales, parcs éoliens et photovoltaïques Engie.",
        value: null,
      },
      {
        type: "service",
        title: "Publications actionnaires",
        description:
          "Accès aux publications dédiées sur la stratégie de transition énergétique et les résultats du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "dassault-systemes",
    name: "Dassault Systèmes",
    description:
      "Leader mondial des logiciels de conception 3D et de simulation (CATIA, SolidWorks, 3DEXPERIENCE).",
    sector: "Technologie & Logiciels",
    stockIndex: "CAC40",
    ticker: "DSY",
    website: "https://www.3ds.com",
    clubUrl: "https://investor.3ds.com/",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Assemblée Générale",
        description:
          "Participation à l'Assemblée Générale annuelle avec présentation des innovations technologiques et résultats du groupe.",
        value: null,
      },
      {
        type: "service",
        title: "Information actionnaires",
        description:
          "Accès aux publications dédiées, rapports annuels et informations sur la stratégie du groupe.",
        value: null,
      },
      {
        type: "evenement",
        title: "Rencontres actionnaires",
        description:
          "Réunions d'information avec présentation des perspectives et innovations de Dassault Systèmes.",
        value: null,
      },
    ],
  },
  {
    slug: "societe-generale",
    name: "Société Générale",
    description:
      "Groupe bancaire international français, l'un des leaders européens de la banque de détail et des services financiers.",
    sector: "Banque & Finance",
    stockIndex: "CAC40",
    ticker: "GLE",
    website: "https://www.societegenerale.com",
    clubUrl: "https://monespaceactionnaire.societegenerale.com/",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Rencontres actionnaires",
        description:
          "Réunions d'information en région avec les dirigeants du groupe pour présenter les résultats et la stratégie.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires et accès aux analyses de marché de Société Générale.",
        value: null,
      },
      {
        type: "evenement",
        title: "Assemblée Générale",
        description:
          "Participation à l'Assemblée Générale annuelle avec échanges avec les dirigeants du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "axa",
    name: "AXA",
    description:
      "Leader mondial de l'assurance et de la gestion d'actifs, présent dans 51 pays avec 93 millions de clients.",
    sector: "Assurance & Finance",
    stockIndex: "CAC40",
    ticker: "CS",
    website: "https://www.axa.com",
    clubUrl: "https://www.axa.com/fr/investisseurs/cercle-des-actionnaires",
    minShares: 1,
    benefits: [
      {
        type: "reduction",
        title: "Grands crus AXA Millésimes",
        description:
          "Tarifs préférentiels sur les grands crus AXA Millésimes, issus des domaines viticoles du groupe.",
        value: null,
      },
      {
        type: "evenement",
        title: "Visites culturelles et conférences",
        description:
          "Invitations à des visites privées de musées, e-conférences culturelles et réunions d'information en région.",
        value: null,
      },
      {
        type: "service",
        title: "Magazine et newsletters",
        description:
          "Réception du magazine des actionnaires, newsletters régulières et alertes sur les grandes annonces du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "pernod-ricard",
    name: "Pernod Ricard",
    description:
      "Co-leader mondial des vins et spiritueux, propriétaire de marques iconiques (Absolut, Chivas Regal, Jameson, Martell, Ricard, Mumm, Perrier-Jouët, Havana Club).",
    sector: "Vins & Spiritueux",
    stockIndex: "CAC40",
    ticker: "RI",
    website: "https://www.pernod-ricard.com",
    clubUrl: "https://club-premium.pernod-ricard.com/",
    minShares: 24,
    benefits: [
      {
        type: "reduction",
        title: "Tarifs préférentiels Club Premium",
        description:
          "Tarifs réduits sur une sélection de spiritueux et champagnes du groupe (Martell, Mumm, Perrier-Jouët, Chivas, Absolut, Havana Club...) réservés aux membres du Club Premium (≥ 24 actions, au porteur ou au nominatif).",
        value: "≥ 24 actions",
      },
      {
        type: "evenement",
        title: "Visites de sites prestigieux",
        description:
          "Visites exclusives des sites emblématiques du groupe : maisons de Cognac Martell, caves de Champagne Mumm et Perrier-Jouët à Reims/Épernay, distilleries Chivas et Jameson.",
        value: null,
      },
      {
        type: "evenement",
        title: "Rencontres et Assemblée Générale",
        description:
          "Invitations à l'Assemblée Générale annuelle, aux réunions d'information en région et à des rencontres avec les dirigeants du groupe.",
        value: null,
      },
      {
        type: "service",
        title: "Magazine Premium et Espace Actionnaires",
        description:
          "Réception du magazine Premium dédié aux actionnaires, accès à l'Espace Actionnaires en ligne, lettre d'information et alertes sur les annonces clés du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "air-liquide",
    name: "Air Liquide",
    description:
      "Leader mondial des gaz industriels et médicaux, présent dans 60 pays au service de l'industrie, la santé et la transition énergétique.",
    sector: "Industrie & Équipements",
    stockIndex: "CAC40",
    ticker: "AI",
    website: "https://www.airliquide.com",
    clubUrl: "https://www.airliquide.com/fr/groupe/actionnaires-individuels",
    minShares: 1,
    benefits: [
      {
        type: "cadeau",
        title: "Attribution gratuite d'actions",
        description:
          "Programme historique d'attribution d'actions gratuites : 1 action gratuite pour 10 détenues, sous réserve d'une décision de l'AG (dernières attributions en 2019 et 2024).",
        value: "+1 pour 10 actions",
      },
      {
        type: "service",
        title: "Dividende majoré de fidélité",
        description:
          "Prime de fidélité de 10% sur le dividende et sur les attributions gratuites pour les actionnaires détenant leurs actions au nominatif depuis au moins 2 années civiles pleines (plafonné à 0,5% du capital par actionnaire).",
        value: "+10% sur le dividende",
      },
      {
        type: "evenement",
        title: "Rencontres et conférences",
        description:
          "Réunions d'actionnaires en région avec présentation de la stratégie, conférences thématiques (hydrogène, transition énergétique) et visites de sites industriels.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires et e-mémo",
        description:
          "Réception de la lettre aux actionnaires, du e-mémo trimestriel et accès à l'application Actionnaires Air Liquide pour suivre l'actualité du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "airbus",
    name: "Airbus",
    description:
      "Leader mondial de l'aéronautique, de l'espace et de la défense, constructeur d'avions commerciaux, hélicoptères, satellites et systèmes de défense.",
    sector: "Aéronautique & Défense",
    stockIndex: "CAC40",
    ticker: "AIR",
    website: "https://www.airbus.com",
    clubUrl: "https://www.airbus.com/en/investors/individual-shareholders",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Visites de sites Airbus",
        description:
          "Visites exclusives des sites industriels Airbus (Toulouse, Hambourg, Saint-Nazaire) avec découverte des chaînes d'assemblage A320, A350 et des installations spatiales.",
        value: null,
      },
      {
        type: "evenement",
        title: "Rencontres et webinaires",
        description:
          "Webinaires thématiques avec les dirigeants, réunions d'information en région et échanges sur la stratégie aéronautique, spatiale et défense du groupe.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires individuels",
        description:
          "Réception de la lettre dédiée aux actionnaires individuels avec actualités industrielles, perspectives et résultats financiers du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "alstom",
    name: "Alstom",
    description:
      "Leader mondial de la mobilité ferroviaire, concepteur de trains à grande vitesse, métros, tramways et systèmes de signalisation.",
    sector: "Industrie & Équipements",
    stockIndex: "CAC40",
    ticker: "ALO",
    website: "https://www.alstom.com",
    clubUrl: "https://www.alstom.com/investors/individual-shareholders",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Visites de sites ferroviaires",
        description:
          "Visites des sites industriels Alstom (La Rochelle, Belfort, Reichshoffen, Petite-Forêt) avec découverte des chaînes de production de trains et tramways.",
        value: null,
      },
      {
        type: "evenement",
        title: "Réunions d'actionnaires en région",
        description:
          "Rencontres régulières avec les dirigeants en région, présentation de la stratégie de mobilité durable et échanges avec les équipes Alstom.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires avec actualités du groupe, contrats remportés et perspectives du marché ferroviaire mondial.",
        value: null,
      },
    ],
  },
  {
    slug: "arcelormittal",
    name: "ArcelorMittal",
    description:
      "Premier sidérurgiste mondial, présent dans 60 pays avec une production d'acier pour l'automobile, la construction, l'emballage et les énergies renouvelables.",
    sector: "Industrie & Équipements",
    stockIndex: "CAC40",
    ticker: "MT",
    website: "https://corporate.arcelormittal.com",
    clubUrl:
      "https://corporate.arcelormittal.com/investors/individual-shareholders",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Assemblée Générale annuelle",
        description:
          "Participation à l'AG annuelle au Luxembourg avec présentation des résultats, stratégie de décarbonation et échanges avec le management du groupe.",
        value: null,
      },
      {
        type: "service",
        title: "Communications financières",
        description:
          "Accès aux publications dédiées : rapport annuel, factbook, communications trimestrielles et webcasts résultats.",
        value: null,
      },
      {
        type: "evenement",
        title: "Visites de sites industriels",
        description:
          "Visites possibles de sites européens (Dunkerque, Fos-sur-Mer, Gand) avec découverte des hauts-fourneaux et des projets de transition vers l'acier vert.",
        value: null,
      },
    ],
  },
  {
    slug: "bouygues",
    name: "Bouygues",
    description:
      "Conglomérat français présent dans la construction (Bouygues Construction, Colas), les télécoms (Bouygues Telecom), les médias (TF1) et l'immobilier.",
    sector: "Construction & Concessions",
    stockIndex: "CAC40",
    ticker: "EN",
    website: "https://www.bouygues.com",
    clubUrl: "https://www.bouygues.com/finance/lactionnaire-individuel/",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Dividende majoré de fidélité",
        description:
          "Prime de fidélité de 10% sur le dividende pour les actionnaires détenant leurs actions au nominatif depuis au moins 2 années civiles pleines.",
        value: "+10% sur le dividende",
      },
      {
        type: "evenement",
        title: "Rencontres et visites de sites",
        description:
          "Réunions d'actionnaires en région, visites de chantiers Bouygues Construction et Colas, et découverte des sites du groupe (TF1, Bouygues Telecom).",
        value: null,
      },
      {
        type: "service",
        title: "Magazine Bouygues Mag",
        description:
          "Réception du magazine semestriel Bouygues Mag dédié aux actionnaires avec actualités des cinq métiers du groupe et perspectives stratégiques.",
        value: null,
      },
    ],
  },
  {
    slug: "capgemini",
    name: "Capgemini",
    description:
      "Leader mondial du conseil et des services numériques, partenaire de la transformation digitale des entreprises dans plus de 50 pays.",
    sector: "Technologie & Logiciels",
    stockIndex: "CAC40",
    ticker: "CAP",
    website: "https://www.capgemini.com",
    clubUrl: "https://investors.capgemini.com/fr/actionnaires-individuels",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Webinaires et conférences tech",
        description:
          "Webinaires exclusifs sur les grandes tendances technologiques (IA générative, cloud, cybersécurité) animés par les experts et dirigeants du groupe.",
        value: null,
      },
      {
        type: "evenement",
        title: "Rencontres actionnaires",
        description:
          "Réunions d'information en région avec présentation de la stratégie, des résultats et des innovations Capgemini.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires et de l'avis de convocation à l'AG avec analyses et perspectives du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "carrefour",
    name: "Carrefour",
    description:
      "Leader européen de la distribution avec plus de 14 000 magasins dans 30 pays sous les enseignes Carrefour, Carrefour Market, Carrefour City et Carrefour Express.",
    sector: "Distribution & Retail",
    stockIndex: "CAC40",
    ticker: "CA",
    website: "https://www.carrefour.com",
    clubUrl: "https://www.carrefour.com/fr/finance/actionnaires-individuels",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Rencontres actionnaires",
        description:
          "Réunions d'information en région avec présentation des résultats, de la stratégie omnicanale et des engagements RSE du groupe Carrefour.",
        value: null,
      },
      {
        type: "evenement",
        title: "Visites de sites",
        description:
          "Visites possibles d'hypermarchés, entrepôts logistiques et sièges sociaux Carrefour, avec découverte des innovations distribution et e-commerce.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires Carrefour, du calendrier financier et accès à l'espace actionnaires en ligne.",
        value: null,
      },
    ],
  },
  {
    slug: "credit-agricole",
    name: "Crédit Agricole SA",
    description:
      "Premier financeur de l'économie française et l'une des plus grandes banques européennes, leader de la banque de détail en France et en Italie.",
    sector: "Banque & Finance",
    stockIndex: "CAC40",
    ticker: "ACA",
    website: "https://www.credit-agricole.com",
    clubUrl:
      "https://www.credit-agricole.com/finance/finance/l-action-credit-agricole-s-a/cercle-des-actionnaires",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Cercle des actionnaires",
        description:
          "Adhésion au Cercle des Actionnaires : invitations à des conférences économiques, rencontres avec les dirigeants et événements thématiques sur la finance et l'économie.",
        value: null,
      },
      {
        type: "evenement",
        title: "Réunions en région",
        description:
          "Réunions d'information dans les principales villes de France avec les dirigeants du groupe, présentations de la stratégie et des résultats.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires et alertes",
        description:
          "Réception de la lettre aux actionnaires, alertes mail sur les annonces clés et accès à l'espace actionnaires individuels en ligne.",
        value: null,
      },
    ],
  },
  {
    slug: "danone",
    name: "Danone",
    description:
      "Leader mondial des produits laitiers frais (Danone, Activia, Actimel), de l'eau en bouteille (Evian, Volvic) et de la nutrition spécialisée.",
    sector: "Boissons & Agroalimentaire",
    stockIndex: "CAC40",
    ticker: "BN",
    website: "https://www.danone.com",
    clubUrl: "https://www.danone.com/fr/investor-relations/individual-shareholders.html",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Dividende majoré de fidélité",
        description:
          "Prime de fidélité de 10% sur le dividende pour les actionnaires détenant leurs actions au nominatif depuis au moins 2 années civiles pleines.",
        value: "+10% sur le dividende",
      },
      {
        type: "evenement",
        title: "Rencontres et visites de sites",
        description:
          "Réunions d'information en région, visites de sites de production (Évian, Volvic, usines laitières) et présentation de la stratégie One Planet One Health.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre semestrielle aux actionnaires, alertes mail et accès à l'espace actionnaires individuels en ligne.",
        value: null,
      },
    ],
  },
  {
    slug: "edenred",
    name: "Edenred",
    description:
      "Leader mondial des solutions de paiements spécialisés, émetteur des titres-restaurant Ticket Restaurant et de solutions de mobilité, motivation et bien-être au travail.",
    sector: "Services aux entreprises",
    stockIndex: "CAC40",
    ticker: "EDEN",
    website: "https://www.edenred.com",
    clubUrl: "https://www.edenred.com/fr/investisseurs/actionnaires-individuels",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Webinaires actionnaires",
        description:
          "Webinaires trimestriels avec présentation des résultats, perspectives stratégiques et sessions de questions/réponses avec les dirigeants.",
        value: null,
      },
      {
        type: "evenement",
        title: "Assemblée Générale annuelle",
        description:
          "Participation à l'Assemblée Générale annuelle avec présentation de la feuille de route Beyond22-25 et échanges avec le management.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires individuels et accès aux publications financières détaillées du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "essilorluxottica",
    name: "EssilorLuxottica",
    description:
      "Leader mondial de la conception, fabrication et distribution de verres ophtalmiques, montures et lunettes (Ray-Ban, Oakley, Persol, Varilux, Crizal).",
    sector: "Santé & Pharmacie",
    stockIndex: "CAC40",
    ticker: "EL",
    website: "https://www.essilorluxottica.com",
    clubUrl:
      "https://www.essilorluxottica.com/en/investors/individual-shareholders/",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Visites de sites innovation",
        description:
          "Visites possibles des centres d'innovation et de R&D EssilorLuxottica avec découverte des dernières technologies optiques (Stellest, verres connectés).",
        value: null,
      },
      {
        type: "evenement",
        title: "Assemblée Générale annuelle",
        description:
          "Participation à l'AG annuelle avec présentation des résultats, stratégie de croissance et innovations produits du groupe (Ray-Ban Meta, etc.).",
        value: null,
      },
      {
        type: "service",
        title: "Communications dédiées actionnaires",
        description:
          "Accès aux publications financières, lettres aux actionnaires et webcasts des résultats trimestriels.",
        value: null,
      },
    ],
  },
  {
    slug: "eurofins-scientific",
    name: "Eurofins Scientific",
    description:
      "Leader mondial des analyses bio-analytiques pour les industries pharmaceutique, agroalimentaire, environnementale et cosmétique, présent dans 62 pays.",
    sector: "Santé & Pharmacie",
    stockIndex: "CAC40",
    ticker: "ERF",
    website: "https://www.eurofins.com",
    clubUrl: "https://www.eurofins.com/investor-relations/",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Assemblée Générale annuelle",
        description:
          "Participation à l'AG annuelle au Luxembourg avec présentation des résultats, stratégie d'acquisitions et perspectives du marché des bio-analyses.",
        value: null,
      },
      {
        type: "service",
        title: "Communications financières détaillées",
        description:
          "Accès aux publications trimestrielles, rapport annuel et présentations CMD (Capital Markets Day) avec analyses sectorielles approfondies.",
        value: null,
      },
      {
        type: "service",
        title: "Newsletter actionnaires",
        description:
          "Réception de communications régulières sur les acquisitions, lancements de tests et innovations du groupe Eurofins.",
        value: null,
      },
    ],
  },
  {
    slug: "kering",
    name: "Kering",
    description:
      "Groupe mondial de luxe propriétaire de marques iconiques : Gucci, Saint Laurent, Bottega Veneta, Balenciaga, Alexander McQueen, Brioni, Boucheron, Pomellato.",
    sector: "Luxe",
    stockIndex: "CAC40",
    ticker: "KER",
    website: "https://www.kering.com",
    clubUrl: "https://www.kering.com/fr/finance/actionnaires-individuels/",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Événements des Maisons",
        description:
          "Invitations à des événements exclusifs liés aux Maisons du groupe : expositions, défilés, vernissages et présentations de collections (Gucci, Saint Laurent, Bottega Veneta).",
        value: null,
      },
      {
        type: "evenement",
        title: "Rencontres actionnaires",
        description:
          "Réunions d'information en région avec présentation de la stratégie luxe, des résultats des Maisons et de la feuille de route durabilité.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires avec actualités des Maisons, communications financières et calendrier financier du groupe.",
        value: null,
      },
    ],
  },
  {
    slug: "legrand",
    name: "Legrand",
    description:
      "Spécialiste mondial des infrastructures électriques et numériques du bâtiment, présent dans 90 pays (prises, interrupteurs, datacenters, bornes de recharge).",
    sector: "Industrie & Équipements",
    stockIndex: "CAC40",
    ticker: "LR",
    website: "https://www.legrand.com",
    clubUrl: "https://www.legrand.com/fr/finance/actionnaires-individuels",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Visites de sites Legrand",
        description:
          "Visites du site historique de Limoges et des centres d'innovation avec découverte des solutions connectées Eliot et des produits emblématiques (Céliane, Mosaic).",
        value: null,
      },
      {
        type: "evenement",
        title: "Conférences innovations",
        description:
          "Conférences thématiques sur les usages numériques du bâtiment, datacenters, infrastructure de recharge VE et solutions d'efficacité énergétique.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires Legrand avec actualités stratégiques, résultats et perspectives du marché du bâtiment intelligent.",
        value: null,
      },
    ],
  },
  {
    slug: "publicis",
    name: "Publicis Groupe",
    description:
      "Troisième groupe mondial de communication et de marketing digital, propriétaire des agences Publicis, Saatchi & Saatchi, Leo Burnett, Sapient et Epsilon.",
    sector: "Médias & Communication",
    stockIndex: "CAC40",
    ticker: "PUB",
    website: "https://www.publicisgroupe.com",
    clubUrl: "https://www.publicisgroupe.com/fr/investisseurs/actionnaires-individuels",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Assemblée Générale annuelle",
        description:
          "Participation à l'AG annuelle au Drugstore Publicis (Champs-Élysées) avec présentation de la stratégie data/IA, des résultats et de la plateforme Marcel.",
        value: null,
      },
      {
        type: "service",
        title: "Communications financières",
        description:
          "Accès aux publications trimestrielles, lettres aux actionnaires, webcasts résultats et présentations du Capital Markets Day.",
        value: null,
      },
      {
        type: "evenement",
        title: "Webinaires et rencontres",
        description:
          "Webinaires thématiques sur le marketing digital, la data et l'intelligence artificielle, ainsi que des rencontres en région avec les dirigeants.",
        value: null,
      },
    ],
  },
  {
    slug: "safran",
    name: "Safran",
    description:
      "Leader mondial de l'aéronautique, de l'espace et de la défense — motoriste (LEAP, M88), équipementier (trains d'atterrissage, sièges) et acteur majeur du spatial.",
    sector: "Aéronautique & Défense",
    stockIndex: "CAC40",
    ticker: "SAF",
    website: "https://www.safran-group.com",
    clubUrl: "https://www.safran-group.com/finance/individual-shareholders",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Dividende majoré de fidélité",
        description:
          "Prime de fidélité de 10% sur le dividende pour les actionnaires détenant leurs actions au nominatif depuis au moins 2 années civiles pleines.",
        value: "+10% sur le dividende",
      },
      {
        type: "evenement",
        title: "Visites de sites aéronautiques",
        description:
          "Visites des sites Safran (Villaroche, Gennevilliers, Bordes) avec découverte des moteurs LEAP, des trains d'atterrissage et des équipements de défense.",
        value: null,
      },
      {
        type: "evenement",
        title: "Conférences thématiques",
        description:
          "Conférences sur l'aéronautique civile, la propulsion durable, l'espace et la défense, animées par les experts et dirigeants du groupe.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires Safran avec actualités du groupe, calendrier financier et présentations stratégiques.",
        value: null,
      },
    ],
  },
  {
    slug: "saint-gobain",
    name: "Saint-Gobain",
    description:
      "Leader mondial de la construction durable, fabricant de matériaux innovants : isolation, vitrage, plâtre, mortiers et solutions pour le bâtiment et l'industrie.",
    sector: "Industrie & Équipements",
    stockIndex: "CAC40",
    ticker: "SGO",
    website: "https://www.saint-gobain.com",
    clubUrl:
      "https://www.saint-gobain.com/fr/finance/lactionnaire-individuel",
    minShares: 100,
    benefits: [
      {
        type: "service",
        title: "Dividende majoré de fidélité",
        description:
          "Prime de fidélité de 10% sur le dividende pour les actionnaires détenant leurs actions au nominatif depuis au moins 2 années civiles pleines (plafonnée à 0,5% du capital).",
        value: "+10% sur le dividende",
      },
      {
        type: "evenement",
        title: "Cercle des actionnaires (≥ 100 actions)",
        description:
          "Adhésion au Cercle des Actionnaires Saint-Gobain (à partir de 100 actions) : invitations privilégiées à des événements culturels, expositions et visites de sites.",
        value: "≥ 100 actions",
      },
      {
        type: "evenement",
        title: "Visites de sites industriels",
        description:
          "Visites des sites historiques (Pont-à-Mousson, Saint-Gobain Glass) et centres de recherche avec découverte des innovations matériaux et construction durable.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires Saint-Gobain et accès au guide de l'actionnaire détaillant l'ensemble des avantages et services.",
        value: null,
      },
    ],
  },
  {
    slug: "schneider-electric",
    name: "Schneider Electric",
    description:
      "Leader mondial de la transformation numérique de la gestion de l'énergie et de l'automatisation, présent dans plus de 100 pays (EcoStruxure, APC, Square D).",
    sector: "Industrie & Équipements",
    stockIndex: "CAC40",
    ticker: "SU",
    website: "https://www.se.com",
    clubUrl: "https://www.se.com/ww/en/about-us/investor-relations/individual-shareholders/",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Webinaires Innovation Talks",
        description:
          "Webinaires exclusifs sur les transitions énergétique et numérique, les datacenters durables, l'électrification et l'automatisation industrielle.",
        value: null,
      },
      {
        type: "evenement",
        title: "Visites de sites Schneider",
        description:
          "Visites possibles des sites de Rueil-Malmaison (siège), Grenoble et Le Vaudreuil avec découverte des solutions EcoStruxure et de l'usine du futur.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires Schneider Electric et accès aux publications stratégiques (Capital Markets Day, sustainability report).",
        value: null,
      },
    ],
  },
  {
    slug: "stellantis",
    name: "Stellantis",
    description:
      "Quatrième constructeur automobile mondial, propriétaire de 14 marques iconiques : Peugeot, Citroën, DS, Fiat, Jeep, Alfa Romeo, Maserati, Opel, Chrysler, Dodge, Ram.",
    sector: "Automobile",
    stockIndex: "CAC40",
    ticker: "STLA",
    website: "https://www.stellantis.com",
    clubUrl: "https://www.stellantis.com/en/investors/individual-shareholders",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Assemblée Générale annuelle",
        description:
          "Participation à l'AG annuelle aux Pays-Bas avec présentation de la stratégie Dare Forward 2030, du plan d'électrification et des résultats des 14 marques.",
        value: null,
      },
      {
        type: "evenement",
        title: "Visites de sites et événements marques",
        description:
          "Visites possibles des sites historiques (Mulhouse, Sochaux, Mirafiori) et invitations à des événements liés aux 14 marques du groupe (salons, lancements).",
        value: null,
      },
      {
        type: "service",
        title: "Communications dédiées actionnaires",
        description:
          "Accès aux publications financières, webcasts résultats et lettre aux actionnaires individuels avec actualités produits et perspectives stratégiques.",
        value: null,
      },
    ],
  },
  {
    slug: "stmicroelectronics",
    name: "STMicroelectronics",
    description:
      "Premier fabricant européen de semi-conducteurs, fournisseur de puces pour l'automobile, l'industrie, les smartphones et l'IoT (Apple, Tesla, Bosch).",
    sector: "Technologie & Logiciels",
    stockIndex: "CAC40",
    ticker: "STMPA",
    website: "https://www.st.com",
    clubUrl: "https://investors.st.com/individual-shareholders",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Assemblée Générale annuelle",
        description:
          "Participation à l'AG annuelle aux Pays-Bas avec présentation des résultats, de la roadmap technologique (SiC, GaN) et de la stratégie semi-conducteurs.",
        value: null,
      },
      {
        type: "service",
        title: "Communications investisseurs détaillées",
        description:
          "Accès aux publications trimestrielles, présentations des Capital Markets Days, webcasts résultats et roadshows dédiés aux actionnaires individuels.",
        value: null,
      },
      {
        type: "evenement",
        title: "Visites de sites possibles",
        description:
          "Visites des sites de Crolles (France) et Catane (Italie) lors d'événements dédiés, avec découverte des fabs et des technologies de pointe.",
        value: null,
      },
    ],
  },
  {
    slug: "teleperformance",
    name: "Teleperformance",
    description:
      "Leader mondial des services de relation client externalisée et de transformation numérique, présent dans 100 pays avec plus de 500 000 collaborateurs.",
    sector: "Services aux entreprises",
    stockIndex: "CAC40",
    ticker: "TEP",
    website: "https://www.teleperformance.com",
    clubUrl: "https://www.teleperformance.com/en-us/investors/individual-shareholders/",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Assemblée Générale annuelle",
        description:
          "Participation à l'AG annuelle avec présentation des résultats, de la stratégie d'intégration de l'IA générative et des perspectives sectorielles.",
        value: null,
      },
      {
        type: "service",
        title: "Communications dédiées actionnaires",
        description:
          "Accès aux publications trimestrielles, communiqués stratégiques, présentations Capital Markets Day et webcasts résultats du groupe.",
        value: null,
      },
      {
        type: "service",
        title: "Newsletter actionnaires",
        description:
          "Réception d'une newsletter régulière avec actualités du groupe, acquisitions stratégiques (Majorel) et déploiement des solutions IA dans la relation client.",
        value: null,
      },
    ],
  },
  {
    slug: "thales",
    name: "Thales",
    description:
      "Leader mondial des hautes technologies pour l'aéronautique, l'espace, la défense, la sécurité et les transports terrestres, présent dans 68 pays.",
    sector: "Aéronautique & Défense",
    stockIndex: "CAC40",
    ticker: "HO",
    website: "https://www.thalesgroup.com",
    clubUrl: "https://www.thalesgroup.com/fr/investisseurs/actionnaires-individuels",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Visites de sites Thales",
        description:
          "Visites des sites Thales (Toulouse, Cannes, Vélizy) avec découverte des activités spatiales (Thales Alenia Space), défense, transport ferroviaire et cybersécurité.",
        value: null,
      },
      {
        type: "evenement",
        title: "Conférences thématiques",
        description:
          "Conférences sur les enjeux de souveraineté numérique, défense, espace et cybersécurité animées par les experts et dirigeants du groupe.",
        value: null,
      },
      {
        type: "evenement",
        title: "Réunions actionnaires en région",
        description:
          "Rencontres régulières en région avec présentation de la stratégie, des grands contrats et des résultats financiers du groupe.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires Thales avec actualités du groupe, perspectives sectorielles et calendrier financier.",
        value: null,
      },
    ],
  },
  {
    slug: "veolia",
    name: "Veolia",
    description:
      "Leader mondial de la transformation écologique : gestion de l'eau, des déchets et de l'énergie. Présent dans plus de 50 pays au service des collectivités et industries.",
    sector: "Services aux collectivités",
    stockIndex: "CAC40",
    ticker: "VIE",
    website: "https://www.veolia.com",
    clubUrl: "https://www.veolia.com/fr/finance/actionnaires-individuels",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Dividende majoré de fidélité",
        description:
          "Prime de fidélité de 10% sur le dividende pour les actionnaires détenant leurs actions au nominatif administré ou pur depuis au moins 2 années civiles pleines.",
        value: "+10% sur le dividende",
      },
      {
        type: "evenement",
        title: "Visites de sites Veolia",
        description:
          "Visites des sites emblématiques : usines de traitement de l'eau (Méry-sur-Oise), centres de tri et valorisation des déchets, et installations de production d'énergie.",
        value: null,
      },
      {
        type: "evenement",
        title: "Conférences transition écologique",
        description:
          "Conférences thématiques sur la transformation écologique, l'économie circulaire, la dépollution et la décarbonation animées par les experts Veolia.",
        value: null,
      },
      {
        type: "service",
        title: "Lettre aux actionnaires",
        description:
          "Réception de la lettre aux actionnaires Veolia, du calendrier financier et accès à l'espace actionnaires individuels en ligne.",
        value: null,
      },
    ],
  },
  {
    slug: "iberdrola",
    name: "Iberdrola",
    description:
      "Multinationale espagnole de l'énergie électrique, leader mondial de l'éolien et acteur majeur des renouvelables.",
    sector: "Énergie",
    stockIndex: "IBEX 35",
    ticker: "IBE",
    website: "https://www.iberdrola.com",
    clubUrl:
      "https://www.iberdrola.com/shareholders-investors/shareholders/shareholders-club",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Club OLA — News & contenus exclusifs",
        description:
          "Accès au Accionistas NEWS Iberdrola, contenus audiovisuels exclusifs sur les activités financières, industrielles, sociales et environnementales du groupe.",
        value: null,
      },
      {
        type: "service",
        title: "Support dédié 24/7",
        description:
          "Ligne téléphonique exclusive et boîte mail réservée aux actionnaires. Réponse aux questions sous 2 jours ouvrés, 365 jours par an.",
        value: "Réponse < 2 jours ouvrés",
      },
      {
        type: "evenement",
        title: "Tirages et événements",
        description:
          "Participation à des tirages au sort, activités de loisirs et événements organisés exclusivement pour les membres du club OLA.",
        value: null,
      },
    ],
  },
  {
    slug: "repsol",
    name: "Repsol",
    description:
      "Compagnie énergétique espagnole intégrée, exploitante de stations-service Campsa et acteur de la transition énergétique.",
    sector: "Énergie",
    stockIndex: "IBEX 35",
    ticker: "REP",
    website: "https://www.repsol.com",
    clubUrl:
      "https://www.repsol.com/en/shareholders-and-investors/shareholders-club/index.cshtml",
    minShares: 50,
    benefits: [
      {
        type: "reduction",
        title: "Remise carburant via Waylet",
        description:
          "Jusqu'à 4 centimes par litre supplémentaires de remise sur le carburant en stations Repsol via l'app Waylet (cumulables avec les remises clients pouvant aller jusqu'à 40 centimes/L).",
        value: "Jusqu'à 4 cts/L (actionnaire)",
      },
      {
        type: "evenement",
        title: "Tirages concerts et sport",
        description:
          "Tirages au sort réguliers pour gagner des places de concerts, festivals et événements sportifs exclusifs aux membres du club En acción.",
        value: null,
      },
      {
        type: "reduction",
        title: "Statuts One / Plus / Premium / Platinum",
        description:
          "4 paliers selon le nombre d'actions (One : 50-849, Plus : 850-2 499, Premium : 2 500-12 499, Platinum : 12 500+) avec avantages croissants : accès exclusifs, expériences dédiées et solde Waylet majoré.",
        value: "4 paliers selon détention",
      },
    ],
  },
  {
    slug: "banco-santander",
    name: "Banco Santander",
    description:
      "Premier groupe bancaire d'Espagne et leader de la zone euro par capitalisation, présent dans plus de 10 marchés clés.",
    sector: "Banque & Finance",
    stockIndex: "IBEX 35",
    ticker: "SAN",
    website: "https://www.santander.com",
    clubUrl: "https://yosoyaccionista.santander.com/",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Assurance accident gratuite",
        description:
          "Assurance accident offerte à tous les actionnaires, avec une couverture qui augmente selon le nombre d'actions détenues.",
        value: "Gratuite",
      },
      {
        type: "reduction",
        title: "Exonération de commissions (à partir de 1 000 actions)",
        description:
          "Pas de frais de tenue de compte sur le Compte Santander pour les actionnaires détenant plus de 1 000 actions Santander déposées chez Banco Santander.",
        value: "≥ 1 000 actions",
      },
      {
        type: "reduction",
        title: "Promotions et carburant",
        description:
          "Tirages, promotions et réductions chez les partenaires (technologie, culture, voyages, restauration, santé). Économie jusqu'à 4 centimes par litre sur le carburant.",
        value: "Jusqu'à 4 cts/L carburant",
      },
    ],
  },
  {
    slug: "mapfre",
    name: "Mapfre",
    description:
      "Premier assureur espagnol et l'un des plus grands groupes d'assurance d'Amérique latine, présent dans plus de 40 pays.",
    sector: "Assurance & Finance",
    stockIndex: "IBEX 35",
    ticker: "MAP",
    website: "https://www.mapfre.com",
    clubUrl: "https://www.mapfre.com/en/shareholders-loyalty-plan/",
    minShares: 1000,
    benefits: [
      {
        type: "service",
        title: "Orientation médicale 24h/24",
        description:
          "Service d'orientation médicale 24/7, orientation pédiatrique, tests d'habitudes saines et assistant nutritionnel inclus dans le programme MAPFRE teCuidamos Accionista.",
        value: "24h/24, 7j/7",
      },
      {
        type: "reduction",
        title: "Carburant et achats",
        description:
          "Jusqu'à 5% d'économies sur le carburant dans plus de 1 600 stations-service partenaires, ainsi que des réductions sur Amazon et autres plateformes.",
        value: "−5% carburant",
      },
      {
        type: "service",
        title: "Services maison et expositions",
        description:
          "Conseiller fiscal, assistance juridico-administrative auto, dépannage urgent maison. Pass privés et entrées gratuites pour les expositions de la Fundación MAPFRE.",
        value: null,
      },
    ],
  },
  {
    slug: "telefonica",
    name: "Telefónica",
    description:
      "Opérateur télécom espagnol présent en Europe et en Amérique latine, propriétaire des marques Movistar, O2 et Vivo.",
    sector: "Télécommunications",
    stockIndex: "IBEX 35",
    ticker: "TEF",
    website: "https://www.telefonica.com",
    clubUrl: "https://www.telefonica.com/en/shareholders-area/offers/",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Tirages technologiques (AG)",
        description:
          "Participation à des tirages au sort réservés aux actionnaires votant à l'AG : iPhone et autres produits de l'écosystème digital Telefónica.",
        value: null,
      },
      {
        type: "reduction",
        title: "Offres et promotions exclusives",
        description:
          "Offres et promotions dédiées publiées dans le magazine Acción Telefónica et la newsletter actionnaires, accessibles depuis le mobile.",
        value: null,
      },
      {
        type: "service",
        title: "Magazine Acción Telefónica",
        description:
          "Réception du magazine Acción Telefónica avec actualités du groupe, perspectives stratégiques et informations financières.",
        value: null,
      },
    ],
  },
  {
    slug: "intesa-sanpaolo",
    name: "Intesa Sanpaolo",
    description:
      "Premier groupe bancaire italien, l'un des plus solides d'Europe avec une présence forte dans la banque de détail et la gestion de fortune.",
    sector: "Banque & Finance",
    stockIndex: "FTSE MIB",
    ticker: "ISP",
    website: "https://www.intesasanpaolo.com",
    clubUrl:
      "https://www.intesasanpaolo.com/it/common/landing/club-azionisti.html",
    minShares: 1000,
    benefits: [
      {
        type: "reduction",
        title: "Compte courant à frais zéro",
        description:
          "Frais de tenue de compte courant offerts (y compris les comptes joints) sur les produits Intesa Sanpaolo, Intesa Sanpaolo Private Banking et Fideuram pour les membres du Club Azionisti.",
        value: "0 € de frais",
      },
      {
        type: "reduction",
        title: "Taux préférentiel sur les crédits",
        description:
          "Conditions privilégiées sur les financements : par exemple, taux fixe à 7,70% au lieu de 10,90% sur les crédits XME pour les membres du club.",
        value: "−3,2 points sur XME",
      },
      {
        type: "service",
        title: "Adhésion réservée (≥ 1 000 actions, 12 mois)",
        description:
          "Adhésion conditionnée à la détention continue d'au moins 1 000 actions Intesa Sanpaolo depuis 12 mois, conservées sur un compte titres d'une banque du groupe.",
        value: "≥ 1 000 actions, 12 mois",
      },
    ],
  },
  {
    slug: "generali",
    name: "Assicurazioni Generali",
    description:
      "Premier groupe d'assurance italien et l'un des leaders mondiaux, présent dans 50 pays avec une expertise en assurance et gestion d'actifs.",
    sector: "Assurance & Finance",
    stockIndex: "FTSE MIB",
    ticker: "G",
    website: "https://www.generali.com",
    clubUrl: "https://www.generali.com/investors/shareholders-club",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Plateforme digitale interactive",
        description:
          "Accès à une plateforme dédiée explorant les univers du groupe : assurance, finance, culture, art et excellences italiennes (vins, gastronomie).",
        value: null,
      },
      {
        type: "evenement",
        title: "Événements exclusifs",
        description:
          "Invitations à des événements privés : Barcolana (régate de Trieste), expériences dans les domaines Leone Alato (ex-Genagricola), visites de bâtiments historiques du groupe.",
        value: null,
      },
      {
        type: "reduction",
        title: "Conditions privilégiées sur les services du groupe",
        description:
          "Produits et services à conditions de faveur via les filiales Generali Arte, Europ Assistance, Banca Generali, Jeniot et Leone Alato.",
        value: null,
      },
    ],
  },
  {
    slug: "whitbread",
    name: "Whitbread",
    description:
      "Premier groupe hôtelier britannique, propriétaire de Premier Inn (plus de 800 hôtels) et de chaînes de restaurants au Royaume-Uni.",
    sector: "Hôtellerie & Tourisme",
    stockIndex: "FTSE 100",
    ticker: "WTB",
    website: "https://www.whitbread.co.uk",
    clubUrl: "https://www.whitbread.co.uk/investors/shareholder-centre/benefits/",
    minShares: 64,
    benefits: [
      {
        type: "cadeau",
        title: "Petit-déjeuner gratuit Premier Inn",
        description:
          "Petit-déjeuner Premier Inn offert chaque matin du séjour pour l'actionnaire et ses invités (Premier Inn UK, hub by Premier Inn, ZIP by Premier Inn). Limité à 2 chambres par actionnaire, l'actionnaire devant occuper l'une d'elles.",
        value: "Petit-déj inclus",
      },
      {
        type: "reduction",
        title: "−10% restaurants Whitbread",
        description:
          "10% de réduction sur l'addition dans les restaurants des autres marques du groupe Whitbread (Beefeater, Brewers Fayre, Bar + Block, etc.).",
        value: "−10%",
      },
      {
        type: "service",
        title: "Carte actionnaire physique (≥ 64 actions)",
        description:
          "Carte d'actionnaire à présenter au check-in Premier Inn ou en restaurant, accompagnée de la confirmation de réservation. Délivrée à partir de 64 actions détenues.",
        value: "≥ 64 actions",
      },
    ],
  },
  {
    slug: "berkshire-hathaway",
    name: "Berkshire Hathaway",
    description:
      "Holding américain de Warren Buffett, propriétaire de GEICO, See's Candies, Dairy Queen, BNSF Railway, Borsheims et plus de 60 filiales (assurance, énergie, manufacturing, retail).",
    sector: "Holding & Conglomérat",
    stockIndex: "S&P 500",
    ticker: "BRK.B",
    website: "https://www.berkshirehathaway.com",
    clubUrl: "https://www.berkshirehathaway.com/sharehold.html",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Berkshire Hathaway Annual Meeting (Omaha)",
        description:
          "Week-end annuel à Omaha, Nebraska — surnommé le 'Woodstock du Capitalisme' — avec sessions de questions à Warren Buffett, expositions des filiales, shopping shareholder-only et événements exclusifs au CHI Health Center.",
        value: null,
      },
      {
        type: "reduction",
        title: "Tarifs préférentiels Borsheims, NFM, See's Candies",
        description:
          "Tarifs actionnaires sur les bijoux Borsheims (code promo « BERKSHIRE »), Berkshire Picnic au Nebraska Furniture Mart durant la semaine de l'AG (BBQ Meal Deal $6), et offres spéciales chez See's Candies.",
        value: "Code BERKSHIRE",
      },
      {
        type: "reduction",
        title: "−7 % sur GEICO Auto",
        description:
          "Remise de 7 % sur les contrats d'assurance auto GEICO réservée aux actionnaires détenant des actions Berkshire Hathaway B (non applicable aux assurances umbrella ou autres lignes).",
        value: "−7 % GEICO",
      },
    ],
  },
  {
    slug: "walmart",
    name: "Walmart",
    description:
      "Premier distributeur mondial avec plus de 10 500 magasins dans 19 pays sous les enseignes Walmart, Sam's Club et Walmart International (Asda, Flipkart historiquement).",
    sector: "Distribution & Retail",
    stockIndex: "S&P 500",
    ticker: "WMT",
    website: "https://corporate.walmart.com",
    clubUrl:
      "https://stock.walmart.com/financials/annual-reports/default.aspx",
    minShares: 1,
    benefits: [
      {
        type: "evenement",
        title: "Associates Celebration — Bud Walton Arena",
        description:
          "Accès au célèbre Associates Celebration au Bud Walton Arena (Fayetteville, Arkansas) — réservé aux actionnaires inscrits à la record date et aux associés Walmart, avec performances de stars internationales et présentations des dirigeants.",
        value: "Sur preuve d'actionnariat",
      },
      {
        type: "evenement",
        title: "Annual Shareholders' Meeting (live webcast)",
        description:
          "Participation à l'Assemblée Générale annuelle (format virtuel) avec présentation de la stratégie, vote en ligne et Q&A avec le CEO et le board de Walmart.",
        value: null,
      },
      {
        type: "service",
        title: "Walmart Stock Purchase Plan via Computershare",
        description:
          "Plan de réinvestissement des dividendes (DRIP) et de souscription directe d'actions Walmart via Computershare, avec frais réduits par rapport à un courtier traditionnel.",
        value: null,
      },
    ],
  },
  {
    slug: "procter-gamble",
    name: "Procter & Gamble",
    description:
      "Géant mondial des biens de consommation courante (Pampers, Tide, Gillette, Pantene, Oral-B, Ariel), présent dans plus de 180 pays.",
    sector: "Biens de consommation",
    stockIndex: "S&P 500",
    ticker: "PG",
    website: "https://www.pg.com",
    clubUrl:
      "https://www.pginvestor.com/resources/Stock-Plan-Administration/default.aspx",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Shareholder Investment Program (DSPP)",
        description:
          "Plan de souscription directe et de réinvestissement des dividendes (DSPP/DRIP) géré par Computershare. Investissement initial à partir de 250 $, achats automatiques sans courtier et frais réduits.",
        value: "À partir de 250 $",
      },
      {
        type: "evenement",
        title: "Assemblée Générale annuelle",
        description:
          "Participation à l'Assemblée Générale annuelle de Cincinnati avec présentation de la stratégie multi-marques, démonstrations de produits et échanges avec les dirigeants du groupe.",
        value: null,
      },
      {
        type: "service",
        title: "Direct Registration & dividendes trimestriels",
        description:
          "Détention directe au registre via Computershare (DRS), distribution de dividendes trimestriels — P&G fait partie des Dividend Kings (60+ années consécutives de hausse du dividende).",
        value: "Dividend King",
      },
    ],
  },
  {
    slug: "coca-cola",
    name: "The Coca-Cola Company",
    description:
      "Leader mondial des boissons non alcoolisées avec plus de 200 marques (Coca-Cola, Sprite, Fanta, Minute Maid, Powerade, Costa Coffee), présent dans plus de 200 pays.",
    sector: "Boissons & Agroalimentaire",
    stockIndex: "S&P 500",
    ticker: "KO",
    website: "https://www.coca-colacompany.com",
    clubUrl: "https://investors.coca-colacompany.com/shareowners",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "Coca-Cola Direct Stock Purchase Plan",
        description:
          "Plan de souscription directe d'actions Coca-Cola et réinvestissement automatique des dividendes via Computershare. Achats récurrents sans courtier, frais préférentiels.",
        value: null,
      },
      {
        type: "evenement",
        title: "Annual Meeting of Shareowners",
        description:
          "Assemblée Générale annuelle (format virtuel le 29 avril 2026) avec présentation des résultats, stratégie et innovations produits, et session de questions/réponses avec le CEO James Quincey.",
        value: null,
      },
      {
        type: "service",
        title: "Dividendes trimestriels — Dividend King",
        description:
          "Dividendes trimestriels distribués depuis 1920 et augmentés chaque année depuis plus de 60 ans (Dividend King). Paiement au porteur ou réinvestissement automatique via DRIP.",
        value: "Dividend King",
      },
    ],
  },
  {
    slug: "mcdonalds",
    name: "McDonald's",
    description:
      "Premier réseau mondial de restauration rapide avec plus de 40 000 restaurants dans plus de 100 pays, dont 95 % sont franchisés.",
    sector: "Restauration",
    stockIndex: "S&P 500",
    ticker: "MCD",
    website: "https://corporate.mcdonalds.com",
    clubUrl:
      "https://corporate.mcdonalds.com/corpmcd/investors/shareholder-resources.html",
    minShares: 1,
    benefits: [
      {
        type: "service",
        title: "MCDirect Shares — DSPP",
        description:
          "Plan de souscription directe d'actions McDonald's et de réinvestissement automatique des dividendes via Computershare. Frais d'inscription 5 $, investissements récurrents sans courtier.",
        value: "Frais 5 $",
      },
      {
        type: "evenement",
        title: "Annual Shareholders' Meeting",
        description:
          "Participation à l'Assemblée Générale annuelle à Chicago avec présentation des résultats, plan stratégique 'Accelerating the Arches' et innovations menus & digital.",
        value: null,
      },
      {
        type: "service",
        title: "Dividendes trimestriels — Dividend Aristocrat",
        description:
          "Dividendes trimestriels augmentés chaque année depuis 1976 (Dividend Aristocrat). Versement au porteur ou réinvestissement automatique via le plan MCDirect Shares.",
        value: "Dividend Aristocrat",
      },
    ],
  },
  {
    slug: "3m",
    name: "3M",
    description:
      "Conglomérat industriel américain à l'origine de plus de 60 000 produits — Post-it, Scotch, Scotchgard, Command, Filtrete, équipements médicaux et de sécurité.",
    sector: "Industrie & Équipements",
    stockIndex: "S&P 500",
    ticker: "MMM",
    website: "https://www.3m.com",
    clubUrl: "https://investors.3m.com/financials/shareholder-services/default.aspx",
    minShares: 1,
    benefits: [
      {
        type: "cadeau",
        title: "3M Holiday Gift Box",
        description:
          "Boîte cadeau annuelle réservée aux actionnaires : ~53 $ de produits 3M (Post-it, Scotch, Command, Scotch-Brite, Filtrete) achetable pour 27 $. Brochure et code promo envoyés au Q4, commande en ligne.",
        value: "$27 → $53 de produits",
      },
      {
        type: "service",
        title: "Direct Stock Purchase Plan via EQ Shareowner",
        description:
          "Souscription directe d'actions 3M et réinvestissement automatique des dividendes via Equiniti Shareowner Services. Idéal pour des achats récurrents long-terme.",
        value: null,
      },
      {
        type: "service",
        title: "Dividendes trimestriels — Dividend King",
        description:
          "Dividendes trimestriels distribués depuis plus de 100 ans et augmentés chaque année depuis plus de 60 ans (Dividend King). Réinvestissement automatique disponible.",
        value: "Dividend King",
      },
    ],
  },
  {
    slug: "hershey",
    name: "The Hershey Company",
    description:
      "Premier confiseur des États-Unis (Hershey's, Reese's, Kit Kat, Twizzlers, Jolly Rancher) et propriétaire de Hersheypark à Hershey, Pennsylvanie.",
    sector: "Boissons & Agroalimentaire",
    stockIndex: "S&P 500",
    ticker: "HSY",
    website: "https://www.thehersheycompany.com",
    clubUrl:
      "https://investors.thehersheycompany.com/en_us/home/investor-resources.html",
    minShares: 1,
    benefits: [
      {
        type: "cadeau",
        title: "Catalogue cadeaux actionnaires (Holiday Gift)",
        description:
          "Programme historique de catalogue cadeau réservé aux actionnaires : commande de paniers Hershey/Reese's/Kit Kat envoyés directement au destinataire. Activé au Q4 sur invitation aux actionnaires inscrits.",
        value: null,
      },
      {
        type: "evenement",
        title: "Assemblée Générale à Hershey, Pennsylvanie",
        description:
          "AG annuelle au siège de Hershey, PA — terre natale du chocolat américain et de Hersheypark. Présentation des résultats, dégustations et accès au campus historique.",
        value: null,
      },
      {
        type: "service",
        title: "Hershey Direct Stock Purchase Plan",
        description:
          "Plan de souscription directe et de réinvestissement des dividendes via Computershare. Achats récurrents et accumulation long-terme sans courtier.",
        value: null,
      },
    ],
  },
  {
    slug: "carnival-corporation",
    name: "Carnival Corporation",
    description:
      "Premier groupe mondial de croisières — propriétaire de Carnival Cruise Line, Princess, Holland America, Cunard, Costa, AIDA, P&O et Seabourn (~90 navires, plus de 13 millions de passagers/an).",
    sector: "Hôtellerie & Tourisme",
    stockIndex: "S&P 500",
    ticker: "CCL",
    website: "https://www.carnivalcorp.com",
    clubUrl:
      "https://www.carnivalcorp.com/investors/shareholder-information/shareholder-benefit/",
    minShares: 100,
    benefits: [
      {
        type: "reduction",
        title: "Onboard Credit jusqu'à 250 $",
        description:
          "Crédit à bord par cabine pour les actionnaires détenant ≥ 100 actions Carnival Corp/plc : 50 $ pour les croisières ≤ 6 nuits, 100 $ pour 7-13 nuits, 250 $ pour ≥ 14 nuits (et croisières mondiales).",
        value: "50 $ / 100 $ / 250 $",
      },
      {
        type: "service",
        title: "Toutes les marques du groupe couvertes",
        description:
          "Avantage applicable sur Carnival Cruise Line, Princess Cruises, Holland America, Cunard, Costa Croisières, AIDA, P&O et Seabourn — à demander au moins 3 semaines avant le départ.",
        value: null,
      },
      {
        type: "service",
        title: "Vérification automatique via Stockperks",
        description:
          "Application Stockperks pour lier son compte de courtage et faire vérifier automatiquement la détention de 100 actions, sans envoi manuel de relevé.",
        value: "≥ 100 actions",
      },
    ],
  },
  {
    slug: "royal-caribbean",
    name: "Royal Caribbean Group",
    description:
      "Groupe mondial de croisières premium — Royal Caribbean International, Celebrity Cruises et Silversea — opérant les plus grands navires de croisière au monde (Icon of the Seas).",
    sector: "Hôtellerie & Tourisme",
    stockIndex: "S&P 500",
    ticker: "RCL",
    website: "https://www.royalcaribbeangroup.com",
    clubUrl: "https://www.rclinvestor.com/contact-us/faqs/shareholder-benefit/",
    minShares: 100,
    benefits: [
      {
        type: "reduction",
        title: "Onboard Credit jusqu'à 250 $",
        description:
          "Crédit à bord par cabine pour les actionnaires détenant ≥ 100 actions RCL : 50 $ pour les croisières ≤ 5 nuits, 100 $ pour 6-13 nuits, 250 $ pour ≥ 14 nuits (incluant les croisières mondiales).",
        value: "50 $ / 100 $ / 250 $",
      },
      {
        type: "service",
        title: "Royal Caribbean International & Celebrity Cruises",
        description:
          "Avantage applicable sur toutes les croisières Royal Caribbean International et Celebrity Cruises. Preuve de détention à fournir 2-3 semaines avant le départ via le formulaire IR.",
        value: null,
      },
      {
        type: "service",
        title: "Cumulable avec promotions standards",
        description:
          "Le crédit actionnaire est combinable avec les promotions et offres marketing en cours, sauf restrictions explicites des sailings exclus.",
        value: null,
      },
    ],
  },
  {
    slug: "norwegian-cruise-line",
    name: "Norwegian Cruise Line Holdings",
    description:
      "Groupe mondial de croisières — Norwegian Cruise Line, Oceania Cruises et Regent Seven Seas Cruises — connu pour son concept Freestyle Cruising et ses navires premium.",
    sector: "Hôtellerie & Tourisme",
    stockIndex: "S&P 500",
    ticker: "NCLH",
    website: "https://www.nclhltd.com",
    clubUrl: "https://www.nclhltd.com/investors/shareholder-benefits",
    minShares: 100,
    benefits: [
      {
        type: "reduction",
        title: "Onboard Credit jusqu'à 250 $",
        description:
          "Crédit à bord par cabine pour les actionnaires détenant ≥ 100 actions NCLH : 50 $ pour les croisières ≤ 6 nuits, 100 $ pour 7-14 nuits, 250 $ pour ≥ 15 nuits.",
        value: "50 $ / 100 $ / 250 $",
      },
      {
        type: "service",
        title: "NCL, Oceania & Regent Seven Seas",
        description:
          "Avantage applicable sur Norwegian Cruise Line, Oceania Cruises et Regent Seven Seas Cruises — hors charters. Demande à envoyer au moins 15 jours avant la date de départ.",
        value: null,
      },
      {
        type: "service",
        title: "Formulaire de demande dédié",
        description:
          "Formulaire 'Shareholder Benefit Request' à envoyer par email ou fax avec preuve de détention de 100 actions au moment de la demande.",
        value: "≥ 100 actions",
      },
    ],
  },
];

async function main() {
  console.log("🌱 Démarrage du seed...");

  for (const company of companies) {
    const { benefits, ...companyData } = company;

    await prisma.company.upsert({
      where: { slug: companyData.slug },
      update: { clubUrl: companyData.clubUrl },
      create: {
        ...companyData,
        benefits: {
          create: benefits,
        },
      },
    });

    console.log(`✅ ${companyData.name} ajouté`);
  }

  console.log(`\n🎉 Seed terminé ! ${companies.length} entreprises ajoutées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
