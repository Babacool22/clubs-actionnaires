import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Doto, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterCta from "@/components/NewsletterCta";
import { BASE_URL, SITE_NAME } from "@/lib/seo";

const doto = Doto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-doto",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const TITLE = "Clubs Actionnaires – Avantages et clubs d'actionnaires";
const DESCRIPTION =
  "Comparez les clubs actionnaires, avantages, seuils d'actions, conditions d'inscription et sources officielles de 58 grandes entreprises mondiales.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: SITE_NAME,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "club actionnaire",
    "clubs actionnaires",
    "avantages actionnaires",
    "combien d'actions pour avantages",
    "actionnaire individuel",
    "nominatif pur",
    "nominatif administré",
  ],
  authors: [{ name: SITE_NAME, url: BASE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: BASE_URL,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Clubs Actionnaires",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "3E63PHi85cqg7s4xw_uTjdoWQTHFJ4cfkpeyE70Gjl4",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      name: "Clubs Actionnaires",
      url: BASE_URL,
      description: DESCRIPTION,
      inLanguage: "fr-FR",
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: SITE_NAME,
      url: BASE_URL,
      description: DESCRIPTION,
      logo: `${BASE_URL}/icon.png`,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${doto.variable} ${spaceGrotesk.variable} ${spaceMono.variable} h-full`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-text-primary">
        <Header />
        <main className="flex-1">{children}</main>
        <NewsletterCta placement="global_before_footer" />
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
