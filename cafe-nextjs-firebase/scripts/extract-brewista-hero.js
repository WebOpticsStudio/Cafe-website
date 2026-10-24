const sharp = require('sharp');
const path = require('path');

async function extractBrewistaHero() {
  const sourcePath = 'C:/Users/pawan/.gemini/antigravity-ide/brain/4416ee87-65b0-4432-8cd6-9f851e27036c/.user_uploaded/media_1791979690548.png';
  
  // Crop the hero section (below navbar y: 44 to 352, width: 736, height: 308)
  const heroCrop = await sharp(sourcePath)
    .extract({ left: 0, top: 44, width: 736, height: 308 })
    .toBuffer();

  const startX = 370;
  const rightW = 736 - startX; // 366
  const rightH = 308;
  
  const rightPiece = await sharp(heroCrop)
    .extract({ left: startX, top: 0, width: rightW, height: rightH })
    .ensureAlpha()
    .toBuffer();

  // SVG mask for smooth transition on the left edge AND masking out bottom-left corner:
  const maskSvg = Buffer.from(`
    <svg width="${rightW}" height="${rightH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0" />
          <stop offset="10%" stop-color="#fff" stop-opacity="0.2" />
          <stop offset="25%" stop-color="#fff" stop-opacity="0.75" />
          <stop offset="40%" stop-color="#fff" stop-opacity="1" />
          <stop offset="100%" stop-color="#fff" stop-opacity="1" />
        </linearGradient>
        <mask id="cutCorner">
          <rect width="${rightW}" height="${rightH}" fill="#fff" />
          <!-- Black cuts out the old corner text -->
          <rect x="0" y="210" width="85" height="100" fill="#000" rx="16" />
        </mask>
      </defs>
      <rect width="${rightW}" height="${rightH}" fill="url(#fade)" mask="url(#cutCorner)" />
    </svg>
  `);

  const maskedRightPiece = await sharp(rightPiece)
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const targetW = 1472;
  const targetH = 616;
  const targetRightW = Math.round(rightW * 2);
  const targetRightH = Math.round(rightH * 2);

  const scaledMaskedPiece = await sharp(maskedRightPiece)
    .resize(targetRightW, targetRightH, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const outputPath = path.join(__dirname, '../public/images/brewista-real-hero.jpg');

  await sharp({
    create: {
      width: targetW,
      height: targetH,
      channels: 4,
      background: { r: 250, g: 247, b: 242, alpha: 1 }
    }
  })
  .composite([
    { input: scaledMaskedPiece, left: targetW - targetRightW, top: 0 }
  ])
  .jpeg({ quality: 96 })
  .toFile(outputPath);

  console.log('Brewista real hero generated successfully at:', outputPath);
}

extractBrewistaHero().catch(err => {
  console.error(err);
  process.exit(1);
});
