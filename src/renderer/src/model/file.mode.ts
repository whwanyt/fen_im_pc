export interface FileModel {
  id: string
  url: string
  filename: string
  md5: string
  extname: string
  type: string
  extra?: string
  createTime?: string
  updateTime?: string
}
