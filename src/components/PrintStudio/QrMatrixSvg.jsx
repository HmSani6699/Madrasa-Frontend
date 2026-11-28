import React from "react";

// Deterministic crisp vector verification matrix (QR-style) & linear barcode SVG
// Works offline with 100% print fidelity at any DPI

const hashCode = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const isFinderZone = (r, c, size) => {
  const inTopLeft = r < 7 && c < 7;
  const inTopRight = r < 7 && c >= size - 7;
  const inBottomLeft = r >= size - 7 && c < 7;
  return inTopLeft || inTopRight || inBottomLeft;
};

const isFinderDark = (r, c) => {
  if (r === 0 || r === 6 || c === 0 || c === 6) return true;
  if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
  return false;
};

export const QrMatrixSvg = ({
  value = "MADRASA-SHEBA",
  size = 56,
  fg = "#0f172a",
  bg = "#ffffff",
  className = "",
}) => {
  const grid = 21;
  const seed = hashCode(String(value || "MADRASA"));
  const rects = [];

  for (let r = 0; r < grid; r += 1) {
    for (let c = 0; c < grid; c += 1) {
      let dark = false;
      if (r < 7 && c < 7) {
        dark = isFinderDark(r, c);
      } else if (r < 7 && c >= grid - 7) {
        dark = isFinderDark(r, c - (grid - 7));
      } else if (r >= grid - 7 && c < 7) {
        dark = isFinderDark(r - (grid - 7), c);
      } else if (
        (r === 7 && (c < 8 || c >= grid - 8)) ||
        (c === 7 && (r < 8 || r >= grid - 8)) ||
        (r === grid - 8 && c < 8) ||
        (c === grid - 8 && r < 8)
      ) {
        dark = false;
      } else if (r === 6 || c === 6) {
        dark = (r + c) % 2 === 0;
      } else if (!isFinderZone(r, c, grid)) {
        const bitHash = hashCode(`${seed}:${r}:${c}:${value}`);
        dark = (bitHash & 1) === 1 || (bitHash % 7 === 0);
      }
      if (dark) {
        rects.push(<rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill={fg} />);
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`-1 -1 ${grid + 2} ${grid + 2}`}
      className={className}
      shapeRendering="crispEdges"
      aria-label="Verification QR"
    >
      <rect x={-1} y={-1} width={grid + 2} height={grid + 2} fill={bg} rx={1} />
      {rects}
    </svg>
  );
};

export const BarcodeSvg = ({
  value = "2026001",
  width = 140,
  height = 24,
  fg = "#0f172a",
  className = "",
}) => {
  const str = String(value || "2026001");
  const bars = [];
  let x = 2;
  // Guard bars
  bars.push(<rect key="g1" x={x} y={0} width={1.5} height={height} fill={fg} />);
  x += 3;
  bars.push(<rect key="g2" x={x} y={0} width={1.5} height={height} fill={fg} />);
  x += 3.5;

  for (let i = 0; i < str.length; i += 1) {
    const code = str.charCodeAt(i);
    const pattern = [
      (code % 3) + 1,
      ((code >> 2) % 2) + 1,
      ((code >> 3) % 3) + 1,
      ((code >> 5) % 2) + 1,
    ];
    pattern.forEach((w, idx) => {
      if (idx % 2 === 0) {
        bars.push(<rect key={`${i}-${idx}`} x={x} y={0} width={w} height={height - 2} fill={fg} />);
      }
      x += w + 1;
    });
  }

  bars.push(<rect key="e1" x={x} y={0} width={1.5} height={height} fill={fg} />);
  x += 3;
  bars.push(<rect key="e2" x={x} y={0} width={1.5} height={height} fill={fg} />);
  x += 3;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${Math.max(x, 60)} ${height}`}
      className={className}
      preserveAspectRatio="none"
    >
      {bars}
    </svg>
  );
};
