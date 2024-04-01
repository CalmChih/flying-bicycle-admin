import request from '@/util/request.js'

export const adminLogin = (account) => {
  return request.post('/adminLogin', {
    ...account
  })
}
