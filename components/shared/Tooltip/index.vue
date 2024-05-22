<!-- Source: ChatGPT-->
<template>
  <div
    class="tooltip-container"
    @mouseover="showTooltip"
    @mouseleave="hideTooltip"
  >
    <slot></slot>
    <div v-if="visible" class="tooltip-content" :class="positionClass">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: "top",
    validator: (value: string) =>
      ["top", "right", "bottom", "left"].includes(value),
  },
});

const visible = ref(false);

const positionClass = computed(() => `tooltip-${props.position}`);

const showTooltip = () => {
  visible.value = true;
};

const hideTooltip = () => {
  visible.value = false;
};
</script>

<style lang="scss">
.tooltip-container {
  position: relative;
  display: inline-block;

  .tooltip-content {
    position: absolute;
    background-color: var(--beige);
    color: var(--purple);
    text-align: center;
    border-radius: 0.5rem;
    padding: 0.05rem 0.2rem;
    z-index: 100;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 0.75rem;

    &.tooltip-top {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 5px;
    }

    &.tooltip-right {
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      margin-left: 5px;
    }

    &.tooltip-bottom {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 5px;
    }

    &.tooltip-left {
      top: 50%;
      right: 100%;
      transform: translateY(-50%);
      margin-right: 5px;
    }

    &.tooltip-visible {
      opacity: 1;
    }
  }

  &:hover .tooltip-content {
    opacity: 1;
  }
}
</style>
