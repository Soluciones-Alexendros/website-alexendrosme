import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#141016",
        borderRadius: 40,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontWeight: 700,
        fontSize: 104,
        color: "#d4ab4f",
        letterSpacing: "-0.02em",
      }}
    >
      a.
    </div>,
    { ...size },
  );
}
