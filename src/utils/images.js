// utils/images.js
import { reactive } from "vue";

const exploreImages = import.meta.glob("../assets/images/zine_buttons/*", {
  eager: true,
});

const imageRefs = reactive({});

for (const path in exploreImages) {
  const cleanName = path
    .split("/")
    .pop()
    .replace(/\.(png|jpg|jpeg|gif|webp)$/, "");

  imageRefs[cleanName] = exploreImages[path].default;
}

export default imageRefs;
