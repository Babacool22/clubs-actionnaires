"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ReactNode } from "react";

type EventProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

export function TrackedLink({
  href,
  eventName,
  eventProperties,
  catalogueReturnPath,
  className,
  children,
}: {
  href: string;
  eventName: string;
  eventProperties?: EventProperties;
  catalogueReturnPath?: string;
  className?: string;
  children: ReactNode;
}) {
  function handleClick() {
    if (catalogueReturnPath) {
      sessionStorage.setItem("catalogue-return-path", catalogueReturnPath);
      sessionStorage.setItem("catalogue-scroll-y", String(window.scrollY));
      window.history.replaceState(null, "", catalogueReturnPath);
    }
    track(eventName, eventProperties);
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

export function TrackedExternalLink({
  href,
  eventName,
  eventProperties,
  className,
  children,
}: {
  href: string;
  eventName: string;
  eventProperties?: EventProperties;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track(eventName, eventProperties)}
    >
      {children}
    </a>
  );
}
