import request from '@/util/request.js'

export const getCategoryList = () => {
  return request.get('/category/getCategoryList')
}
