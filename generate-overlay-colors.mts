#!/usr/bin/env node
/**
 * generate-overlay-colors.mts
 *
 * Reads lib/GalleryItems.ts, computes a dominant "overlayColor" for every
 * item from its actual image file (same averaging + darkening logic your
 * GalleryMedia component used to run live on every mouseenter), and writes
 * out a new GalleryItems.ts with `overlayColor` added to each object.
 *
 * This replaces per-hover canvas/getImageData sampling with a value
 * computed once, at build time — the fix for the 50+ image perf hit.
 *
 * Usage:
 *   npm install --save-dev sharp tsx
 *   npx tsx generate-overlay-colors.mts
 *
 * By default it writes to lib/GalleryItems.generated.ts so you can diff
 * before overwriting. Pass --write to overwrite lib/GalleryItems.ts
 * directly (a .bak copy of the original is kept alongside it).
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { pathToFileURL } from "node:url";
// ------------------------------------------------------------------
// CONFIG
// ------------------------------------------------------------------

const SOURCE_PATH = path.resolve("lib/GalleryItems.tsx");
const PUBLIC_DIR = path.resolve("public"); // item.src "/gallery/x.avif" -> public/gallery/x.avif
const EXPORT_NAME = "galleryItems"; // the exported array's name in the source file
const SAMPLE_SIZE = 64; // downscale target; sharp box-samples on resize, so this = averaging

const WRITE_IN_PLACE = process.argv.includes("--write");
const OUTPUT_PATH = WRITE_IN_PLACE
  ? SOURCE_PATH
  : path.resolve("lib/GalleryItems.generated.ts");

// ------------------------------------------------------------------
// Color logic — ported 1:1 from GalleryMedia's handleMouseEnter
// ------------------------------------------------------------------

function darken(r: number, g: number, b: number): [number, number, number] {
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  let darkness = 0.65;
  if (brightness > 190) darkness = 0.42;
  else if (brightness > 140) darkness = 0.52;
  else if (brightness < 70) darkness = 0.8;

  return [
    Math.round(r * darkness),
    Math.round(g * darkness),
    Math.round(b * darkness),
  ];
}

async function getDominantColor(filePath: string): Promise<string> {
  const { data, info } = await sharp(filePath)
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels; // 4 (RGBA)

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let totalWeight = 0;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 30) continue;

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    if (brightness > 245) continue; // ignore near-white highlights

    const weight = brightness < 120 ? 1.3 : 1;

    totalR += r * weight;
    totalG += g * weight;
    totalB += b * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return "rgb(40, 40, 40)"; // transparent/blown-out fallback

  const [r, g, b] = darken(
    totalR / totalWeight,
    totalG / totalWeight,
    totalB / totalWeight,
  );

  return `rgb(${r}, ${g}, ${b})`;
}

// ------------------------------------------------------------------
// Serializer — turns a JS object back into a TS object literal,
// preserving each item's original key order and appending overlayColor.
// ------------------------------------------------------------------

function formatValue(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null) return "null";
  return JSON.stringify(value);
}

function serializeItem(item: Record<string, unknown>, overlayColor: string): string {
  const keys = Object.keys(item);
  const lines = keys.map((key) => `    ${key}: ${formatValue(item[key])},`);
  lines.push(`    overlayColor: ${formatValue(overlayColor)},`);
  return `  {\n${lines.join("\n")}\n  }`;
}

// ------------------------------------------------------------------
// Main
// ------------------------------------------------------------------

async function main() {
  const originalSource = await fs.readFile(SOURCE_PATH, "utf-8");

  // tsx lets us import the .ts file directly and get real, typed values.
  const mod: Record<string, unknown> = await import(
  pathToFileURL(SOURCE_PATH).href,
);
  const items = mod[EXPORT_NAME] as Array<Record<string, unknown>>;

  if (!Array.isArray(items)) {
    throw new Error(
      `Expected an exported array named "${EXPORT_NAME}" in ${SOURCE_PATH}, got: ${typeof items}`,
    );
  }

  console.log(`Found ${items.length} items. Computing dominant colors...`);

  const serializedItems: string[] = [];
  let done = 0;

  for (const item of items) {
    const src = item.src as string;
    const relativeSrc = src.replace(/^\//, "");
    const filePath = path.join(PUBLIC_DIR, relativeSrc);

    let overlayColor: string;
    try {
      overlayColor = await getDominantColor(filePath);
    } catch (err) {
      console.warn(`  ! "${item.id}" (${filePath}): ${(err as Error).message} — using fallback`);
      overlayColor = "rgb(40, 40, 40)";
    }

    serializedItems.push(serializeItem(item, overlayColor));

    done += 1;
    if (done % 10 === 0 || done === items.length) {
      console.log(`  ${done}/${items.length} done`);
    }
  }

  const newArrayBlock = `export const ${EXPORT_NAME}: GalleryItem[] = [\n${serializedItems.join(",\n")},\n];`;

  // Replace just the exported array block, leaving imports/types/everything
  // else in the file untouched.
  const arrayRegex = new RegExp(
    `export const ${EXPORT_NAME}\\s*:\\s*GalleryItem\\[\\]\\s*=\\s*\\[[\\s\\S]*?\\];`,
  );

  if (!arrayRegex.test(originalSource)) {
    throw new Error(
      `Could not find "export const ${EXPORT_NAME}: GalleryItem[] = [...]" in ${SOURCE_PATH}. ` +
      `Check EXPORT_NAME / the export's type annotation.`,
    );
  }

  const newSource = originalSource.replace(arrayRegex, newArrayBlock);

  if (WRITE_IN_PLACE) {
    await fs.copyFile(SOURCE_PATH, `${SOURCE_PATH}.bak`);
    console.log(`Backed up original to ${SOURCE_PATH}.bak`);
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, newSource);

  console.log(`\nWrote updated file to ${OUTPUT_PATH}`);
  if (!WRITE_IN_PLACE) {
    console.log(`Review it, then rename it over lib/GalleryItems.ts, or re-run with --write.`);
  }

  console.log(`\nDon't forget: add "overlayColor: string;" to your GalleryItem type.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
