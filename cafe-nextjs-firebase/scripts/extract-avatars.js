const sharp = require('sharp');
const path = require('path');

async function extractAvatars() {
  const src = 'C:/Users/pawan/.gemini/antigravity-ide/brain/4416ee87-65b0-4432-8cd6-9f851e27036c/.user_uploaded/media_1791979786812.png';
  
  // Total size: 736 x 103
  // Rohan Mehta avatar: approx x: 200 to 226, y: 70 to 96
  // Simran Kaur avatar: approx x: 375 to 401, y: 70 to 96
  // Ankit Sharma avatar: approx x: 550 to 576, y: 70 to 96
  
  await sharp(src)
    .extract({ left: 202, top: 72, width: 24, height: 24 })
    .resize(96, 96, { kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 95 })
    .toFile(path.join(__dirname, '../public/images/avatar-rohan.jpg'));

  await sharp(src)
    .extract({ left: 376, top: 72, width: 24, height: 24 })
    .resize(96, 96, { kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 95 })
    .toFile(path.join(__dirname, '../public/images/avatar-simran.jpg'));

  await sharp(src)
    .extract({ left: 550, top: 72, width: 24, height: 24 })
    .resize(96, 96, { kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 95 })
    .toFile(path.join(__dirname, '../public/images/avatar-ankit.jpg'));

  console.log('Avatars extracted successfully!');
}

extractAvatars().catch(console.error);
