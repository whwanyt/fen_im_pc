<template>
  <div class="friend">
    <div class="search">
      <n-space>
        <n-input class="input" size="small" type="text" placeholder="" />
        <n-button class="add" size="small" @click="openFriendWin">
          <template #icon>
            <n-icon><add /></n-icon>
          </template>
        </n-button>
      </n-space>
    </div>
    <div class="list">
      <div class="item" v-for="item in friendList" :key="item.id" @click="onItemClick(item)">
        <n-image
          class="avatar"
          object-fit="cover"
          width="40"
          height="40"
          :src="item.friend.avatar"
          preview-disabled
        />
        <div class="box">
          <p class="name">{{ item.friend.userName }}</p>
        </div>
        <p class="time"></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import apiConfig from '@renderer/config/apiConfig'
import { FriendModel } from '@renderer/model/friend.model'
import { Add } from '@vicons/ionicons5'
export default {
  name: 'FriendListWidget',
  components: { Add },
  props: {
    friendList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  emits: ['onFriendInfo'],
  setup(_, context) {
    const onItemClick = (item: FriendModel) => {
      context.emit('onFriendInfo', item)
    }
    const openFriendWin = () => {
      window.api.openWin({
        module: 'friend',
        url: '#/friend',
        width: 500,
        height: 420,
        maximizable: false,
        center: true
      })
    }
    return { onItemClick, openFriendWin, baseUrl: apiConfig.baseUrl }
  }
}
</script>

<style lang="less" scoped>
.friend {
  width: 220px;
  height: 100vh;
}
.search {
  height: 30px;
  padding: 6px 10px 6px;
  background-color: #fff;
  margin-bottom: 5px;
  -webkit-app-region: drag;
  .add {
    -webkit-app-region: no-drag;
  }
  .input {
    width: 150px;
    -webkit-app-region: no-drag;
  }
}
.list {
  user-select: none;
  width: 220px;
  height: calc(100vh - 65px);
  overflow: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px;
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: var(--primary-color);
  }
  // &::-webkit-scrollbar-track {
  //   border-radius: 10px;
  //   background: #ededed;
  // }
  .item {
    cursor: pointer;
    height: 40px;
    padding: 5px 15px 5px 15px;
    display: flex;
    position: relative;
    background-color: #fff;
    border-radius: 4px;
    margin: 5px 2px 5px;
    -webkit-app-region: no-drag;
    .time {
      position: absolute;
      right: 15px;
      font-size: 12px;
      color: #666666;
    }
    .avatar {
      border-radius: 90px;
      margin-right: 15px;
    }
    .box {
      .name {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
