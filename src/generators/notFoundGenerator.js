/**
 * 404.html — GitHub Pages serves it for any missing path. Old game URLs
 * (e.g. "/Geometry%20Dash%20Lite.html") are forwarded to their slug page;
 * anything else shows a "page not found" screen.
 */
const { generateGoogleTag } = require("../utils/analytics");
const { SITE_URL } = require("../utils/constants");

function generateNotFoundPage(games) {
  // Old page name (lowercased) -> slug. Covers the previous folder-named URLs
  // and any differing display name, so case and encoding variants all resolve.
  const redirects = {};
  for (const game of games) {
    redirects[game.folder.toLowerCase()] = game.slug;
    redirects[game.name.toLowerCase()] = game.slug;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${generateGoogleTag()}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>Page not found Unlocked Games</title>
  <link rel="icon" href="/favicon.ico">
  <script>
    (function () {
      var map = ${JSON.stringify(redirects)};
      var path = location.pathname;
      try { path = decodeURIComponent(path); } catch (e) {}
      var key = path.replace(/^\\/+/, '').replace(/\\.html$/i, '').replace(/\\/+$/, '').toLowerCase();
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        location.replace('/' + map[key] + '.html' + location.search + location.hash);
      }
    })();
  </script>
  <style>
    :root { color-scheme: dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 16px;
      box-sizing: border-box;
      background: radial-gradient(circle at 50% 20%, #2d0052, #0d001a 70%);
      color: #fff;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      text-align: center;
    }
    main { max-width: 440px; }
    .code { font-size: clamp(4rem, 18vw, 6rem); font-weight: 800; line-height: 1; color: #ff66ff; }
    h1 { margin: 0.75rem 0 0.5rem; font-size: 1.5rem; }
    p { margin: 0 0 1.5rem; color: rgba(255, 255, 255, 0.75); line-height: 1.5; }
    a.home {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 999px;
      background: linear-gradient(135deg, #ff66ff, #cc00ff);
      color: #fff;
      font-weight: 700;
      text-decoration: none;
    }
    a.home:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
  </style>
</head>
<body>
  <main>
    <div class="code">404</div>
    <h1>Page not found</h1>
    <p>This page doesn't exist or has moved. Browse all games on the homepage.</p>
    <a class="home" href="${SITE_URL}/">Back to all games</a>
  </main>
</body>
</html>`;
}

module.exports = { generateNotFoundPage };
