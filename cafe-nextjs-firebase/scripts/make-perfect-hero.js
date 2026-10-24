const sharp = require('sharp');
const path = require('path');

async function makePerfectHero() {
  const W = 1600;
  const H = 700;
  const cupW = 950;
  const cupH = 700;

  // Mask that smoothly fades ONLY the left 180px of the cup image
  const maskSvg = Buffer.from(`
    <svg width="${cupW}" height="${cupH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0" />
          <stop offset="8%" stop-color="#fff" stop-opacity="0.15" />
          <stop offset="18%" stop-color="#fff" stop-opacity="0.6" />
          <stop offset="28%" stop-color="#fff" stop-opacity="1" />
          <stop offset="100%" stop-color="#fff" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect width="${cupW}" height="${cupH}" fill="url(#fade)" />
    </svg>
  `);

  const srcPath = path.join(__dirname, '../public/images/gallery-6-cup.jpg');
  
  const resizedCup = await sharp(srcPath)
    .resize(cupW, cupH, { fit: 'cover', position: 'center' })
    .ensureAlpha()
    .toBuffer();

  const maskedCup = await sharp(resizedCup)
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const outputPath = path.join(__dirname, '../public/images/hero-clean-artisan.jpg');

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
  .jpeg({ quality: 95 })
  .toFile(outputPath);

  console.log('Perfect clean artisan hero generated at:', outputPath);
}

makePerfectHero().catch(console.error);
