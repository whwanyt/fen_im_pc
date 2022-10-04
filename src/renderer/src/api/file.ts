import { ListModel } from '../model/list.model'
import config from '../config/config'
import HttpUtil from '../utils/request'

export interface FileParams extends ListModel {
  type: string
}

export const ApiFileList = (params: FileParams) => {
  return HttpUtil.post(config.apiConfig.fileList, params)
}
