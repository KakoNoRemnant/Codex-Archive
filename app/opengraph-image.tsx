import { ImageResponse } from "next/og";

export const alt = "CODEX — Design Archive";
export const size = {
  width: 1200,
  height: 630,
};
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
        padding: "52px",
        background: "#111111",
        color: "#f1f0eb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        <span>Design Archive</span>
        <span>2026</span>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 230,
          fontWeight: 700,
          letterSpacing: "-0.09em",
          lineHeight: 0.8,
        }}
      >
        CODEX
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
        }}
      >
        <span>Explore creative projects.</span>
        <span>Identity / Interaction / Motion</span>
      </div>
    </div>,
    size,
  );
}
