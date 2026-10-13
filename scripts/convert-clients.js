const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertClients() {
  const dir = path.join(process.cwd(), 'public', 'clients');
  const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  let count = 0;
  let totalSaved = 0;

  for (const f of files) {
    const full = path.join(dir, f);
    const origStat = fs.statSync(full);
    const parsed = path.parse(f);
    const outName = parsed.name + '.webp';
    const outPath = path.join(dir, outName);
    const inputBuf = fs.readFileSync(full);

    const buf = await sharp(inputBuf)
      .resize({ width: 360, height: 180, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toBuffer();

    fs.writeFileSync(outPath, buf);
    const saved = origStat.size - buf.length;
    totalSaved += saved;
    count++;
    console.log(`[CONVERTED] ${f} -> ${outName}: ${(origStat.size/1024).toFixed(1)}KB -> ${(buf.length/1024).toFixed(1)}KB`);
  }

  console.log(`\nCompleted! Converted ${count} client images to WebP. Saved ${(totalSaved / (1024 * 1024)).toFixed(2)} MB`);
}

convertClients().catch(err => {
  console.error(err);
  process.exit(1);
});
