import { ipcMain } from 'electron'
import { WindowsMain } from '../main/windows'
import {
  PreloadBackColorOptions,
  PreloadOptions,
  PreloadSizeOptions,
  PreloadStatusOptions,
  PreloadUrlOptions
} from './type'
export default function ipc() {
  changWindowSize()
  WindowSizeAlter()
  WindowAppMinimize()
  WindowMinSize()
  CenterWindow()
  WindowAppQuit()
  setBackgroundColor()
  openWin()
}

function changWindowSize() {
  ipcMain.on('changWindowSize', (_event, data: PreloadSizeOptions) => {
    const win = WindowsMain.getInstance().getWin(data.winViewId)
    win && win.setSize(data.width, data.height)
  })
}
function WindowSizeAlter() {
  ipcMain.on('WindowSizeAlter', (_event, data: PreloadStatusOptions) => {
    const win = WindowsMain.getInstance().getWin(data.winViewId)
    win && (win.resizable = data.status)
  })
}

function WindowAppMinimize() {
  ipcMain.on('appMinimize', (_event, data: PreloadOptions) => {
    const win = WindowsMain.getInstance().getWin(data.winViewId)
    win && win.minimize()
  })
}
function WindowAppQuit() {
  ipcMain.on('appQuit', (_event, data: PreloadOptions) => {
    WindowsMain.getInstance().detWin(data.winViewId)
  })
}
function WindowMinSize() {
  ipcMain.on('windowMinSize', (_event, data: PreloadSizeOptions) => {
    const win = WindowsMain.getInstance().getWin(data.winViewId)
    win && win.setMinimumSize(data.width, data.height)
  })
}

function CenterWindow() {
  ipcMain.on('centerWindow', (_event, data: PreloadOptions) => {
    const win = WindowsMain.getInstance().getWin(data.winViewId)
    win && win.center()
  })
}

function setBackgroundColor() {
  ipcMain.on('setBackgroundColor', (_event, data: PreloadBackColorOptions) => {
    const win = WindowsMain.getInstance().getWin(data.winViewId)
    win && win.setBackgroundColor(data.color)
  })
}

function openWin() {
  ipcMain.on('openWin', (_event, data: PreloadUrlOptions) => {
    WindowsMain.getInstance().newWindow(data)
  })
}
