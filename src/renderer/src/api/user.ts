import config from '../config/config'
import HttpUtil from '../utils/request'

export interface loginUser {
  email: string
  password: string
}

export interface signInUser extends loginUser {
  userName: string
  code: string
  role: number
}
export const userLogin = (user: loginUser) => {
  return HttpUtil.post(config.apiConfig.login, user)
}

export const userSignIn = (user: signInUser) => {
  return HttpUtil.post(config.apiConfig.signIn, user)
}

export const userEmail = (email:string) => {
  return HttpUtil.post(config.apiConfig.sendEmail,{email})
}
