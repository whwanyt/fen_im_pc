import { RoleModel } from './role.model'

export interface UserModel {
  id: number
  userName: string
  email: string
  phone: string | null
  password: string
  avatar: string
  label: string
  isActive: boolean
  role: RoleModel
  createdDate: Date
  updatedDate: Date
}
