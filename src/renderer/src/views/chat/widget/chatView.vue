<template>
  <div class="chat-view">
    <main-header>
      <p class="name">{{ props.friendInfo ? props.friendInfo.friend.userName : '' }}</p>
    </main-header>
    <div class="empty" v-if="!props.friendInfo">
      <n-empty description=" ">
        <template #icon>
          <n-icon :size="52"><AlbumsOutline /></n-icon>
        </template>
      </n-empty>
    </div>
    <template v-else>
      <div class="message-view" ref="messageViewRef">
        <div class="message-list" ref="messageListRef">
          <message-item
            :user="props.friendInfo.user"
            :friend="props.friendInfo.friend"
            v-for="(item, k) in messageList"
            :key="k"
            :info="item"
          />
        </div>
      </div>
      <div class="foot">
        <div class="tools">
          <div class="tool" @click="onShowFile">
            <n-icon :size="20">
              <FileTrayStackedSharp />
            </n-icon>
          </div>
        </div>
        <div class="input-view">
          <n-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            v-model:value="inputValue"
            placeholder="请输入..."
          />
          <div class="send" @click="sendMessage">
            <n-button text>
              <n-icon :size="24">
                <SendOutline />
              </n-icon>
            </n-button>
          </div>
        </div>
      </div>
    </template>
  </div>
  <n-modal v-model:show="selFileModal">
    <div class="file-modal">
      <n-card title="文件列表">
        <n-data-table
          :columns="fileTableColumns"
          :data="fileTableData"
          :pagination="fileTablePagination"
        />
      </n-card>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import { SendOutline, AlbumsOutline, FileTrayStackedSharp } from '@vicons/ionicons5'
import MessageItem from '../components/messageItem.vue'
import { h, nextTick, onActivated, Ref, ref, watch } from 'vue'
import { IM } from '@renderer/utils/socket'
import { FileMessage, MessageModel } from '@renderer/model/message.model'
import MainHeader from '@renderer/components/mainHeader.vue'
import { DataTableColumns, NButton, NEllipsis, NSpace, useDialog } from 'naive-ui'
import { FileModel } from '@renderer/model/file.mode'
import { ApiFileList, FileParams } from '@renderer/api/file'
import apiConfig from '@renderer/config/apiConfig'
const inputValue = ref('')
const im = IM.getInstance()
const props = defineProps({
  messageList: {
    type: Array,
    default: function () {
      return []
    }
  },
  friendInfo: {
    type: Object,
    default: function () {
      return {}
    }
  }
})
const sendMessage = () => {
  const message: MessageModel = {
    userId: props.friendInfo.user.id,
    friendId: props.friendInfo!.friend.id,
    content: { type: 'text', text: inputValue.value }
  }
  im.sendMessage('message', message)
  inputValue.value = ''
}

const selFileModal = ref(false)
const createColumns = (): DataTableColumns<FileModel> => {
  return [
    {
      title: '文件名',
      key: 'filename',
      render(row: FileModel) {
        return h(
          NEllipsis,
          {
            style: {
              maxWidth: '200px'
            }
          },
          {
            default: () => row.filename
          }
        )
      }
    },
    {
      title: '创建时间',
      key: 'createTime'
    },
    {
      title: '类型',
      key: 'type'
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return h(
          NSpace,
          {},
          {
            default: () => [
              h(
                NButton,
                {
                  size: 'small',
                  onClick: () => onFilePreview(row)
                },
                { default: () => '预览' }
              ),
              h(
                NButton,
                {
                  size: 'small',
                  onClick: () => onSendFile(row)
                },
                { default: () => '发送' }
              )
            ]
          }
        )
      }
    }
  ]
}
const fileTableColumns = createColumns()
const fileTablePagination = {
  pageSize: 6
}
const fileTableData: Ref<FileModel[]> = ref([])
const getFileList = async () => {
  const result = await ApiFileList(params.value)
  fileTableData.value = fileTableData.value.concat(result.data.list)
}
const params = ref<FileParams>({ pageNum: 1, pageSize: 20, sort: 1, type: 'default' })
const onShowFile = () => {
  selFileModal.value = true
  fileTableData.value = []
  getFileList()
}

const onFilePreview = (info: FileModel) => {
  console.log(info)
  if (info.type === 'video') {
    window.api.openWin({ module: 'video', url: `#/video?url=${info.url}` })
  }
}
const dialog = useDialog()
const onSendFile = (val: FileModel) => {
  dialog.info({
    title: '提示',
    content: '发送文件',
    positiveText: '永久链接',
    negativeText: '临时链接',
    onPositiveClick: () => {
      const message: MessageModel = {
        userId: props.friendInfo!.user.id,
        friendId: props.friendInfo!.friend.id,
        content: {
          type: 'file',
          url: apiConfig.baseUrl + val.url,
          filename: val.filename,
          fileType: val.type,
          extname: val.extname
        } as FileMessage
      }
      im.sendMessage('message', message)
    },
    onNegativeClick: () => {
      console.log('不确定')
    }
  })
}

const messageViewRef = ref<HTMLElement | null>(null)
const messageListRef = ref<HTMLElement | null>(null)
onActivated(() => {
  nextTick(() => {
    messageViewRef.value && (messageViewRef.value!.scrollTop = messageListRef.value!.scrollHeight)
  })
})
watch(
  () => props.messageList.length,
  () => {
    console.log(props.messageList)
    nextTick(() => {
      messageViewRef.value && (messageViewRef.value!.scrollTop = messageListRef.value!.scrollHeight)
    })
  }
)
</script>

<style lang="less" scoped>
.chat-view {
  flex: 1;
  margin: 5px;
  border-radius: 10px;
  background-color: #fefefe;
  position: relative;
  .name {
    padding-left: 15px;
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
  }
  .message-view {
    height: calc(100vh - 180px);
    padding: 10px;
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  .message-list {
    width: 100%;
  }
  .foot {
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 15px;
    width: calc(100% - 30px);
    height: 120px;
    border-radius: 12px;
    .input-view {
      background-color: #ffffff;
      display: flex;
      align-items: flex-end;
      .send {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
    .tools {
      .tool {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        cursor: pointer;
      }
    }
  }
  .empty {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.file-modal {
  width: 700px;
}
</style>
