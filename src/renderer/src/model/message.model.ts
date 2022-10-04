export interface MessageModel {
  friendId: number
  userId: number
  content: TextMessage | ImageMessage | FileMessage
}

export interface MessageContent {
  type: string
}

export interface TextMessage extends MessageContent {
  text: string
}

export interface ImageMessage extends MessageContent {
  url: string
}

export interface FileMessage extends MessageContent {
  url: string
  filename: string
  fileType: string
  extname: string
}
