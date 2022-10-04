<template>
  <div class="sidebar">
    <div class="menu">
      <div class="menu-item" :class="tabIndex === 0 ? 'active' : ''" @click="onTabChange(0)">
        <n-icon size="26">
          <ChatboxEllipsesOutline />
        </n-icon>
      </div>
      <div class="menu-item" :class="tabIndex === 1 ? 'active' : ''" @click="onTabChange(1)">
        <n-icon size="26">
          <Aperture />
        </n-icon>
      </div>
    </div>
    <n-dropdown trigger="click" placement="right" :options="options" @select="handleSelect">
      <div class="setting">
        <n-icon :size="24">
          <Apps />
        </n-icon>
      </div>
    </n-dropdown>
  </div>
</template>

<script lang="ts">
import {
  ChatboxEllipsesOutline,
  Aperture,
  Apps,
  SettingsOutline,
  ExitOutline,
  FileTrayStackedSharp
} from '@vicons/ionicons5'
import { Component, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NIcon, useDialog } from 'naive-ui'
import { useUserStore } from '@renderer/store/user'
import { IM } from '@renderer/utils/socket'
export default {
  name: 'MainHeader',
  components: { ChatboxEllipsesOutline, Aperture, Apps },
  setup() {
    const tabIndex = ref(0)
    const onTabChange = (index: number) => {
      tabIndex.value = index
      onLoad()
    }
    const pages = ['/chat', '/about']
    const router = useRouter()
    const onLoad = () => {
      router.push(pages[tabIndex.value])
    }
    onLoad()

    function renderIcon(icon: Component) {
      return () => h(NIcon, null, { default: () => h(icon) })
    }

    const openFileWin = () => {
      window.api.openWin({ module: 'file', url: '#/file' })
    }

    const handleSelect = (key: string) => {
      console.log(key)
      switch (key) {
        case 'logout':
          onLogout()
          break
        case 'file':
          openFileWin()
          break
        default:
          break
      }
    }

    const user = useUserStore()
    const dialog = useDialog()
    const im = IM.getInstance()
    const onLogout = () => {
      dialog.success({
        title: '退出登录',
        content: '你确定退出登录吗？',
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: () => {
          im.logout()
          user.addToken('')
          router.replace('/login')
        }
      })
    }
    return {
      tabIndex,
      onTabChange,
      handleSelect,
      options: [
        {
          label: '文件管理',
          key: 'file',
          icon: renderIcon(FileTrayStackedSharp)
        },
        {
          label: '设置',
          key: 'setting',
          icon: renderIcon(SettingsOutline)
        },
        {
          label: '退出',
          key: 'logout',
          icon: renderIcon(ExitOutline)
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar {
  z-index: 99;
  width: 56px;
  height: 100%;
  position: relative;
  .menu {
    .menu-item {
      width: 56px;
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      -webkit-app-region: no-drag;
    }
    .active {
      position: relative;
      color: var(--primary-color);
      &::after {
        position: absolute;
        left: 0;
        top: 5px;
        content: '';
        width: 2px;
        height: 46px;
        background-color: var(--primary-color);
      }
    }
  }
  .setting {
    position: absolute;
    bottom: 20px;
    width: 56px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
