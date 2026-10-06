/**
 * Generates the placeholder avatar in public/.
 *
 * The owner asked for an avatar slot with a placeholder until his own photo
 * arrives. An SVG source rasterised through sharp: no external asset, no
 * download, and the file is regenerable if the initials change.
 *
 * Usage: node scripts/make-avatar.mjs
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const SIZE = 512;

// Initials on the site's own dark surface with the brand accent, so the
// placeholder sits in the palette rather than standing out as stock art.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="#161B22"/>
  <rect x="6" y="6" width="${SIZE - 12}" height="${SIZE - 12}" rx="40"
        fill="none" stroke="#21262D" stroke-width="4"/>
  <text x="${SIZE / 2}" y="${SIZE / 2 + 56}" text-anchor="middle"
        font-family="sans-serif" font-size="196" font-weight="700"
        fill="#3B82F6">MR</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile("public/avatar.png", png);
console.log(`wrote public/avatar.png ${png.length} bytes`);