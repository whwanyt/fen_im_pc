import config from '../config/config'
import HttpUtil from '../utils/request'

export const ApiFriendList = () => {
  return HttpUtil.post(config.apiConfig.friendList, {})
}

export const ApiSearchFriend = (email:string) => {
  return HttpUtil.post(config.apiConfig.searchFriend, { email })
}

export const ApiAddFriend = (friendId:number) => {
  return HttpUtil.post(config.apiConfig.addFriend, { friendId })
}
