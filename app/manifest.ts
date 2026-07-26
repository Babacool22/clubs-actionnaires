import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clubs Actionnaires",
    short_name: "Clubs Actionnaires",
    description:
      "Comparez les clubs actionnaires, leurs avantages, leurs seuils et leurs conditions d'inscription.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#D71921",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["finance", "business", "reference"],
    lang: "fr",
    dir: "ltr",
  };
}
