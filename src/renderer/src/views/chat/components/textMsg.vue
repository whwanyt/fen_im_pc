<template>
  <div class="text">{{ content.text }}</div>
</template>

<script lang="ts">
export default {
  name: 'TextMsg',
  props: {
    isRight: { type: Boolean },
    content: { type: Object }
  }
}
</script>

<style lang="less" scoped>
.text {
  padding: 5px 10px 5px;
  background-color: #f6f5f8;
  border-radius: 0 15px 15px 15px;
  font-size: 14px;
}
.right {
  .text {
    border-radius: 15px 0 15px 15px;
    color: #ffffff;
    background-color: var(--primary-color);
  }
}
</style>
