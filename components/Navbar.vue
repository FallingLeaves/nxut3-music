<template>
  <div class="navbar-view">
    <div class="navigation-buttons">
      <button-icon @click.native="go('back')">
        <svg-icon icon-class="arrow-left" />
      </button-icon>
      <button-icon @click.native="go('forward')">
        <svg-icon icon-class="arrow-right" />
      </button-icon>
    </div>
    <div class="navigation-links">
      <NuxtLink to="/">首页</NuxtLink>
      <NuxtLink to="/explore">发现</NuxtLink>
      <NuxtLink to="/library">音乐库</NuxtLink>
    </div>
    <div class="right-content">
      <div class="search-content">
        <svg-icon icon-class="search" />
        <input
          ref="searchInput"
          v-model="keywords"
          type="search"
          placeholder="搜索"
        />
      </div>
      <NuxtImg :src="avatarUrl" class="avatar" />
    </div>
  </div>
</template>

<script setup lang="ts">
const keywords = ref("")
const avatarUrl = computed(() => {
  return "http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=60y60"
})
const router = useRouter()
const go = (where: string) => {
  if (where === "back") router.go(-1)
  else router.go(1)
}
</script>

<style lang="scss" scoped>
.navbar-view {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding-left: 10vw;
  padding-right: 10vw;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
  -webkit-app-region: drag;
}

@media (max-width: 1336px) {
  .navbar-view {
    padding: 0 max(5vw, 90px);
  }
}

@supports (-moz-appearance: none) {
  .navbar-view {
    background-color: var(--color-body-bg);
  }
}

.navigation-buttons {
  flex: 1;
  display: flex;
  align-items: center;
  .svg-icon {
    height: 24px;
    width: 24px;
    color: var(--color-text);
  }
  button {
    -webkit-app-region: no-drag;
  }
}
@media (max-width: 970px) {
  .navigation-buttons {
    flex: unset;
  }
}

.navigation-links {
  flex: 1;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  user-select: none;
  a {
    -webkit-app-region: no-drag;
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
    border-radius: 6px;
    padding: 6px 10px;
    color: var(--color-text);
    transition: 0.2s;
    -webkit-user-drag: none;
    margin: {
      right: 12px;
      left: 12px;
    }
    &:hover {
      background: var(--color-secondary-bg-for-transparent);
    }
    &:active {
      transform: scale(0.92);
      transition: 0.2s;
    }
  }
  a.router-link-active {
    color: var(--color-primary);
  }
}

.right-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: end;
  .avatar {
    user-select: none;
    height: 30px;
    margin-left: 12px;
    vertical-align: -7px;
    border-radius: 50%;
    cursor: pointer;
    -webkit-app-region: no-drag;
    -webkit-user-drag: none;
    &:hover {
      filter: brightness(80%);
    }
  }
}

.search-content {
  display: flex;
  align-items: center;
  height: 32px;
  background: var(--color-secondary-bg-for-transparent);
  border-radius: 8px;
  width: 200px;
  padding-right: 10px;
  .svg-icon {
    height: 15px;
    width: 15px;
    color: var(--color-text);
    opacity: 0.28;
    margin: {
      left: 8px;
      right: 4px;
    }
  }
  input {
    font-size: 16px;
    border: none;
    background: transparent;
    width: 96%;
    font-weight: 600;
    margin-top: -1px;
    color: var(--color-text);
  }

  &:focus-within {
    background: var(--color-primary-bg-for-transparent);
    input,
    .svg-icon {
      opacity: 1;
      color: var(--color-primary);
    }
    input::placeholder {
      visibility: hidden;
    }
  }
}
</style>
