import { UserModel } from './user.model'

export interface FriendModel {
  id: number
  user: UserModel
  friend: UserModel
  //0:待添加，1：已添加，2：已删除
  statue: number
  type: number
  createdDate: Date
  updatedDate: Date
}
