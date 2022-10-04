<template>
  <div class="chat-page">
    <friend-list-widget :friend-list="friendList" @onFriendInfo="onFriendInfo" />
    <chat-view :message-list="messageList" :friendInfo="friendInfo" />
  </div>
</template>

<script lang="ts">
import FriendListWidget from './widget/friendList.vue'
import ChatView from './widget/chatView.vue'
import { IM } from '@renderer/utils/socket'
import { useUserStore } from '@renderer/store/user'
import apiConfig from '@renderer/config/apiConfig'
import { onMounted, ref } from 'vue'
import { FriendModel } from '@renderer/model/friend.model'
import { MessageModel } from '@renderer/model/message.model'
export default {
  name: 'chatPage',
  components: { FriendListWidget, ChatView },
  setup() {
    const friendList = ref<FriendModel[]>([])
    const messageList = ref<MessageModel[]>([])
    const im = IM.getInstance()
    const user = useUserStore()

    const friendInfo = ref<FriendModel | null>(null)
    const onFriendInfo = async (val: FriendModel) => {
      messageList.value = []
      friendInfo.value = val
      params.value.friendId = friendInfo.value.friend.id
      const msgList = await getMegList()
      messageList.value = msgList as MessageModel[]
    }

    const params = ref({ pageNum: 1, pageSize: 20, sort: 2, friendId: 0 })
    const getMegList = () => {
      return new Promise((resolve) => {
        im.socket!.on('get-list', function (vals) {
          im.socket!.off('get-list')
          resolve(
            vals.map((item) => {
              return {
                ...item,
                content: JSON.parse(item.content)
              }
            })
          )
        })
        im.sendMessage('get-list', params.value)
      })
    }
    onMounted(() => {
      console.log(window.winViewModule)
      if (window.winViewModule === 'app') {
        im.load({ baseUrl: apiConfig.baseUrl })
        im.login(user.getToken)
        im.socket!.on('friend-list', (val) => {
          friendList.value = val
        })
        im.socket!.on('message', (message) => {
          console.log(message)
          messageList.value.push(message)
        })
      }
    })
    return {
      friendList,
      messageList,
      onFriendInfo,
      friendInfo
    }
  }
}
</script>

<style lang="less" scoped>
.chat-page {
  display: flex;
  background-color: #f2f2f2;
}
</style>
