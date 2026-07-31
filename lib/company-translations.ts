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

const baseCompanyEnglishTranslations: Record<
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
          "From 1 share, members can access the Moet Hennessy members' store. Historical examples, which must be checked against the current annually revised catalogue, include Moet & Chandon Imperial at about EUR186 per case of 6, Ruinart Brut at about EUR270 per case of 6 and Hennessy V.S.O.P. at about EUR47 per bottle. Products can be personalised and standard delivery is available in mainland France.",
        value: "Member rates, revised annually",
      },
      {
        title: "Les Echos Digital Premium subscription -50%",
        description:
          "From 1 share, club members may subscribe to Les Echos Digital Premium for EUR234 including tax per year through the members' area, approximately 50% below the public rate.",
        value: "EUR234/year, around -50%",
      },
      {
        title: "Investir Privilege subscription -50%",
        description:
          "From 1 share, members may subscribe to Investir Privilege for EUR138 including tax per year through their personal club area, approximately 50% below the public rate.",
        value: "EUR138/year, around -50%",
      },
      {
        title: "Connaissance des Arts subscription -40%",
        description:
          "From 1 share, members may subscribe to Connaissance des Arts for EUR69 per year through the members' area, approximately 40% below the public rate.",
        value: "EUR69/year, around -40%",
      },
      {
        title: "Le Parisien paper and digital subscription -60%",
        description:
          "From 1 share, the club offers the Le Parisien paper and digital package for EUR29.95 per month, approximately 60% below the standard rate.",
        value: "EUR29.95/month, around -60%",
      },
      {
        title: "Fondation Louis Vuitton tickets",
        description:
          "From 1 share, members may buy Premium fast-track tickets for Fondation Louis Vuitton at EUR10 each, limited to 2 tickets per member per year. The annual Y-Pass is EUR150 instead of EUR180.",
        value: "EUR10/ticket, max. 2/year; Y-Pass EUR150",
      },
      {
        title: "Visits to selected champagne houses and maisons",
        description:
          "From 1 share, members can book visits directly with selected group houses and present their membership card: Hennessy and Veuve Clicquot are free for 2 people, Ruinart is EUR35 per person instead of EUR75, Moet & Chandon offers a free visit and tasting, and Mercier offers a visit with a complimentary glass.",
        value: "Free to about -50%, depending on the house",
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
          "From 1 share, the renewable personal membership card is valid for 2 years and gives access to all club benefits. It is issued after online registration with proof of share ownership dated within the last 3 months and proof of identity.",
        value: "Free, valid for 2 years and renewable",
      },
      {
        title: "Dedicated shareholder relations service",
        description:
          "From 1 share, members can contact the dedicated Shareholder Relations service on 01 44 13 21 50, Monday to Friday from 9:30 a.m. to 6 p.m., or at clubactionnaires@lvmh.com for questions about ownership, club registration or events.",
        value: "Free",
      },
    ],
    faqs: [
      {
        question: "How many LVMH shares do I need to join the club?",
        answer:
          "One LVMH share is enough to join the LVMH Shareholders' Club. Membership is free, no annual fee is required, and the renewable membership card is valid for 2 years. The entry cost is the live market price of one MC share.",
      },
      {
        question: "Are the benefits restricted to registered shares?",
        answer:
          "No. The LVMH Shareholders' Club is open to shareholders holding shares in bearer or registered form, as long as they can provide a valid proof of ownership.",
      },
      {
        question: "How do I apply for the LVMH Shareholders' Club?",
        answer:
          "Register online at clublvmh-actionnaires.fr with a shareholding certificate issued by your broker within the last 3 months and proof of identity. The membership card is sent within 2 to 3 weeks.",
      },
      {
        question: "Is there a minimum holding period?",
        answer:
          "No minimum holding period is required. You need to hold at least 1 share when applying and be able to document it. LVMH does not offer an enhanced dividend or a loyalty bonus linked to the holding period.",
      },
      {
        question: "What are the main measurable benefits?",
        answer:
          "The clearest benefits include press subscriptions discounted by about 40% to 60%, Fondation Louis Vuitton tickets at EUR10 with a limit of 2 per year, annually revised member prices on selected Moet Hennessy products, and free or discounted visits to selected houses.",
      },
      {
        question: "Are the wine and spirits prices fixed?",
        answer:
          "No. Member prices are reviewed annually. Historical examples include Moet Imperial at about EUR186 per case of 6, Ruinart Brut at about EUR270 per case of 6 and Hennessy V.S.O.P. at about EUR47 per bottle. Always check the current catalogue at clublvmh-actionnaires.fr before ordering.",
      },
      {
        question: "Does the club offer discounts on Louis Vuitton or Dior products?",
        answer:
          "No direct discounts on Louis Vuitton leather goods, fashion or Dior products are listed as a standard club benefit. The practical discounts mainly concern selected wines, spirits, media subscriptions and cultural access.",
      },
    ],
  },
  ...companyEnglishTranslationsGroup1,
  ...companyEnglishTranslationsGroup2,
  ...companyEnglishTranslationsGroup3,
  ...companyEnglishTranslationsGroup4,
  ...companyEnglishTranslationsGroup5,
  ...companyEnglishTranslationsGroup6,
};

export const companyEnglishTranslations = Object.fromEntries(
  Object.entries(baseCompanyEnglishTranslations).map(([slug, translation]) => [
    slug,
    {
      ...translation,
      ...(canonicalEnglishTranslationOverrides[
        slug as keyof typeof canonicalEnglishTranslationOverrides
      ] ?? {}),
    },
  ])
) as Record<string, CompanyEnglishTranslation>;

export function getEnglishCompanyTranslation(slug: string) {
  return companyEnglishTranslations[slug] ?? null;
}

export function getEnglishCompanySlugs() {
  return Object.keys(companyEnglishTranslations);
}

export function hasEnglishCompanyTranslation(slug: string) {
  return slug in companyEnglishTranslations;
}
import { companyEnglishTranslationsGroup1 } from "@/lib/company-translations/en/group-1";
import { companyEnglishTranslationsGroup2 } from "@/lib/company-translations/en/group-2";
import { companyEnglishTranslationsGroup3 } from "@/lib/company-translations/en/group-3";
import { companyEnglishTranslationsGroup4 } from "@/lib/company-translations/en/group-4";
import { companyEnglishTranslationsGroup5 } from "@/lib/company-translations/en/group-5";
import { companyEnglishTranslationsGroup6 } from "@/lib/company-translations/en/group-6";
import { canonicalEnglishTranslationOverrides } from "@/lib/company-translations/canonical-overrides";
