import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    winViewId: number
    winViewModule: string
    electron: ElectronAPI
    api: typeof import('./index').api
  }
}
