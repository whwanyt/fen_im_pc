export interface PreloadOptions {
  winViewId: number
}

export interface PreloadUrlOptions {
  module: string
  center?: boolean
  url?: string
  width?: number
  height?: number
  maximizable?: boolean
}

export interface PreloadSizeOptions extends PreloadOptions {
  width: number
  height: number
}

export interface PreloadBackColorOptions extends PreloadOptions {
  color: string
}

export interface PreloadStatusOptions extends PreloadOptions {
  status: boolean
}
