import SparkMD5 from 'spark-md5'
import axios from 'axios'

export interface UploadOptions {
  baseUrl: string
  headers: { authorization: string }
}

const log = (text: string) => console.log(`[upload]:${text}`)
export default class largeFileUpload {
  chunksSize = 1024 * 1024 * 10 //10M
  fileChunks: Blob[] = []
  file!: File
  baseUrl: string
  headers: { authorization: string }
  constructor(options: UploadOptions) {
    this.baseUrl = options.baseUrl
    this.headers = options.headers
  }

  addFile(file: File) {
    this.file = file
  }

  /**抽样计算文件哈希 */
  async calculateHashSample(): Promise<string> {
    return new Promise((resolve) => {
      const spark = new SparkMD5.ArrayBuffer()
      const reader = new FileReader()
      const file = this.file
      const size = this.file.size
      let offset = this.chunksSize
      let chunks = [file.slice(0, offset)]
      let cur = offset
      while (cur < size) {
        if (cur + offset >= size) {
          chunks.push(file.slice(cur, cur + offset))
        } else {
          const mid = cur + offset / 2
          const end = cur + offset
          chunks.push(file.slice(cur, cur + 2))
          chunks.push(file.slice(mid, mid + 2))
          chunks.push(file.slice(end - 2, end))
        }
        cur += offset
      }
      this.fileChunks = chunks
      reader.readAsArrayBuffer(new Blob(chunks))
      reader.onload = (e) => {
        spark.append(e.target!.result as ArrayBuffer)
        resolve(spark.end())
      }
    })
  }

  async existFile(hash: string) {
    axios.defaults.baseURL = this.baseUrl
    return await axios({
      method: 'get',
      url: '/file/existFile',
      headers: this.headers,
      params: { hash }
    })
  }

  async singleFile(file: File) {
    const form = new FormData()
    form.append('file', file, file.name)
    axios.defaults.baseURL = this.baseUrl
    return await axios.post('/file/singleFile', form, { headers: this.headers })
  }

  async handleUpload({ progress }: { progress: Function }) {
    const file = this.file
    if (!this.file) return
    const fileSize = file.size
    if (fileSize < this.chunksSize) {
      const info = await this.singleFile(file)
      log('使用单文件上传')
      return info.data.data
    }
    log('使用切片上传')
    let offset = this.chunksSize
    let cur = 0
    let count = 0
    const hash = await this.calculateHashSample()
    const existFile = await this.existFile(hash)
    progress(0)
    if (existFile.data.code === 200 && existFile.data.data != null) {
      progress(100)
      return existFile.data.data
    }
    while (cur < fileSize) {
      // 切割
      const chunk = file.slice(cur, cur + offset)
      cur += offset
      const chunkName = hash + '-' + count
      //上传参数
      const form = new FormData()
      form.append('hash', chunkName)
      form.append('filename', file.name)
      form.append('fileHash', hash)
      form.append('size', chunk.size.toString())
      form.append('file', chunk, file.name)
      let start = new Date().getTime()
      await this.requestChunk(form)
      log(`切片 ${count} 上传成功`)
      const now = new Date().getTime()
      const time = parseInt(((now - start) / 1000).toFixed(4))
      let rate = time / 30
      // 速率有最大2和最小0.5
      if (rate < 0.5) rate = 0.5
      if (rate > 2) rate = 2
      // 新的切片大小等比变化
      console.log(
        `切片${count}大小是${offset},耗时${time}秒，是30秒的${rate}倍，修正大小为${offset / rate}`
      )
      // 动态调整offset
      offset = offset / rate
      if (offset > this.chunksSize) {
        offset = this.chunksSize
      }
      count++
      progress(Math.trunc((cur / fileSize) * 100))
    }
    const result = await this.requestMerge(file.name, hash)
    return result.data.data
  }

  async requestChunk(fileData: FormData) {
    axios.defaults.baseURL = this.baseUrl
    return axios.post('/file/chunkFile', fileData, { headers: this.headers })
  }

  async requestMerge(filename: string, hash: string) {
    return await axios({
      method: 'get',
      url: '/file/merge',
      headers: this.headers,
      params: { filename, hash }
    })
  }
}
