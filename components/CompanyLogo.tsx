import Image from "next/image";

type CompanyLogoProps = {
  name: string;
  logoUrl: string | null;
};

const LOGOS_WITH_RAW_BACKGROUND = new Set([
  "carnival-corporation-white",
  "carnival-corporation-white-vignette",
  "legrand-white-vignette",
  "lvmh",
  "norwegian-cruise-line-blue",
  "royal-caribbean",
  "sanofi-purple",
  "stellantis-brand",
]);

const LOGOS_WITH_TIGHT_PADDING = new Set([
  "capgemini",
  "carnival-corporation-white-vignette",
  "legrand-white-vignette",
  "teleperformance",
]);

const LOGOS_WITH_ROUNDED_IMAGE = new Set(["hermes"]);

const TIGHT_LOGO_PADDING = "clamp(0.35rem, 0.9vw, 0.75rem)";
const TRANSPARENT_LOGO_RADIUS = "0px";
const FALLBACK_LOGO_RADIUS = "8px";
const VIGNETTE_LOGO_RADIUS = "clamp(14px, 2vw, 22px)";

function logoKeyFromUrl(logoUrl: string | null) {
  if (!logoUrl) {
    return "";
  }

  const fileName = logoUrl.split("/").pop() ?? "";
  return fileName.replace(/\.[^.]+$/, "");
}

function initialsFromName(name: string) {
  return name
    .replace(/&/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function CompanyLogo({ name, logoUrl }: CompanyLogoProps) {
  const logoKey = logoKeyFromUrl(logoUrl);
  const hasRawBackground = logoUrl ? LOGOS_WITH_RAW_BACKGROUND.has(logoKey) : false;
  const logoMode = logoUrl ? (hasRawBackground ? "raw" : "transparent") : "fallback";
  const logoRadius =
    logoMode === "raw"
      ? VIGNETTE_LOGO_RADIUS
      : logoMode === "fallback"
        ? FALLBACK_LOGO_RADIUS
        : TRANSPARENT_LOGO_RADIUS;
  const imageRadius = LOGOS_WITH_ROUNDED_IMAGE.has(logoKey) ? VIGNETTE_LOGO_RADIUS : logoRadius;
  const imageStyle = {
    borderRadius: imageRadius,
    ...(LOGOS_WITH_TIGHT_PADDING.has(logoKey) ? { padding: TIGHT_LOGO_PADDING } : {}),
  };

  return (
    <div
      className="company-logo-shell"
      data-logo-key={logoKey}
      data-logo-mode={logoMode}
      style={{ borderRadius: logoRadius, overflow: "hidden" }}
    >
      {logoUrl ? (
        <Image
          className="company-logo-image"
          src={logoUrl}
          alt={`Logo ${name}`}
          fill
          sizes="(max-width: 767px) 10rem, 17rem"
          style={imageStyle}
        />
      ) : (
        <span className="company-logo-fallback">{initialsFromName(name)}</span>
      )}
    </div>
  );
}
