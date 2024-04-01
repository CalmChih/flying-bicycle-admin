import request from '@/util/request.js'

export const getTagList = () => {
  return request.get('/tags/getTagList')
}
