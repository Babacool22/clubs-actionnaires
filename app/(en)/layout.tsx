import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Doto, Space_Grotesk, Space_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterCta from "@/components/NewsletterCta";
import {
  BASE_URL,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
  serializeJsonLd,
} from "@/lib/seo";

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

const TITLE = "Shareholder Clubs - Benefits and eligibility";
const DESCRIPTION =
  "Compare shareholder clubs, eligibility thresholds, benefits, enrolment conditions and official sources for 65 major global companies.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: SITE_NAME,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "shareholder clubs",
    "shareholder benefits",
    "shareholder perks",
    "individual shareholders",
    "registered shares",
    "shareholder eligibility",
  ],
  authors: [{ name: SITE_NAME, url: BASE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/en`,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Shareholder Clubs catalogue",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SOCIAL_IMAGE_PATH],
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
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
  other: {
    "apple-mobile-web-app-title": SITE_NAME,
    "apple-mobile-web-app-capable": "yes",
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
  colorScheme: "dark light",
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
      inLanguage: ["fr-FR", "en-US"],
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: SITE_NAME,
      url: BASE_URL,
      description: DESCRIPTION,
      logo: `${BASE_URL}/icon.png`,
      founder: {
        "@type": "Person",
        name: "Bastien Coulonnier",
        url: `${BASE_URL}/a-propos`,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "editorial",
        email: "contact@clubsactionnaires.fr",
        availableLanguage: ["French", "English"],
      },
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
      lang="en"
      className={`${doto.variable} ${spaceGrotesk.variable} ${spaceMono.variable} h-full`}
    >
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-text-primary">
        <Header />
        <main className="flex-1">{children}</main>
        <NewsletterCta placement="global_before_footer" locale="en" />
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
