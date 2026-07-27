import "dotenv/config";
import { createOrUpdateNewsletterIssue } from "@/lib/newsletter";
import { prisma } from "@/lib/prisma";

function parseSendDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Date invalide: ${value}`);
  }
  return date;
}

async function main() {
  const sendDateArg = process.argv.find((arg) => arg.startsWith("--send-date="));
  const sendDate = parseSendDate(sendDateArg?.split("=").slice(1).join("="));
  const issue = await createOrUpdateNewsletterIssue(sendDate);

  console.log(`Newsletter brouillon prête #${issue.id}`);
  console.log(`Date d'envoi: ${issue.sendDate.toISOString()}`);
  console.log(`Sujet: ${issue.subject}`);
  console.log(`Aperçu: http://localhost:3000/admin/newsletter/${issue.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
