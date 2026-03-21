/** YouTube watch, youtu.be, embed, shorts → embeddable video id */
export function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id?.replace(/[^a-zA-Z0-9_-]/g, "") || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") {
        return u.searchParams.get("v");
      }
      const embed = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (embed) return embed[1];
      const shorts = u.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shorts) return shorts[1];
    }
    return null;
  } catch {
    return null;
  }
}

/** vimeo.com/123456 → numeric id */
export function getVimeoVideoId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (!u.hostname.replace(/^www\./, "").includes("vimeo.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    const id = parts[0];
    if (id && /^\d+$/.test(id)) return id;
    return null;
  } catch {
    return null;
  }
}

export type VideoEmbedKind = "youtube" | "vimeo" | "file";

export function resolveVideoEmbed(url: string): {
  kind: VideoEmbedKind;
  embedSrc: string | null;
} {
  const trimmed = url.trim();
  if (!trimmed) return { kind: "file", embedSrc: null };

  const yt = getYouTubeVideoId(trimmed);
  if (yt) {
    return {
      kind: "youtube",
      embedSrc: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}`,
    };
  }

  const vm = getVimeoVideoId(trimmed);
  if (vm) {
    return {
      kind: "vimeo",
      embedSrc: `https://player.vimeo.com/video/${encodeURIComponent(vm)}`,
    };
  }

  return { kind: "file", embedSrc: null };
}
