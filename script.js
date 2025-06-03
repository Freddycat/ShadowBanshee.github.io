// generate-items-json.js (e.g. in /scripts folder)

import fs from "fs";
import path from "path";
import glob from "fast-glob"; // npm install fast-glob

const imageBasePath = "src/assets/images/store/items";
const outputPath = "src/data/items.json";

async function generateItemsJson() {
  const files = await glob(`${imageBasePath}/*/**/*.{jpg,jpeg,png}`);

  const itemsMap = {};

  for (const filepath of files) {
    const segments = filepath.split(path.sep);
    const itemFolder = segments[segments.indexOf("items") + 1];
    const isCover = segments.includes("cover");

    if (!itemsMap[itemFolder]) {
      itemsMap[itemFolder] = {
        id: Object.keys(itemsMap).length + 1,
        title: itemFolder,
        price: 7,
        description: "Description placeholder...",
        cover: "",
        images: []
      };
    }

    const relativePath = filepath.replace("src/assets", "/images");

    if (isCover) {
      itemsMap[itemFolder].cover = relativePath;
    } else {
      itemsMap[itemFolder].images.push(relativePath);
    }
  }

  const items = Object.values(itemsMap);

  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
  console.log(`✅ Generated ${items.length} items to ${outputPath}`);
}

generateItemsJson();
