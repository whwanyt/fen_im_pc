<template>
  <div class="message" :class="isRight ? 'right' : ''">
    <div class="avatar">
      <img :src="avatar" alt="" srcset="" />
    </div>
    <div class="content">
      <p class="name">{{ name }}</p>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DefaultAvatarMsg',
  props: {
    avatar: { type: String },
    name: { type: String },
    isRight: { type: Boolean }
  }
}
</script>

<style lang="less" scoped>
.message {
  margin-bottom: 5px;
  display: flex;
  .avatar {
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 90px;
    > img {
      width: 100%;
      height: 100%;
      border-radius: 90px;
    }
  }
  .name {
    font-size: 12px;
    font-weight: bold;
    line-height: 24px;
  }
  .content {
    max-width: 50vw;
    padding-left: 15px;
  }
}
.right {
  justify-content: right;
  flex-direction: row-reverse;
  .name {
    text-align: right;
  }
  .content {
    padding-right: 15px;
  }
}
</style>
