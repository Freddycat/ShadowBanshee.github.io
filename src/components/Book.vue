<template>
  <Modal isOverlay customClass id="book-modal">
    <Button isX @click="closeBook" />
    <div id="page">
      <Button @click="prevPage" id="prev" class="navigate" isImage>
        <img
          src="@/assets/images/periodical/TSBP1/Buttons/back_button.png"
          alt=""
        />
      </Button>

      <div class="page-content">
        <img :src="pages[currentPage]" alt="" />
      </div>

      <Button @click="nextPage" id="next" class="navigate" isImage>
        <img
          src="@/assets/images/periodical/TSBP1/Buttons/next_button.png"
          alt=""
        />
      </Button>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Button from "./Button.vue";
import Modal from "./Modal.vue";

const props = defineProps({
  bookId: {
    type: [String, Number],
    default: null,
  },
});

const emit = defineEmits(["close"]);
const pages = ref([]);
const totalPages = ref(0);
const currentPage = ref(0);

onMounted(() => {
  if (props.bookId === 1) {
    console.log("book open: ", props.bookId);
    pages.value = sortBook(book1);
    totalPages.value = pages.value.length;
  } else if (props.bookId === 2) {
    console.log("book open: ", props.bookId);
    pages.value = sortBook(book2);
    totalPages.value = pages.value.length;
  } else if (props.bookId === 3) {
    console.log("book open: ", props.bookId);
    pages.value = sortBook(book3);
    totalPages.value = pages.value.length;
  }
});

const book1 = import.meta.glob(
  "@/assets/images/periodical/TSBP1/*.{png,jpg,jpeg}",
  {
    eager: true,
    import: "default",
  }
);

const book2 = import.meta.glob(
  "@/assets/images/periodical/TSBP2/*.{png,jpg,jpeg}",
  {
    eager: true,
    import: "default",
  }
);

const book3 = import.meta.glob(
  "@/assets/images/periodical/TSBP3/*.{png,jpg,jpeg}",
  {
    eager: true,
    import: "default",
  }
);

function sortBook(book) {
  return Object.entries(book)
    .sort(([a], [b]) => {
      const numA = parseInt(a.match(/page(\d+)/)?.[1] || "0", 10);
      const numB = parseInt(b.match(/page(\d+)/)?.[1] || "0", 10);
      return numA - numB;
    })
    .map(([_, value]) => value); // get the image URLs
}

function nextPage() {
  console.log("clicked!");
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
  console.log(totalPages.value - 1);
  console.log(currentPage.value);
}

function prevPage() {
  console.log("clicked!");
  if (currentPage.value > 0) {
    currentPage.value--;
  }
}

const closeBook = () => {
  console.log("Closing book...");

  pages.value = [];
  totalPages.value = 0;
  currentPage.value = 0;
  emit("close");
};
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

#book-modal {
  position: fixed;
  z-index: 999;
}

#book {
  width: 93%;
  height: 90%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-shadow: 0px 32px 32px rgba(0, 0, 0, 0.8);
}

#page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.page-content {
  background: transparent url(../assets/images/gif.gif) no-repeat scroll center
    center;
  background-size: 30%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-width: 50%;
  max-width: fit-content;
  max-height: 100vh;
}

.book-page.active {
  display: block;
}

.book-page.active:hover {
  cursor: zoom-in;
}

.navigate {
  width: 12.5%;
  height: fit-content;
}

#prev {
  margin: 0%;
}

#next {
  margin: 0%;
}

#loading {
  width: 50%;
  margin-left: 25%;
  margin-top: -15%;
}

#error-message {
  font-family: "Sans";
}

#account-area {
  display: flex;
  flex-direction: row;
}

#account-loading {
  width: 35%;
  margin-top: -5%;
}

.slide-in-done {
  right: 1vw;
}

.Slide-enter-from {
  right: -120vw;
}

.Slide-enter-active {
  transition: right 0.3s ease;
}

.Slide-enter-to {
  right: 1vw;
}

.Slide-leave-from {
  right: 1vw;
}

.Slide-leave-active {
  transition: right 0.3s ease;
}

.Slide-leave-to {
  right: -120vw;
}
</style>
