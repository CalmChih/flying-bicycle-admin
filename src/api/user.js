import request from '@/util/request.js'

export const updateUserState = (userItem) => {
  return request.post('/user/updateUserState', {
    ...userItem
  })
}

export const getUserList = (searchParams) => {
  return request.post('/user/getUserList', { ...searchParams })
}
