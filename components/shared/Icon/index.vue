<script lang="ts" setup>
const props = defineProps<{
  fill: string; // Ensure this is a valid CSS color value
  size: string;
  width?: string;
  height?: string;
  name: string;
}>();

const computedWidth = computed(() => props.width || props.size);
const computedHeight = computed(() => props.height || props.size);

// Import all SVGs within the specified folders
const icons = import.meta.glob("../../../assets/icons/**/*.svg", {
  eager: true,
  query: "?raw",
});

const dynamicSvgContent = ref("");

const resolveIconComponent = () => {
  const iconName = props.name.replace("ico-", "").replace(/-\d+px/, "");
  const iconPath = `../../../assets/icons/${props.size}/${iconName}.svg`;
  const matchedSvg = icons?.[iconPath];

  if (matchedSvg) {
    // Modify SVG content to include the 'fill' color
    dynamicSvgContent.value = matchedSvg.default
      .replace(/fill="[^"]*"/g, "") // Remove all fill attributes
      .replace(
        /<svg([^>]+)>/,
        `<svg$1 fill="${props.fill}" width="100%" height="100%">`,
      );
  }
};

resolveIconComponent();
</script>

<template>
  <span
    :style="{ width: computedWidth, height: computedHeight }"
    v-html="dynamicSvgContent"
  ></span>
</template>

<style scoped>
span {
  display: inline-flex;
}
</style>
