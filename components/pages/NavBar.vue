<script setup lang="ts">
import { logoutUser } from "~/modules/api/auth";

const indexStore = useIndexStore();
const { showSidebar } = storeToRefs(indexStore);

// check if logged in
const jwt = useCookie("sb-access-token");
const isLoggedIn = computed(() => !!jwt.value);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const props = defineProps({
  showHamburger: {
    type: Boolean,
    default: true,
  },
  showProfile: {
    type: Boolean,
    default: true,
  },
});

const showProfileMenu = ref(false);

const handleLogout = () => {
  logoutUser();
  showProfileMenu.value = false;
};
</script>

<template>
  <VFragment>
    <nav>
      <ul>
        <li class="flex justify-center content-center">
          <button
            v-show="showHamburger"
            class="hamburger"
            @click="toggleSidebar"
          >
            <Icon
              fill="var(--beige)"
              size="32px"
              height="19px"
              name="hamburger-menu"
            />
          </button>
        </li>
        <li class="title">
          <h1><nuxt-link to="/">CarpoolAid</nuxt-link></h1>
        </li>
        <li v-if="isLoggedIn && showProfile" class="flex gap-4 content-center">
          <Button
            variant="secondary"
            class="saved-trips flex gap-2"
            @click="$router.push('/profile/saved-trips')"
          >
            <Icon
              fill="var(--purple)"
              size="16px"
              width="12px"
              name="bookmark"
            />
            Saved trips
          </Button>
          <button class="profile" @click="showProfileMenu = !showProfileMenu">
            <Icon fill="var(--purple)" size="28px" name="person" />
          </button>
        </li>
        <li v-if="!isLoggedIn && showProfile">
          <Button variant="secondary" @click="$router.push('/auth/login')"
            >Login</Button
          >
        </li>
      </ul>
    </nav>
    <Popup
      v-show="showProfileMenu"
      class="profile-menu"
      width="10rem"
      height="auto"
    >
      <ul>
        <li><NuxtLink to="/profile">Profile</NuxtLink></li>
        <li>Settings</li>
        <li @click="handleLogout">Logout</li>
      </ul>
    </Popup>
  </VFragment>
</template>

<style scoped lang="scss">
nav {
  padding: 1rem 1.5rem;
  background-color: var(--green);
  border-radius: 1rem;
  position: relative;
  z-index: 100;

  ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 2.5rem;

    button {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .title {
      color: var(--beige);
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .profile {
      background-color: var(--beige);
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
    }
  }
}

.profile-menu {
  position: absolute;
  right: 1rem;
  top: 6rem;
  z-index: 200;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  ul {
    display: flex;
    flex-direction: column;
    li:not(:last-child) {
      border-bottom: 1px solid var(--purple);
    }
    li {
      padding: 0.75rem 1rem;
      cursor: pointer;
      text-align: center;
    }
  }
}
</style>
