import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} est requis pour utiliser Supabase.`);
  }
  return value;
}

export function createSupabaseAdminClient() {
  return createClient(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export function newsletterIssuesTableName() {
  return process.env.SUPABASE_NEWSLETTER_TABLE || "newsletter_issues";
}
