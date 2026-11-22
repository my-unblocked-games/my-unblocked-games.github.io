const fs = require("fs");
const path = require("path");
const { slugify } = require("../src/utils/slug");

const rootDir = path.join(__dirname, "..");
const dataDir = path.join(rootDir, "data");

/**
 * Get the page slug of every game in data/*.json (same naming as the build:
 * displayName, then name, then folder).
 */
function getValidGameNames() {
  const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  return jsonFiles.map(f => {
    const folder = path.basename(f, '.json');
    let json = {};
    try { json = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8')); } catch (e) { /* fall back to folder */ }
    return slugify(json.displayName || json.name || folder);
  });
}

/**
 * Get all game HTML files in the root directory
 */
function getGameHTMLFiles() {
  const files = fs.readdirSync(rootDir);

  // Filter for .html files, excluding special files
  const specialFiles = [
    'index.html',
    'index.template.html',
    'dmca.html',
    '404.html'
  ];

  return files.filter(f => {
    return f.endsWith('.html') && !specialFiles.includes(f);
  });
}

/**
 * Clean up orphaned game HTML pages
 */
function cleanupOrphanedPages() {
  console.log('\n🧹 Cleaning up orphaned game HTML pages...\n');

  const validGameNames = getValidGameNames();
  const gameHTMLFiles = getGameHTMLFiles();

  let deleted = 0;
  let kept = 0;

  gameHTMLFiles.forEach(htmlFile => {
    const gameName = path.basename(htmlFile, '.html');

    // Check if this game has a corresponding JSON file
    if (!validGameNames.includes(gameName)) {
      const filePath = path.join(rootDir, htmlFile);
      fs.unlinkSync(filePath);
      console.log(`🗑️  Deleted ${htmlFile} (no game in data/ has the slug "${gameName}")`);
      deleted++;
    } else {
      kept++;
    }
  });

  // Summary
  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   🗑️  Deleted: ${deleted} orphaned HTML pages`);
  console.log(`   ✓ Kept: ${kept} valid game pages`);
  console.log(`   📝 Total JSON files: ${validGameNames.length}\n`);

  if (deleted > 0) {
    console.log(`✨ Removed ${deleted} orphaned game page(s)\n`);
  } else {
    console.log(`✓ No orphaned pages found\n`);
  }
}

cleanupOrphanedPages();
