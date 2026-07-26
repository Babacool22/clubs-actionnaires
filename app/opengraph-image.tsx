import { ImageResponse } from "next/og";

export const alt =
  "Clubs Actionnaires — catalogue des avantages actionnaires";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          background: "#000000",
          color: "#FFFFFF",
          padding: "68px 72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 0,
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                display: "flex",
                borderRadius: 999,
                background: "#D71921",
              }}
            />
            CLUBS ACTIONNAIRES
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#8E8E8E" }}>
            clubsactionnaires.fr
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 960,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: 0,
              marginBottom: 28,
            }}
          >
            Tous les avantages de vos actions.
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 850,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#A7A7A7",
              letterSpacing: 0,
            }}
          >
            Seuils, conditions d&apos;inscription, avantages et sources
            vérifiées pour les grandes entreprises mondiales.
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: 8,
            display: "flex",
            background: "#D71921",
          }}
        />
      </div>
    ),
    size
  );
}
