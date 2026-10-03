/** Principios de la home y la pieza que desarrolla cada uno (slugs verificados en tests). */
export const PRINCIPLE_LINKS = [
  { key: "atencion", slug: "escape-del-feudo-algoritmico" },
  { key: "soberania", slug: "soberania-digital" },
  { key: "protocolos", slug: "protocolos-vs-plataformas" },
] as const;

export type PrincipleKey = (typeof PRINCIPLE_LINKS)[number]["key"];
