import "dotenv/config";
import {
  createSupabaseAdminClient,
  newsletterIssuesTableName,
} from "@/lib/supabase-admin";

async function main() {
  const supabase = createSupabaseAdminClient();
  const table = newsletterIssuesTableName();

  const { count, error: countError } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (countError) throw countError;

  const testSendDate = new Date("2099-01-01T08:00:00.000Z").toISOString();
  const { data: inserted, error: insertError } = await supabase
    .from(table)
    .upsert(
      {
        send_date: testSendDate,
        title: "Supabase configuration check",
        subject: "Supabase configuration check",
        preview_text: "Temporary row used by npm run supabase:check.",
        html: "<p>Temporary Supabase check</p>",
        status: "draft",
        segment: "supabase-check",
      },
      { onConflict: "send_date" },
    )
    .select("id")
    .single<{ id: number }>();

  if (insertError) throw insertError;

  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .eq("id", inserted.id);

  if (deleteError) throw deleteError;

  console.log(`Supabase OK: table ${table}, ${count ?? 0} issue(s) existante(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
