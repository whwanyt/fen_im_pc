<template>
  <main-header />
  <div class="card">
    <n-input-group>
      <n-input v-model:value="searchEmailVal" placeholder="请输入对方邮箱" />
      <n-button type="primary" ghost @click="searchFriend"> 搜索 </n-button>
    </n-input-group>
    <div class="empty" v-if="isEmpty">
      <n-empty description="没有搜到呀" />
    </div>
    <div class="info">
      <div class="box">
        <n-image
          class="avatar"
          width="40"
          height="40"
          object-fit="cover"
          :src="info.avatar"
          preview-disabled
        />
        <p class="name">{{ info.userName }}</p>
      </div>
      <n-button strong secondary type="info" @click="onAddFriend">添加</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import mainHeader from '../components/mainHeader.vue'
import { ApiSearchFriend, ApiAddFriend } from '@renderer/api/friend'
import { reactive, ref } from 'vue'
import { HttpCode } from '@renderer/utils/httpCode'
import { useMessage } from 'naive-ui'
interface FriendModel {
  id: number | undefined
  userName: string
  avatar: string
}

const searchEmailVal = ref('')
const isEmpty = ref(true)
const info = reactive<FriendModel>({
  id: undefined,
  userName: '',
  avatar: ''
})
const searchFriend = async () => {
  isEmpty.value = true
  const result = await ApiSearchFriend(searchEmailVal.value)
  console.log(result.data)
  if (result.code === HttpCode.success && result.data.length > 0) {
    const res = result.data[0]
    info.id = res.id
    info.userName = res.userName
    info.avatar = res.avatar
    isEmpty.value = false
  }
}
const message = useMessage()
const onAddFriend = async () => {
  const result = await ApiAddFriend(info.id!)
  if (result.code === HttpCode.msg) {
    message.info(result.error!)
  } else if (result.code === HttpCode.success) {
    message.success('发送成功')
  }
}
</script>

<style lang="less" scoped>
.card {
  width: calc(100vw - 60px);
  height: calc(100vh - 95px);
  padding: 30px;
  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .info {
    margin: 15px 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .box {
      display: flex;
      align-items: center;
      .name {
        margin-left: 15px;
        font-size: 16px;
      }
    }
  }
}
</style>
