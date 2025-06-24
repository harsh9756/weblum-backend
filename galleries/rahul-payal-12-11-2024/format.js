const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "input");
const outputDir = path.join(__dirname, "output");
const maxWidth = 3000;
const maxHeight = 2000;
const quality = 95;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const files = fs.readdirSync(inputDir).filter(file => file.toLowerCase().endsWith(".jpg"));

files.forEach((file, index) => {
  const inputPath = path.join(inputDir, file);
  const outputFileName = `${index + 1}.webp`; // Rename to 1.webp, 2.webp, ...
  const outputPath = path.join(outputDir, outputFileName);

  sharp(inputPath)
    .rotate()
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true
    })
    .webp({ quality })
    .toFile(outputPath)
    .then(() => console.log(`✅ Saved as ${outputFileName}`))
    .catch(err => console.error(`❌ Error with ${file}:`, err));
});
