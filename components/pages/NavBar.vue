<script setup lang="ts">
const indexStore = useIndexStore();
const { showSidebar } = storeToRefs(indexStore);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};
</script>

<template>
  <nav>
    <ul>
      <li>
        <button class="hamburger" @click="toggleSidebar">
          <Icon
            fill="var(--beige)"
            size="32px"
            height="19px"
            name="hamburger-menu"
          />
        </button>
      </li>
      <li>
        <h1 class="title"><nuxt-link to="/">CarpoolAid</nuxt-link></h1>
      </li>
      <li>
        <!-- This will probably become a component with hover or click functionality -->
        <button class="profile">
          <Icon fill="var(--purple)" size="28px" name="person" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
nav {
  padding: 1.25rem 1.5rem;
  background-color: var(--green);
  border-radius: 1rem;
  position: relative;
  z-index: 100;

  ul {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    button {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .title {
      color: var(--beige);
    }

    .profile {
      background-color: var(--beige);
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
    }
  }
}
</style>
