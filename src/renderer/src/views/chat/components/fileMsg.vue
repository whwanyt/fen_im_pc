<template>
  <div class="card" @click="onPlayVideo" v-if="content.fileType === 'video'">
    <img src="../../../assets/chat/msg-video.png" alt="" srcset="" class="icon" />
    <p class="name">{{ content.filename }}</p>
  </div>
  <div class="img" v-if="content.fileType === 'image'">
    <n-image :src="content.url" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'FileMsg',
  props: {
    isRight: { type: Boolean },
    content: { type: Object }
  },
  setup(props) {
    const onPlayVideo = () => {
      window.api.openWin({ module: 'video', url: `#/video?url=${props.content.url}` })
    }
    return {
      onPlayVideo
    }
  }
}
</script>

<style lang="less" scoped>
.img {
  :deep(img) {
    max-width: 220px;
  }
}
.right {
  .card {
    width: 200px;
    border-radius: 15px 0 15px 15px;
    padding: 5px 15px 5px;
    background-color: var(--primary-color);
    .icon {
      width: 45px;
      height: 45px;
    }
    .name {
      color: #ffffff;
    }
  }
}
</style>
