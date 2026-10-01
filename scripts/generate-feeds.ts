import fs from "node:fs/promises";
import path from "node:path";
import { generateFeeds, generateCollectionFeeds } from "@/lib/feed";
import { getContentCollection } from "@/lib/content/loader";
import { siteConfig } from "@/lib/site";

async function main() {
  const opinion = await getContentCollection("opinion");

  const { rss, atom } = generateFeeds({
    site: siteConfig,
    collections: { opinion },
  });
  await fs.writeFile(path.join(process.cwd(), "public", "feed.xml"), rss, "utf-8");
  await fs.writeFile(path.join(process.cwd(), "public", "feed.atom"), atom, "utf-8");

  const { rss: opinionRss, atom: opinionAtom } = generateCollectionFeeds(
    siteConfig,
    "opinion",
    "Opinión",
    opinion,
  );
  await fs.writeFile(path.join(process.cwd(), "public", "feed-opinion.xml"), opinionRss, "utf-8");
  await fs.writeFile(path.join(process.cwd(), "public", "feed-opinion.atom"), opinionAtom, "utf-8");

  console.log("Feeds generated:");
  console.log("  public/feed.xml + public/feed.atom (master)");
  console.log("  public/feed-opinion.xml + public/feed-opinion.atom");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
