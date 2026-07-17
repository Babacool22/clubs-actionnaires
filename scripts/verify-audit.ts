import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const adapter = new PrismaLibSql({
  url: "file:" + path.resolve(process.cwd(), "dev.db"),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const slugs = ["loreal", "air-liquide", "hermes", "lvmh"];
  for (const slug of slugs) {
    const c = await prisma.company.findUnique({
      where: { slug },
      include: { benefits: true, faqs: true },
    });
    console.log(
      "===",
      c?.name,
      "minShares=",
      c?.minShares,
      "benefits=",
      c?.benefits.length,
      "faqs=",
      c?.faqs.length
    );
    for (const b of c?.benefits ?? []) {
      if (
        b.value?.includes("7,") ||
        b.title.includes("Dividende") ||
        b.title.includes("Majoration") ||
        b.title.toLowerCase().includes("vins") ||
        b.title.toLowerCase().includes("tarifs")
      ) {
        console.log("  BENEFIT:", b.title, "|", b.value);
      }
    }
    for (const f of c?.faqs ?? []) {
      if (
        f.answer.includes("7,20") ||
        f.answer.includes("7,92") ||
        f.answer.includes("1 600") ||
        f.answer.toLowerCase().includes("tarif") ||
        f.question.includes("devenir") ||
        f.question.includes("Combien")
      ) {
        console.log("  FAQ:", f.question.slice(0, 70));
        console.log("   ->", f.answer.slice(0, 140));
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
