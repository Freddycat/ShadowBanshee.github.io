<template>
  <div
    class="tooltip-wrapper"
    @mouseenter="show"
    @mouseleave="hide"
    @mousemove="update"
  >
    <slot></slot>
    <transition name="tooltip-fade">
      <div v-if="isVisible" class="tooltip-content" :style="tooltipStyle" ref="contentRef">
        {{ content }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // Optional: for custom positioning, e.g., 'top', 'bottom', 'left', 'right'
  position: {
    type: String,
    default: "top",
  },
});

const isVisible = ref(false);
const tooltipX = ref(0);
const tooltipY = ref(0);
const contentRef = ref(null);

const show = (event) => {
  if (props.disabled) {
    isVisible.value = true;
    // On initial show, immediately calculate position
    // Use nextTick to ensure contentRef.value is available for the first calculation
    nextTick(() => {
        position(event.clientX, event.clientY);
    });
  }
};

const position = (mouseX, mouseY) => {
  const offset = 15; // Offset from the mouse cursor

  let newX = mouseX + offset;
  let newY = mouseY + offset;

  // Get viewport dimensions
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  if (contentRef.value) {
    const tooltipWidth = contentRef.value.offsetWidth;
    const tooltipHeight = contentRef.value.offsetHeight;

    // Check left edge
    if (newX < 0) {
      newX = offset;
    }

    // Check right edge
    if (newX + tooltipWidth > viewportWidth) {
      newX = mouseX - tooltipWidth - offset;
      if (newX < 0) {
        newX = viewportWidth - tooltipWidth - offset;
        if (newX < 0) newX = 0; // Absolute clamp
      }
    }

    // Check top edge
    if (newY < 0) {
      newY = offset;
    }

    // Check bottom edge
    if (newY + tooltipHeight > viewportHeight) {
      newY = mouseY - tooltipHeight - offset;
      if (newY < 0) {
        newY = viewportHeight - tooltipHeight - offset;
        if (newY < 0) newY = 0; // Absolute clamp
      }
    }
  }

  tooltipX.value = newX;
  tooltipY.value = newY;
};
const update = (event) => {
  if (isVisible.value) {
    position(event.clientX, event.clientY);
  }
};

const hide = () => {
  isVisible.value = false;
};

const tooltipStyle = computed(() => ({
  position: "fixed", // Use fixed to position relative to viewport
  left: `${tooltipX.value}px`,
  top: `${tooltipY.value}px`,
  // Add more styling for position if needed
}));
</script>

<style scoped>
.tooltip-wrapper {
  display: inline-block; /* Essential to wrap content correctly */
}

.tooltip-content {
  background-color: #333;
  color: white;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  z-index: 1000;
  white-space: nowrap;
  pointer-events: none;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s;
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}
</style>
