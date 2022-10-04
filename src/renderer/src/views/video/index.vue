<template>
  <main-header :showHome="false" :isBackAndTo="true" />
  <div ref="videoViewRef" class="video-view"></div>
</template>

<script lang="ts" setup>
import MainHeader from '../../components/mainHeader.vue'
import apiConfig from '../../config/apiConfig'
import Player from 'xgplayer'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

window.api.WindowSizeAlter({
  status: true,
  winViewId: window.winViewId
})
window.api.changWindowSize({
  width: 990,
  height: 570,
  winViewId: window.winViewId
})
window.api.WindowMinSize({
  width: 700,
  height: 500,
  winViewId: window.winViewId
})

const videoViewRef = ref<HTMLDivElement | null>(null)
const route = useRoute()
const onVideoLoad = () => {
  const url = route.query.url!.includes('http')
    ? route.query.url
    : apiConfig.baseUrl + route.query.url
  new Player({
    el: videoViewRef.value!,
    url: url as string,
    width: '100vw',
    height: '100vh',
    autoplay: true
  })
}

onMounted(() => {
  onVideoLoad()
})
</script>

<style lang="less" scoped>
.head {
  position: fixed;
  top: 0;
  z-index: 9999;
}
.video-view {
  width: 100vw;
  height: 100vh;
}
</style>
