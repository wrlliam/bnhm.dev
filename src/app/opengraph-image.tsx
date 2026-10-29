import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const dynamic = "force-static";
export const alt =
  "William Banham, full-stack developer and infrastructure & network engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#F3F7F9",
        color: "#0A2540",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 3,
          color: "#0E5A6B",
        }}
      >
        <span>BNHM.DEV</span>
        <span>{profile.location.toUpperCase()}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{ fontSize: 148, fontWeight: 700, letterSpacing: -6, lineHeight: 0.95 }}
        >
          William
        </div>
        <div
          style={{ fontSize: 148, fontWeight: 700, letterSpacing: -6, lineHeight: 0.95 }}
        >
          Banham
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontSize: 30,
          color: "#0E5A6B",
        }}
      >
        <div style={{ width: 56, height: 2, background: "#3A8DA0" }} />
        {profile.role}
      </div>
    </div>,
    size,
  );
}
