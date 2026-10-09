

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
        const filePath = path.join(PUBLIC_DIR, src);
        let dims;
        if (src.endsWith(".mp4")) {
            dims = { width: 1280, height: 720 };
        } else {
            try {
                const buffer = readFileSync(filePath);
                dims = imageSize(buffer);
            } catch (err) {
                failed.push(`${src} (${err.message})`);
                return full;
            }
        }

        if (!dims.width || !dims.height) {
            failed.push(`${src} (no dimensions returned)`);
            return full;
        }

        let newBody = body;
        if (/\bwidth:\s*\d+/.test(newBody)) {
            newBody = newBody.replace(/width:\s*\d+/, `width: ${dims.width}`);
        } else {
            newBody = `    width: ${dims.width},\n` + newBody;
        }

        if (/\bheight:\s*\d+/.test(newBody)) {
            newBody = newBody.replace(/height:\s*\d+/, `height: ${dims.height}`);
        } else {
            newBody = `    height: ${dims.height},\n` + newBody;
        }

        updated++;
        return `${head}${newBody}${tail}`;
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
