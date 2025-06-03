<template>
  <button
    v-if="isX"
    :class="[vueButton]"
    @click="$emit('click', $event)"
  >
    <p>✗</p>
  </button>

  <button
    v-else-if="isRouter && isImage && isHover"
    @click="navigate"
    :to="to"
    :class="vueButton"
    @mouseover="handleHover(true)"
    @mouseleave="handleHover(false)"
  >
    <slot :currentSrc="currentSrc" />
  </button>

  <button v-else-if="isRouter" @click="navigate" :to="to" :class="vueButton">
    <slot></slot>
  </button>

  <button
    v-else-if="isImage"
    :class="vueButton"
    @click="$emit('click', $event)"
    @mouseover="handleHover(true)"
    @mouseleave="handleHover(false)"
  >
    <slot v-if="isHover" :currentSrc="currentSrc" />
    <template v-else>
      <slot />
    </template>
  </button>

  <button
    v-else
    :class="vueButton"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

defineEmits(["click"]);

const props = defineProps({
  customClass: {
    type: [String, Array, Object],
    default: null,
  },
  isX: {
    type: Boolean,
    default: false,
  },
  isRouter: {
    type: Boolean,
    default: false,
  },
  to: String,
  isImage: {
    type: Boolean,
    default: false,
  },
  isHover: {
    type: Boolean,
    default: false,
  },
  src: String,
  hoverSrc: String,
  type: {
    type: String,
    default: "button", // Default type if not specified
  },
});

const vueButton = computed(() => {
  const classes = ["vueButton"];
  if (props.customClass) {
    classes.push(props.customClass);
  }
  if (props.isRouter) {
    classes.push("router-button");
  }
  if (props.isImage) {
    classes.push("image-button");
  }
  if (props.isX) {
    classes.push("x-button");
  }
  return classes;
});

function navigate(route) {
  if (!props.to) return;
  router.push(props.to);
}

const currentSrc = ref(props.src);

watch(
  () => props.src,
  (newVal) => {
    if (!props.isHover) currentSrc.value = newVal;
  }
);

watch(
  () => props.hoverSrc,
  (newVal) => {
    if (props.isHover) {
      // force update in case hoverSrc was initially missing
      currentSrc.value = props.src;
    }
  }
);

function handleHover(state) {
  if (!props.isHover) return;
  currentSrc.value = state ? props.hoverSrc : props.src;
}
</script>

<style scoped>
.vueButton {
  font-family: "AlterEgo BB W00 Regular";
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  margin: 0;
  padding: 0;
  padding: 4px 8px;
  background-color: rgba(0, 102, 255, 0.3);
  color: white;
  border-style: inset;
  border-radius: 1vw;
  border-color: aliceblue;
  border-width: 1px;
  transition: background-color, transform 0.3s;
}

.vueButton:hover {
  background-color: rgba(0, 102, 255, 1);
  border-style: outset;
  cursor: pointer;
  transform: scale(1.05);
}

.vueButton:active {
  background-color: rgba(0, 102, 255, 1);
  border-style: inset;
  cursor: pointer;
  transform: scale(1);
  filter: brightness(90%);
}

.image-button {
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: none;
  padding: 0;
  color: black;
}

.image-button:hover {
  filter: brightness(108%);
  background-color: transparent;
  border: none;
  transform: scale(1.1);
}

.x-button {
  background-color: rgba(0, 102, 255, 0.8);
  position: absolute;
  top: 0.8vw;
  right: 0.8vw;
  font-size: 2.4vw;
  color: #000000;
  border-radius: 3vw;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.x-button:hover {
  background-color: rgba(224, 0, 123, 0.8);
  border-radius: 3vw;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vueButton:disabled {
  cursor: not-allowed;
}
</style>
