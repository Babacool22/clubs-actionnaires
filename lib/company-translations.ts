export type LocalizedBenefit = {
  title: string;
  description: string;
  value?: string;
};

export type LocalizedFaq = {
  question: string;
  answer: string;
};

export type CompanyEnglishTranslation = {
  slug: string;
  name: string;
  description: string;
  sector: string;
  clubName?: string;
  seoTitle: string;
  seoDescription: string;
  benefits: LocalizedBenefit[];
  faqs: LocalizedFaq[];
  registrationProcedure: string;
  proofRequirement: string;
  holdingMode: string;
  membershipCost: string;
};

export const companyEnglishTranslations: Record<
  string,
  CompanyEnglishTranslation
> = {
  lvmh: {
    slug: "lvmh",
    name: "LVMH",
    sector: "Luxury",
    clubName: "LVMH Shareholders' Club",
    description:
      "The global leader in luxury goods, with houses including Louis Vuitton, Dior, Moet & Chandon, Hennessy, Tiffany, Tag Heuer and Sephora. LVMH runs a shareholders' club open from 1 share, with preferential rates on wines, spirits and media subscriptions, fast-track Fondation Louis Vuitton tickets and selected house visits.",
    seoTitle: "LVMH shareholder benefits and club",
    seoDescription:
      "Explore LVMH shareholder benefits from 1 share: eligibility, estimated cost, LVMH Shareholders' Club perks, FAQs and official sources.",
    registrationProcedure:
      "Apply through the official LVMH Shareholders' Club website with a recent shareholding certificate, issued by your broker within the last 3 months, and proof of identity. Membership is free and the card is generally valid for 2 years.",
    proofRequirement:
      "Prepare a recent shareholding certificate from your broker, plus proof of identity.",
    holdingMode: "Bearer or registered shares",
    membershipCost: "Free",
    benefits: [
      {
        title: "Preferential rates on wines, champagnes and spirits",
        description:
          "From 1 share, members can access the Moet Hennessy members' store, with selected wines, champagnes and spirits offered at club rates. Prices are reviewed regularly, so always check the current catalogue in the official members' area before ordering.",
        value: "Member rates, reviewed periodically",
      },
      {
        title: "Les Echos Digital Premium subscription -50%",
        description:
          "From 1 share, club members may access a discounted annual Les Echos Digital Premium subscription through the members' area.",
        value: "Around -50%",
      },
      {
        title: "Investir Privilege subscription -50%",
        description:
          "From 1 share, members may subscribe to Investir Privilege at a reduced annual rate through the club.",
        value: "Around -50%",
      },
      {
        title: "Connaissance des Arts subscription -40%",
        description:
          "From 1 share, LVMH shareholders' club members may access a preferential annual subscription to Connaissance des Arts.",
        value: "Around -40%",
      },
      {
        title: "Le Parisien paper and digital subscription -60%",
        description:
          "From 1 share, the club has historically offered a discounted Le Parisien paper and digital subscription.",
        value: "Around -60%",
      },
      {
        title: "Fondation Louis Vuitton tickets",
        description:
          "From 1 share, members may access preferential fast-track tickets for Fondation Louis Vuitton, with annual limits per member.",
        value: "Preferential member ticketing",
      },
      {
        title: "Visits to selected champagne houses and maisons",
        description:
          "From 1 share, the club can provide access to free or discounted visits at selected group houses, subject to availability and booking conditions.",
        value: "Free or discounted, depending on the house",
      },
      {
        title: "Private events and house experiences",
        description:
          "Members may receive invitations to selected private events, flagship-store experiences or workshops hosted by LVMH houses. Registration is required and capacity is limited.",
        value: "Free, subject to registration",
      },
      {
        title: "LVMH Shareholders' Club membership card",
        description:
          "The membership card is issued after online registration and verification of share ownership. It gives access to the club's benefits during its validity period.",
        value: "Free, generally valid for 2 years",
      },
      {
        title: "Dedicated shareholder relations service",
        description:
          "LVMH provides a shareholder relations contact channel for questions about share ownership, the club and shareholder events.",
        value: "Free",
      },
    ],
    faqs: [
      {
        question: "How many LVMH shares do I need to join the club?",
        answer:
          "One LVMH share is enough to apply for the LVMH Shareholders' Club. Membership is free and no annual fee is required.",
      },
      {
        question: "Are the benefits restricted to registered shares?",
        answer:
          "No. The LVMH Shareholders' Club is open to shareholders holding shares in bearer or registered form, as long as they can provide a valid proof of ownership.",
      },
      {
        question: "How do I apply for the LVMH Shareholders' Club?",
        answer:
          "Registration is completed online through the official club website. You need a recent shareholding certificate from your broker and proof of identity.",
      },
      {
        question: "Is there a minimum holding period?",
        answer:
          "No specific minimum holding period is required for club membership. You need to hold at least 1 share when applying and be able to document it.",
      },
      {
        question: "What are the main measurable benefits?",
        answer:
          "The clearest benefits are discounted media subscriptions, preferential Fondation Louis Vuitton ticketing, member rates on selected Moet Hennessy products and access to selected visits or events.",
      },
      {
        question: "Are the wine and spirits prices fixed?",
        answer:
          "No. Member prices can change over time. Check the official LVMH Shareholders' Club members' area for the current catalogue and terms before ordering.",
      },
      {
        question: "Does the club offer discounts on Louis Vuitton or Dior products?",
        answer:
          "No direct discounts on Louis Vuitton leather goods, fashion or Dior products are listed as a standard club benefit. The practical discounts mainly concern selected wines, spirits, media subscriptions and cultural access.",
      },
    ],
  },
};

export function getEnglishCompanyTranslation(slug: string) {
  return companyEnglishTranslations[slug] ?? null;
}

export function getEnglishCompanySlugs() {
  return Object.keys(companyEnglishTranslations);
}

export function hasEnglishCompanyTranslation(slug: string) {
  return slug in companyEnglishTranslations;
}
