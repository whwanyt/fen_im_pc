import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
  state: () => {
    return { theme: null, loginViewStatue: false }
  },
  actions: {
    setTheme(val) {
      this.theme = val;
    },
    setLoginViewStatue(val:boolean){
      this.loginViewStatue = val;
    }
  },
  getters: {
    getTheme(state){
      return state.theme;
    },
    getLoginViewStatue(state){
      return state.loginViewStatue;
    }
  },
  persist:{
    key:"setting",
    storage: window.localStorage,
  }
})
