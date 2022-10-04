<template>
  <div class="content">
    <main-menu />
    <div class="page">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['chatPage']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import MainMenu from '../components/mainMenu.vue'
onMounted(() => {
  window.api.WindowSizeAlter({ winViewId: window.winViewId, status: true })
  window.api.changWindowSize({ winViewId: window.winViewId, width: 990, height: 620 })
  window.api.WindowMinSize({ winViewId: window.winViewId, width: 760, height: 500 })
})
</script>

<style lang="less" scoped>
.content {
  width: 100vw;
  height: 100vh;
  display: flex;
  .page {
    flex: 1;
  }
}
</style>
