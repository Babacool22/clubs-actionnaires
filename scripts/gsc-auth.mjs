import "dotenv/config";
import { google } from "googleapis";

export const WEBMASTERS_READONLY_SCOPE =
  "https://www.googleapis.com/auth/webmasters.readonly";
export const BIGQUERY_READONLY_SCOPE =
  "https://www.googleapis.com/auth/bigquery.readonly";

export async function getGoogleAuthClient(scopes) {
  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const privateKey = process.env.GSC_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (clientEmail && privateKey) {
    return new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes,
    });
  }

  const auth = new google.auth.GoogleAuth({ scopes });
  try {
    return await auth.getClient();
  } catch (error) {
    throw new Error(
      [
        "Credentials Google introuvables.",
        "Configure GOOGLE_APPLICATION_CREDENTIALS dans .env avec le chemin du JSON service account,",
        "ou renseigne GSC_CLIENT_EMAIL et GSC_PRIVATE_KEY.",
        `Detail Google: ${error.message}`,
      ].join(" "),
    );
  }
}

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }
  return value;
}
