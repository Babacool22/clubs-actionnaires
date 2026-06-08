"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

export default function CatalogueReturnLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const returnPath = sessionStorage.getItem("catalogue-return-path");
    if (!returnPath) return;

    event.preventDefault();
    router.push(returnPath);
  }

  return (
    <Link href="/#catalogue" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
