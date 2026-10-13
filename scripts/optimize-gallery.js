const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeGallery() {
  const dir = path.join(process.cwd(), 'public', 'gallery');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp') && !f.startsWith('vimeo_'));
  let optimizedCount = 0;
  let totalSaved = 0;

  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);

    if (stat.size > 500 * 1024) {
      const origSize = stat.size;
      const inputBuf = fs.readFileSync(full);
      const buf = await sharp(inputBuf)
        .resize({ width: 1440, height: 1440, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 72, effort: 6 })
        .toBuffer();

      // Ensure it's definitely smaller
      if (buf.length < origSize) {
        fs.writeFileSync(full, buf);
        const newSize = buf.length;
        const saved = origSize - newSize;
        totalSaved += saved;
        optimizedCount++;
        console.log(`[OPTIMIZED] ${f}: ${(origSize/1024).toFixed(0)}KB -> ${(newSize/1024).toFixed(0)}KB (-${(saved/1024).toFixed(0)}KB)`);
      }
    }
  }

  console.log(`\nCompleted! Optimized ${optimizedCount} images. Total saved: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB`);
}

optimizeGallery().catch(err => {
  console.error(err);
  process.exit(1);
});
