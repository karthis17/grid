// scripts/add-image-dimensions.mjs
//
// One-time script. Reads the actual pixel width/height of every local image
// referenced in GalleryItems.ts and writes `width`/`height` fields directly
// into each item object. Run once, then delete this file.
//
// Setup:
//   npm install --save-dev image-size
//
// Run:
//   node scripts/add-image-dimensions.mjs
//
// Before running: check FILE_PATH below matches where GalleryItems.ts
// actually lives in your project (e.g. "lib/GalleryItems.ts",
// "src/lib/GalleryItems.ts", etc).

import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

const FILE_PATH = path.resolve("lib/GalleryItems.tsx");
const PUBLIC_DIR = path.resolve("public");

// Matches each item object: { id: "..", src: "..", ...rest }, in order.
const ITEM_REGEX =
    /(\{\s*\n\s*id:\s*"[^"]+",\s*\n\s*src:\s*"([^"]+)",\s*\n)([\s\S]*?)(\n\s*\},)/g;

async function run() {
    const source = await fs.readFile(FILE_PATH, "utf8");

    let updated = 0;
    let skipped = 0;
    const failed = [];

    const result = source.replace(ITEM_REGEX, (full, head, src, body, tail) => {
        if (/\bwidth:\s*\d+/.test(body)) {
            skipped++;
            return full; // already has dimensions, leave it alone
        }

        const filePath = path.join(PUBLIC_DIR, src);
        let dims;
        try {
            const buffer = readFileSync(filePath);
            dims = imageSize(buffer);
        } catch (err) {
            failed.push(`${src} (${err.message})`);
            return full;
        }

        if (!dims.width || !dims.height) {
            failed.push(`${src} (no dimensions returned)`);
            return full;
        }

        updated++;
        return `${head}    width: ${dims.width},\n    height: ${dims.height},\n${body}${tail}`;
    });

    await fs.writeFile(FILE_PATH, result, "utf8");

    console.log(`Done. Updated ${updated} item(s), skipped ${skipped} already-set item(s).`);
    if (failed.length) {
        console.log(`\nCould not read dimensions for ${failed.length} item(s):`);
        failed.forEach((f) => console.log("  -", f));
    }
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
