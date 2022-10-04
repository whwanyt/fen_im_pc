<template>
  <main-header />
  <div class="top-head">
    <div class="left">
      <n-input-group>
        <n-input clearable :style="{ width: '50%' }" placeholder="请输入文件名" />
        <n-select
          :style="{ width: '25%' }"
          :options="fileSelectOptions"
          clearable
          placeholder="请选择文件类型"
        />
        <n-button ghost> 搜索 </n-button>
      </n-input-group>
    </div>
    <div class="right">
      <n-button type="info" @click="uploadModelShow = true">上传</n-button>
    </div>
  </div>
  <div class="list" ref="scrollViewRef">
    <div class="item" v-for="item in list">
      <template v-if="item.type === types.image">
        <div class="box">
          <div class="left">
            <n-image height="150" :src="baseUrl + item.url" />
          </div>
          <div class="info">
            <h4>{{ item.filename }}</h4>
            <p class="md5">{{ item.md5 }}</p>
            <p class="date">{{ item.createTime }}</p>
          </div>
        </div>
        <div class="right">
          <n-space vertical>
            <n-button type="info" @click="onClipboardWriteText(item)">复制链接</n-button>
          </n-space>
        </div>
      </template>
      <template v-if="item.type === types.video">
        <div class="info">
          <h4>{{ item.filename }}</h4>
          <p class="md5">{{ item.md5 }}</p>
          <p class="date">{{ item.createTime }}</p>
        </div>
        <div class="right">
          <n-space vertical>
            <n-button type="info" @click="onPlay(item)">播放</n-button>
            <n-button type="info" @click="onClipboardWriteText(item)">复制链接</n-button>
          </n-space>
        </div>
      </template>
    </div>
  </div>
  <n-modal v-model:show="uploadModelShow">
    <n-card title="上传">
      <n-upload directory-dnd :custom-request="customRequest">
        <n-button>上传文件</n-button>
      </n-upload>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import MainHeader from '../../components/mainHeader.vue'
import { onMounted, ref } from 'vue'
import { UploadCustomRequestOptions, useMessage } from 'naive-ui'
import largeFileUpload from '../../utils/upload'
import { FileModel } from '../../model/file.mode'
import apiConfig from '../../config/apiConfig'
import { useUserStore } from '@renderer/store/user'
import { ApiFileList, FileParams } from '@renderer/api/file'
import { useInfiniteScroll } from '@vueuse/core'
onMounted(() => {
  console.log(window.winViewId)
  window.api.WindowSizeAlter({ winViewId: window.winViewId, status: true })
  window.api.changWindowSize({ winViewId: window.winViewId, width: 990, height: 580 })
  window.api.WindowMinSize({ winViewId: window.winViewId, width: 990, height: 580 })
})
const uploadModelShow = ref(false)
const user = useUserStore()
const upload = new largeFileUpload({
  baseUrl: apiConfig.baseUrl,
  headers: { authorization: user.getToken }
})
const baseUrl = apiConfig.baseUrl
const types = {
  default: 'default',
  image: 'image',
  video: 'video'
}
const customRequest = ({ file, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
  upload.addFile(file.file as File)
  upload
    .handleUpload({
      progress: function (val) {
        onProgress({ percent: val })
        console.log('[进度]', val)
      }
    })
    .then((res: FileModel) => {
      console.log(res)
      onFinish()
      message.success('上传成功！')
      list.value = []
      loadList()
    })
    .catch(() => {
      onError()
      message.error('上传失败！')
    })
}
const scrollViewRef = ref<HTMLElement | null>(null)

const message = useMessage()
const onPlay = (rowData: FileModel) => {
  window.api.openWin({ module: 'video', url: `#/video?url=${rowData.url}` })
}
const onClipboardWriteText = (rowData: FileModel) => {
  window.api.clipboardWriteText(
    `${apiConfig.baseUrl}/assets/video/${rowData.md5}${rowData.extname}`
  )
  message.success('链接已复制')
}

const fileSelectOptions = [
  {
    label: '图片',
    value: 'image'
  },
  {
    label: '视频',
    value: 'video'
  }
]

const list = ref<FileModel[]>([])
const params = ref<FileParams>({ pageNum: 1, pageSize: 20, sort: 1, type: types.default })

const loadList = async () => {
  const result = await ApiFileList(params.value)
  list.value = list.value.concat(result.data.list)
}
loadList()
useInfiniteScroll(
  scrollViewRef,
  () => {
    console.log('滚动了')
  },
  { distance: 10 }
)
</script>

<style lang="less" scoped>
.top-head {
  display: flex;
  justify-content: space-between;
  padding: 5px 15px 5px;
  .left {
    width: 65vw;
  }
}
.list {
  height: calc(100vh - 120px);
  overflow: hidden;
  overflow-y: auto;
  padding: 15px;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  .item {
    display: flex;
    border: 1px solid #e0e0e6;
    padding: 5px;
    margin-bottom: 5px;
    justify-content: space-between;
    .box {
      display: flex;
    }
    .left {
      display: flex;
      align-items: center;
      height: 150px;
      margin-right: 20px;
    }
  }
}
.n-card {
  max-width: 440px;
  .n-upload-trigger {
    width: 100%;
  }
}
</style>
