import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const GALLERY_DIR = path.resolve("public/gallery");
const FRAMES_DIR = path.resolve("public/frames");

async function optimizeGallery() {
  console.log("Optimizing gallery images...");
  const files = await fs.readdir(GALLERY_DIR);
  let totalSaved = 0;

  for (const file of files) {
    if (!file.endsWith(".webp")) continue;
    const filePath = path.join(GALLERY_DIR, file);
    const inputBuffer = await fs.readFile(filePath);
    const origSize = inputBuffer.length;

    const img = sharp(inputBuffer);
    const meta = await img.metadata();

    let pipeline = sharp(inputBuffer);
    const maxDim = 1440;
    if ((meta.width && meta.width > maxDim) || (meta.height && meta.height > maxDim)) {
      pipeline = pipeline.resize({
        width: meta.width && meta.width >= (meta.height || 0) ? maxDim : undefined,
        height: meta.height && meta.height > (meta.width || 0) ? maxDim : undefined,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const buffer = await pipeline
      .webp({ quality: 78, effort: 6 })
      .toBuffer();

    if (buffer.length < origSize) {
      await fs.writeFile(filePath, buffer);
      const saved = origSize - buffer.length;
      totalSaved += saved;
      console.log(
        `✓ ${file}: ${Math.round(origSize / 1024)} KB -> ${Math.round(buffer.length / 1024)} KB (saved ${Math.round(saved / 1024)} KB)`
      );
    } else {
      console.log(`- ${file}: already optimal (${Math.round(origSize / 1024)} KB)`);
    }
  }

  console.log(`Gallery optimization complete! Total saved: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB`);
}

async function optimizeFrames() {
  console.log("\nOptimizing animation frames...");
  const files = await fs.readdir(FRAMES_DIR);
  let totalSaved = 0;

  for (const file of files) {
    if (!file.endsWith(".jpg")) continue;
    const filePath = path.join(FRAMES_DIR, file);
    const inputBuffer = await fs.readFile(filePath);
    const origSize = inputBuffer.length;

    const buffer = await sharp(inputBuffer)
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();

    if (buffer.length < origSize) {
      await fs.writeFile(filePath, buffer);
      const saved = origSize - buffer.length;
      totalSaved += saved;
    }
  }

  console.log(`Frames optimization complete! Total saved: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB`);
}

async function main() {
  await optimizeGallery();
  await optimizeFrames();
}

main().catch((err) => {
  console.error("Optimization failed:", err);
  process.exit(1);
});
