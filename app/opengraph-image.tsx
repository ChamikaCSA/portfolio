import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — Fullstack Developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#070708",
          color: "#ebe6dc",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 4,
            color: "#8a867c",
          }}
        >
          <span>{profile.osName}</span>
          <span style={{ color: "#c8f542", textTransform: "uppercase" }}>
            open to work
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, lineHeight: 0.9 }}>Chamika</div>
          <div style={{ fontSize: 92, lineHeight: 0.9 }}>Abeykoon</div>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 28,
            }}
          >
            <div
              style={{
                width: 56,
                height: 8,
                background: "#c8f542",
                borderRadius: 99,
              }}
            />
            <div
              style={{
                width: 56,
                height: 8,
                background: "#ff7a4a",
                borderRadius: 99,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 24,
              color: "#8a867c",
              letterSpacing: 1,
            }}
          >
            Fullstack developer — web & mobile
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
