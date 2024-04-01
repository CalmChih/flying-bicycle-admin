import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'userInfo',
  () => {
    const tokenInfo = ref({
      tokenName: '',
      tokenValue: ''
    })
    const setTokenInfo = ({ tokenName, tokenValue }) => {
      tokenInfo.value.tokenName = tokenName
      tokenInfo.value.tokenValue = tokenValue
    }

    const removeTokenInfo = () => {
      tokenInfo.value = { tokenName: '', tokenValue: '' }
    }

    return { tokenInfo, setTokenInfo, removeTokenInfo }
  },
  {
    persist: { paths: ['tokenInfo'] }
  }
)
