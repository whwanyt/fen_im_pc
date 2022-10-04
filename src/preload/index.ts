import { contextBridge, clipboard, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {
  PreloadBackColorOptions,
  PreloadOptions,
  PreloadSizeOptions,
  PreloadStatusOptions,
  PreloadUrlOptions
} from './type'

// Custom APIs for renderer
export const api = {
  openWin: (option: PreloadUrlOptions) => ipcRenderer.send('openWin', option),
  changWindowSize: (option: PreloadSizeOptions) => ipcRenderer.send('changWindowSize', option),
  WindowSizeAlter: (option: PreloadStatusOptions) => {
    console.log(option)
    ipcRenderer.send('WindowSizeAlter', option)
  },
  WindowAppMinimize: (option: PreloadOptions) => ipcRenderer.send('appMinimize', option),
  WindowMinSize: (option: PreloadSizeOptions) => ipcRenderer.send('windowMinSize', option),
  CenterWindow: (option: PreloadOptions) => ipcRenderer.send('centerWindow', option),
  WindowAppQuit: (option: PreloadOptions) => ipcRenderer.send('appQuit', option),
  setBackgroundColor: (option: PreloadBackColorOptions) =>
    ipcRenderer.send('setBackgroundColor', option),
  clipboardWriteText: (text: string) => clipboard.writeText(text),
  on:(channel: string,listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(channel,listener),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
