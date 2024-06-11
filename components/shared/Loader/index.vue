<!-- source: https://cssloaders.github.io/ -->
<script setup lang="ts"></script>

<template>
  <div class="loader__wrapper">
    <div class="loader"></div>
  </div>
</template>

<style scoped lang="scss">
.loader__wrapper {
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  top: 0rem;
  left: 0rem;

  background-color: #80808050;
}

.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: block;
  margin: 15px auto;
  position: relative;
  background: #fff;
  box-shadow:
    -24px 0 #fff,
    24px 0 #fff;
  box-sizing: border-box;
  animation: shadowPulse 2s linear infinite;
  z-index: 101;
}

@keyframes shadowPulse {
  33% {
    background: #fff;
    box-shadow:
      -24px 0 var(--red),
      24px 0 #fff;
  }
  66% {
    background: var(--red);
    box-shadow:
      -24px 0 #fff,
      24px 0 #fff;
  }
  100% {
    background: #fff;
    box-shadow:
      -24px 0 #fff,
      24px 0 var(--red);
  }
}
</style>
