const fs = require("fs");
const path = require("path");

export default function handler(req, res) {
  const { nameWithDate } = req.query;
  const galleryPath = path.join(process.cwd(), "galleries", nameWithDate);

  if (!fs.existsSync(galleryPath)) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  const files = fs.readdirSync(galleryPath);

  const imageFiles = files
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .sort((a, b) => {
      const numA = parseInt(path.parse(a).name, 10);
      const numB = parseInt(path.parse(b).name, 10);
      return numA - numB;
    });

  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedImages = imageFiles.slice(startIndex, endIndex).map(file => {
    return `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/galleries/${nameWithDate}/${file}`;
  });

  res.status(200).json({
    gallery: nameWithDate,
    totalImages: imageFiles.length,
    currentPage: page,
    totalPages: Math.ceil(imageFiles.length / limit),
    images: paginatedImages
  });
}
