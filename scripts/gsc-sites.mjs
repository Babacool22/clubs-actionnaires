import { google } from "googleapis";
import {
  getGoogleAuthClient,
  WEBMASTERS_READONLY_SCOPE,
} from "./gsc-auth.mjs";

async function main() {
  const auth = await getGoogleAuthClient([WEBMASTERS_READONLY_SCOPE]);
  const webmasters = google.webmasters({ version: "v3", auth });

  const response = await webmasters.sites.list();
  const sites = response.data.siteEntry ?? [];

  if (sites.length === 0) {
    console.log("Aucune propriété Search Console accessible avec ces credentials.");
    return;
  }

  console.log("Propriétés Search Console accessibles:");
  for (const site of sites) {
    console.log(`- ${site.siteUrl} (${site.permissionLevel})`);
  }
}

main().catch((error) => {
  console.error(`Erreur GSC: ${error.message}`);
  process.exit(1);
});
