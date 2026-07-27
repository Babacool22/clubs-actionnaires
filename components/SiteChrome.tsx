"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterCta from "@/components/NewsletterCta";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      {!isAdmin && <NewsletterCta placement="global_before_footer" />}
      {!isAdmin && <Footer />}
    </>
  );
}
