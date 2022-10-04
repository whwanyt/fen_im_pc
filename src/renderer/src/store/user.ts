import { defineStore } from 'pinia'

export interface User {
  token: string
}

export const useUserStore = defineStore('user', {
  state: ():User => {
    return { token: '' }
  },
  actions: {
    addToken(token:string) {
      this.token = token
    }
  },
  getters: {
    getToken(state) {
      return state.token
    }
  },
  persist: {
    key: 'user',
    storage: window.localStorage
  }
})
