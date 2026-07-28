type BeehiivSubscriptionResponse = {
  data?: {
    status?: string;
  };
  error?: string;
  message?: string;
};

function publicationId(value: string) {
  return value.startsWith("pub_") ? value : `pub_${value}`;
}

function beehiivConfig() {
  const apiKey = process.env.BEEHIIV_API_KEY?.trim();
  const configuredPublicationId = process.env.BEEHIIV_PUBLICATION_ID?.trim();

  if (!apiKey || !configuredPublicationId) {
    throw new Error("Beehiiv n'est pas configure pour les inscriptions.");
  }

  return {
    apiKey,
    publicationId: publicationId(configuredPublicationId),
    apiBase: process.env.BEEHIIV_API_BASE_URL?.trim() || "https://api.beehiiv.com/v2",
  };
}

export async function createBeehiivSubscription(params: {
  email: string;
  placement?: string;
}) {
  const { apiBase, apiKey, publicationId: publication } = beehiivConfig();
  const automationId = process.env.BEEHIIV_WELCOME_AUTOMATION_ID?.trim();
  const body = {
    email: params.email,
    send_welcome_email: true,
    reactivate_existing: false,
    utm_source: "clubsactionnaires.fr",
    utm_medium: "site_cta",
    utm_campaign: "le_club_actionnaire",
    utm_content: params.placement || "newsletter_cta",
    referring_site: "https://clubsactionnaires.fr",
    ...(automationId ? { automation_ids: [automationId] } : {}),
  };

  const response = await fetch(
    `${apiBase}/publications/${publication}/subscriptions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  const payload = (await response.json().catch(() => ({}))) as BeehiivSubscriptionResponse;

  if (!response.ok) {
    const details = payload.message || payload.error || "Beehiiv a refuse l'inscription.";
    throw new Error(`${response.status}:${details}`);
  }

  return {
    status: payload.data?.status || "validating",
  };
}
