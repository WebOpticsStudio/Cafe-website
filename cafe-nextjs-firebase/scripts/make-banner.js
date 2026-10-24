const sharp = require('sharp');
const path = require('path');

async function createSmoothBanner() {
  const W = 1600;
  const H = 800;
  const cupW = 950;
  const cupH = 800;

  const maskSvg = Buffer.from(`
    <svg width="${cupW}" height="${cupH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0" />
          <stop offset="15%" stop-color="#fff" stop-opacity="0.25" />
          <stop offset="35%" stop-color="#fff" stop-opacity="0.8" />
          <stop offset="55%" stop-color="#fff" stop-opacity="1" />
          <stop offset="100%" stop-color="#fff" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect width="${cupW}" height="${cupH}" fill="url(#grad)" />
    </svg>
  `);

  const cupResized = await sharp(path.join(__dirname, '../public/images/cappuccino.jpg'))
    .resize(cupW, cupH, { fit: 'cover', position: 'center' })
    .ensureAlpha()
    .toBuffer();

  const maskedCup = await sharp(cupResized)
    .composite([
      { input: maskSvg, blend: 'dest-in' }
    ])
    .png()
    .toBuffer();

  const outputPath = path.join(__dirname, '../public/images/hero-brewista-banner.jpg');

  await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: 250, g: 247, b: 242, alpha: 1 }
    }
  })
  .composite([
    { input: maskedCup, left: W - cupW, top: 0 }
  ])
  .jpeg({ quality: 93 })
  .toFile(outputPath);

  console.log('Smooth banner generated at:', outputPath);
}

createSmoothBanner().catch(err => {
  console.error(err);
  process.exit(1);
});
