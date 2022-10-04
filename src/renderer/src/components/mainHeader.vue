<template>
  <div class="head">
    <div class="title"><slot></slot></div>
    <div class="fun no-drag">
      <div class="quit" @click="appQuit">
        <n-icon size="26">
          <close-outline />
        </n-icon>
      </div>
      <div class="quit" @click="appMinimize">
        <n-icon size="26">
          <remove-outline />
        </n-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  ColorPaletteOutline,
  ColorPaletteSharp,
  PersonOutline,
  HomeOutline,
  CloseOutline,
  SettingsOutline,
  RemoveOutline,
  ChevronBackSharp,
  ChevronForward
} from '@vicons/ionicons5'

export default defineComponent({
  name: 'MainHeader',
  components: {
    ColorPaletteOutline,
    ColorPaletteSharp,
    CloseOutline,
    PersonOutline,
    HomeOutline,
    SettingsOutline,
    RemoveOutline,
    ChevronBackSharp,
    ChevronForward
  },
  props: {
    quitEvent: {
      type: Function,
      default: () => {
        return window.api.WindowAppQuit({ winViewId: window.winViewId })
      }
    },
    minimizeEvent: {
      type: Function,
      default: () => {
        return window.api.WindowAppMinimize({ winViewId: window.winViewId })
      }
    }
  },
  setup(props) {
    const appQuit = () => {
      props.quitEvent()
    }

    const appMinimize = () => {
      props.minimizeEvent()
    }

    return {
      appQuit,
      appMinimize
    }
  }
})
</script>

<style lang="less">
.head {
  width: 100%;
  height: 35px;
  -webkit-app-region: drag;
  display: flex;
  .title {
    flex: 1;
  }
  .fun {
    display: flex;
    flex-direction: row-reverse;
    .quit {
      cursor: pointer;
      width: 45px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
