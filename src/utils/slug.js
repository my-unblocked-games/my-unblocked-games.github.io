/**
 * URL slugs for game pages: lowercase ASCII words joined by single hyphens,
 * e.g. "Geometry Dash Lite" -> "geometry-dash-lite", "1v1.lol" -> "1v1-lol".
 */

// Root-level pages a game slug must never overwrite.
const RESERVED = new Set(["index", "index-template", "dmca", "404", "sitemap", "robots"]);

function slugify(name) {
  return String(name)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents (é -> e)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "") // "Papa's" -> "papas", not "papa-s"
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Assign game.slug (from the display name) for every game; fails the build on
 * empty, reserved or duplicate slugs so two games can never share one URL.
 */
function assignSlugs(games) {
  const seen = new Map();
  for (const game of games) {
    const slug = slugify(game.name);
    if (!slug) throw new Error(`Game "${game.folder}" produces an empty URL slug`);
    if (RESERVED.has(slug)) throw new Error(`Game "${game.folder}" slug "${slug}" clashes with a site page`);
    if (seen.has(slug)) throw new Error(`Games "${seen.get(slug)}" and "${game.folder}" both map to /${slug}.html`);
    seen.set(slug, game.folder);
    game.slug = slug;
  }
  return games;
}

module.exports = { slugify, assignSlugs };
