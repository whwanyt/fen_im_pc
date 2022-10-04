<script setup lang="ts">
import { computed } from 'vue'
import { useSettingStore } from './store/setting'
const setting = useSettingStore()
const theme = computed(() => setting.getTheme)
</script>

<template>
  <n-config-provider :theme="theme">
    <n-global-style />
    <n-message-provider>
      <n-dialog-provider>
        <n-loading-bar-provider>
          <router-view />
        </n-loading-bar-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
