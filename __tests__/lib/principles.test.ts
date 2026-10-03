// @vitest-environment node
import { describe, expect, it } from "vitest";
import { getAllSlugs } from "@/lib/content/loader";
import { PRINCIPLE_LINKS } from "@/lib/principles";
import es from "@/lib/i18n/dictionaries/es";
import en from "@/lib/i18n/dictionaries/en";

describe("principios de la home", () => {
  it("cada principio enlaza a un artículo que existe", async () => {
    const slugs = await getAllSlugs("opinion");
    for (const { slug } of PRINCIPLE_LINKS) expect(slugs).toContain(slug);
  });

  it("cada principio tiene título, texto y CTA en ES y EN", () => {
    for (const dict of [es, en]) {
      const principios = (
        dict as unknown as { sections: { principios: Record<string, Record<string, string>> } }
      ).sections.principios;
      for (const { key } of PRINCIPLE_LINKS) {
        expect(principios[key]?.title).toBeTruthy();
        expect(principios[key]?.body).toBeTruthy();
        expect(principios[key]?.cta).toBeTruthy();
      }
    }
  });
});
