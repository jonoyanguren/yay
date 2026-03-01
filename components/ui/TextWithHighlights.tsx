import React from "react";

interface TextWithHighlightsProps {
  text: string;
  highlights?: string[];
  className?: string;
  highlightClassName?: string;
  highlightColor?: string;
}

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.trim().replace("#", "");
  const raw =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (!/^[\da-fA-F]{6}$/.test(raw)) {
    return `rgba(215, 122, 97, ${alpha})`;
  }

  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getStableTilt(input: string, index: number) {
  let hash = 0;
  const source = `${input}-${index}`;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }
  // Range: roughly -1.6deg to +1.6deg
  return ((hash % 33) - 16) / 10;
}

export default function TextWithHighlights({
  text,
  highlights = [],
  className = "",
  highlightClassName = "",
  highlightColor = "#d77a61",
}: TextWithHighlightsProps) {
  const normalizedHighlights = Array.from(
    new Set(
      highlights
        .map((word) => word.trim())
        .filter(Boolean)
        .sort((a, b) => b.length - a.length),
    ),
  );

  if (!text) return <p className={className} />;
  if (normalizedHighlights.length === 0)
    return <p className={className}>{text}</p>;

  // Accent-insensitive matching so "meditacion" matches "meditación".
  const foldedTextChars: string[] = [];
  const foldedToOriginalIndex: number[] = [];
  for (let i = 0; i < text.length; i += 1) {
    const chunk = fold(text[i]);
    for (const char of chunk) {
      foldedTextChars.push(char);
      foldedToOriginalIndex.push(i);
    }
  }
  const foldedText = foldedTextChars.join("");

  const ranges: Array<{ start: number; end: number }> = [];
  for (const highlight of normalizedHighlights) {
    const foldedHighlight = fold(highlight);
    if (!foldedHighlight) continue;
    let fromIndex = 0;
    while (fromIndex < foldedText.length) {
      const matchIndex = foldedText.indexOf(foldedHighlight, fromIndex);
      if (matchIndex === -1) break;

      const start = foldedToOriginalIndex[matchIndex];
      const endFoldedIndex = matchIndex + foldedHighlight.length - 1;
      const end = (foldedToOriginalIndex[endFoldedIndex] ?? start) + 1;

      ranges.push({ start, end });
      fromIndex = matchIndex + foldedHighlight.length;
    }
  }

  if (ranges.length === 0) return <p className={className}>{text}</p>;

  ranges.sort((a, b) => a.start - b.start || b.end - a.end);
  const mergedRanges: Array<{ start: number; end: number }> = [];
  for (const range of ranges) {
    const prev = mergedRanges[mergedRanges.length - 1];
    if (!prev || range.start > prev.end) {
      mergedRanges.push({ ...range });
      continue;
    }
    prev.end = Math.max(prev.end, range.end);
  }

  return (
    <p className={className}>
      {(() => {
        const nodes: React.ReactNode[] = [];
        let cursor = 0;

        mergedRanges.forEach((range, index) => {
          if (cursor < range.start) {
            nodes.push(
              <React.Fragment key={`text-${index}`}>
                {text.slice(cursor, range.start)}
              </React.Fragment>,
            );
          }

          nodes.push(
            <mark
              key={`mark-${index}`}
              className={`inline-block px-[0.22em] rounded-[0.1em] font-semibold ${highlightClassName}`.trim()}
              style={{
                backgroundColor: hexToRgba(highlightColor, 0.9),
                color: "#ffffff",
                transform: `rotate(${getStableTilt(
                  text.slice(range.start, range.end),
                  index,
                )}deg)`,
                transformOrigin: "center 60%",
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
              }}
            >
              {text.slice(range.start, range.end)}
            </mark>,
          );

          cursor = range.end;
        });

        if (cursor < text.length) {
          nodes.push(
            <React.Fragment key="text-tail">
              {text.slice(cursor)}
            </React.Fragment>,
          );
        }

        return nodes;
      })()}
    </p>
  );
}
