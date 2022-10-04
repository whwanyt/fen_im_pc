<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="list"
    :pagination="pagination"
    :on-update:page="onPage"
    :on-update:page-size="onPageSize"
  />
</template>

<script lang="ts">
import { ApiFileList, FileParams } from '../../../api/file'
import { ref, h, reactive } from 'vue'
import { FileModel } from '../../../model/file.mode'
import { NButton, NSpace, NTag, useMessage } from 'naive-ui'
import apiConfig from '../../../config/apiConfig'
export default {
  name: 'VideoWidget',
  setup() {
    const types = {
      image: 'image',
      video: 'video'
    }
    const createColumns = ({ onPlay, onClipboardWriteText }) => {
      return [
        {
          title: '名称',
          key: 'filename'
        },
        {
          title: '上传时间',
          key: 'createTime'
        },
        {
          title: '类型',
          key: 'tags',
          render() {
            return h(
              NTag,
              {
                style: {
                  marginRight: '6px'
                },
                type: 'info'
              },
              { default: () => 'video' }
            )
          }
        },
        {
          title: '操作',
          key: 'actions',
          width: 140,
          render(row: FileModel) {
            return h(
              NSpace,
              {},
              {
                default: () => [
                  h(
                    NButton,
                    {
                      size: 'small',
                      onClick: () => onPlay(row)
                    },
                    { default: () => '播放' }
                  ),
                  h(
                    NButton,
                    {
                      size: 'small',
                      onClick: () => onClipboardWriteText(row)
                    },
                    { default: () => '外链' }
                  )
                ]
              }
            )
          }
        }
      ]
    }

    const message = useMessage()
    const columns = createColumns({
      onPlay(rowData: FileModel) {
        window.api.openWin({ module: 'video', url: `#/video?url=${rowData.url}` })
      },
      onClipboardWriteText(rowData: FileModel) {
        window.api.clipboardWriteText(
          `${apiConfig.baseUrl}/assets/video/${rowData.md5}${rowData.extname}`
        )
        message.success('链接已复制')
      }
    })
    const pagination = reactive({
      itemCount: 0,
      pageSizes: [10, 20, 40],
      showSizePicker: true
    })
    const list = ref<FileModel[]>([])
    const params = ref<FileParams>({ pageNum: 1, pageSize: 20, sort: 1, type: types.video })
    const onPageSize = (size: number) => {
      params.value.pageSize = size
    }
    const onPage = (pageNum: number) => {
      params.value.pageNum = pageNum
      loadList()
      console.log(pageNum)
    }
    const loadList = async () => {
      const result = await ApiFileList(params.value)
      list.value = list.value.concat(result.data.list)
      pagination.itemCount = result.data.count
    }
    loadList()
    return {
      list,
      onPage,
      onPageSize,
      columns,
      pagination
    }
  }
}
</script>

<style lang="less" scoped></style>
