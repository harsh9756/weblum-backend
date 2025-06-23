const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const quality = 80;
const folder = __dirname; // current folder

// Get all .jpg or .jpeg files
const images = fs
  .readdirSync(folder)
  .filter(file => /\.(jpe?g)$/i.test(file));

if (images.length === 0) {
  console.log("❌ No JPG images found.");
  process.exit(0);
}

// Async convert and delete
(async () => {
  for (const file of images) {
    const inputPath = path.join(folder, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(folder, `${baseName}.webp`);

    try {
      console.log(`🔧 Converting ${file} to WebP...`);

      await sharp(inputPath)
        .rotate() // correct EXIF orientation
        .webp({ quality })
        .toFile(outputPath);

      fs.unlinkSync(inputPath); // delete original file
      console.log(`✅ Saved ${outputPath} and deleted ${file}`);
    } catch (err) {
      console.error(`❌ Error converting ${file}:`, err.message);
    }
  }

  console.log("\n🎉 All images converted to .webp and originals deleted.");
})();
