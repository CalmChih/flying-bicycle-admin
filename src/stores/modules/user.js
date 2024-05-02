import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'userInfo',
  () => {
    const tokenInfo = ref({
      tokenName: '',
      tokenValue: ''
    })
    const username = ref('')
    const setTokenInfo = (token) => {
      tokenInfo.value = token
    }
    const setUsername = (account) => {
      username.value = account
    }
    const isLogin = computed(() => {
      return tokenInfo.value.tokenValue !== ''
    })
    const isAdmin = computed(() => {
      return tokenInfo.value.loginType !== '' && tokenInfo.value.loginType === 'admin'
    })
    const logout = () => {
      localStorage.removeItem('userInfo')
      tokenInfo.value = {}
      username.value = ''
    }

    return { tokenInfo, username, setTokenInfo, setUsername, isLogin, isAdmin, logout }
  },
  {
    persist: true
  }
)
