import Image from "next/image";

type CompanyLogoProps = {
  name: string;
  logoUrl: string | null;
};

const LOGOS_WITH_PLATE = new Set([
  "arcelormittal-color",
  "carnival-corporation",
  "carnival-corporation-white",
  "carnival-corporation-white-vignette",
  "kering",
  "legrand-white-vignette",
  "loreal",
  "michelin",
  "renault",
  "telefonica",
]);

const LOGOS_WITH_TIGHT_PADDING = new Set([
  "capgemini",
  "carnival-corporation-white-vignette",
  "legrand-white-vignette",
  "teleperformance",
]);

const LOGOS_WITH_VIGNETTE_RADIUS = new Set([
  "accor-gold",
  "bnp-paribas-app",
  "bouygues",
  "carnival-corporation-white-vignette",
  "generali",
  "iberdrola-color",
  "legrand-white-vignette",
  "lvmh",
  "mcdonalds",
  "norwegian-cruise-line-blue",
  "procter-gamble-blue",
]);

const TIGHT_LOGO_PADDING = "clamp(0.35rem, 0.9vw, 0.75rem)";
const DEFAULT_LOGO_RADIUS = "8px";
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
  const needsPlate = logoUrl ? LOGOS_WITH_PLATE.has(logoKey) : true;
  const needsVignetteRadius = logoUrl ? LOGOS_WITH_VIGNETTE_RADIUS.has(logoKey) : false;
  const logoRadius = needsVignetteRadius ? VIGNETTE_LOGO_RADIUS : DEFAULT_LOGO_RADIUS;
  const imageStyle = {
    borderRadius: logoRadius,
    ...(LOGOS_WITH_TIGHT_PADDING.has(logoKey) ? { padding: TIGHT_LOGO_PADDING } : {}),
  };

  return (
    <div
      className="company-logo-shell"
      data-logo-key={logoKey}
      data-plate={needsPlate ? "true" : "false"}
      data-vignette={needsVignetteRadius ? "true" : "false"}
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
