import type { Metadata } from "next";
import Link from "next/link";
import {
  BASE_URL,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
  serializeJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: `FAQ des clubs actionnaires | ${SITE_NAME}`,
  description:
    "Réponses aux questions fréquentes sur les clubs actionnaires, les seuils d'actions, l'inscription et les justificatifs.",
  alternates: { canonical: `${BASE_URL}/faq` },
  openGraph: {
    title: `FAQ des clubs actionnaires | ${SITE_NAME}`,
    description:
      "Comprendre les clubs actionnaires, leurs conditions et leur fonctionnement.",
    url: `${BASE_URL}/faq`,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Clubs Actionnaires",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `FAQ des clubs actionnaires | ${SITE_NAME}`,
    description:
      "Comprendre les clubs actionnaires, leurs conditions et leur fonctionnement.",
    images: [SOCIAL_IMAGE_PATH],
  },
};

const faqs = [
  {
    question: "Qu'est-ce qu'un club actionnaire ?",
    answer:
      "Un club actionnaire est un programme proposé par une entreprise à ses actionnaires individuels. Selon l'entreprise, il peut donner accès à de l'information dédiée, des visites, des événements, des services ou des tarifs préférentiels.",
  },
  {
    question: "Combien d'actions faut-il détenir ?",
    answer:
      "Le seuil dépend de chaque entreprise. Une seule action suffit parfois, tandis que certains programmes exigent plusieurs dizaines ou centaines de titres. La fiche de chaque entreprise indique le seuil publié et sa source.",
  },
  {
    question: "Comment rejoindre un club actionnaire ?",
    answer:
      "L'inscription se fait généralement sur le site officiel de l'entreprise ou auprès de son service actionnaires. Un formulaire, une preuve de détention récente et parfois une pièce d'identité peuvent être demandés.",
  },
  {
    question: "Faut-il détenir les actions au nominatif ?",
    answer:
      "Pas toujours. Certains clubs acceptent les titres au porteur, d'autres réservent tout ou partie de leurs services aux actionnaires au nominatif pur ou administré. Il faut vérifier la règle propre à chaque entreprise.",
  },
  {
    question: "L'adhésion est-elle gratuite ?",
    answer:
      "De nombreux clubs ne facturent pas de cotisation, mais l'achat des actions, leur conservation, leur transfert au nominatif ou certaines activités peuvent entraîner des frais. La gratuité ne doit donc pas être présumée au-delà de ce qui est publié.",
  },
  {
    question: "À quelle fréquence les informations sont-elles vérifiées ?",
    answer:
      "Chaque dossier affiche une date de dernière vérification issue de ses sources. Les conditions pouvant changer sans préavis, le site officiel de l'entreprise doit toujours être consulté avant une inscription ou une réservation.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/faq#webpage`,
    url: `${BASE_URL}/faq`,
    inLanguage: "fr-FR",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-2xl)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <p className="label text-text-disabled mb-[var(--space-md)]">
        <Link href="/" className="hover:text-text-display transition-colors">
          Accueil
        </Link>
        <span className="mx-2">/</span>FAQ
      </p>

      <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,7vw,5rem)] font-bold leading-none text-text-display mb-[var(--space-xl)]">
        QUESTIONS FRÉQUENTES
      </h1>

      <div className="border-t border-border">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group border-b border-border px-[var(--space-md)] py-[var(--space-lg)]"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-[var(--space-lg)]">
              <h2 className="text-[18px] font-medium leading-snug text-text-display">
                {faq.question}
              </h2>
              <span className="shrink-0 font-[family-name:var(--font-data)] text-[16px] text-text-disabled group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-[var(--space-md)] max-w-2xl text-[15px] leading-relaxed text-text-secondary">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
