<template>
  <default-avatar-msg :avatar="getAvatar()" :name="getName()" :isRight="isRight()">
    <div class="content-view">
      <text-msg v-if="info.content.type === messageTypes.text" :content="info.content" />
      <file-msg v-if="info.content.type === messageTypes.file" :content="info.content" />
    </div>
  </default-avatar-msg>
</template>

<script lang="ts">
import { messageTypes } from '@renderer/utils/messageEnum'
import DefaultAvatarMsg from './defaultAvatarMsg.vue'
import TextMsg from './textMsg.vue'
import FileMsg from './fileMsg.vue'
export default {
  name: 'MessageItem',
  components: { DefaultAvatarMsg, TextMsg, FileMsg },
  props: {
    user: { type: Object },
    friend: { type: Object },
    info: { type: Object }
  },
  setup(props) {
    const isRight = () => {
      return props.info.userId == props.user.id ? true : false
    }
    const getName = () => {
      return props.info.userId == props.user.id ? props.user.userName : props.friend.userName
    }
    const getAvatar = () => {
      let avatar = ''
      if (props.info.userId == props.user.id) {
        avatar = props.user.avatar
      } else {
        avatar = props.friend.avatar
      }
      return avatar || 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
    }

    return {
      messageTypes,
      isRight,
      getName,
      getAvatar
    }
  }
}
</script>

<style lang="less" scoped></style>
