import request from '@/util/request.js'

export const getTagList = (searchParam) => {
  return request.post('/tags/getTagList', {
    ...searchParam
  })
}

export const deleteTag = (tagId) => {
  return request.delete('/tags/deleteTag', {
    params: {
      tagId: tagId
    }
  })
}

export const insertTag = (tagItem) => {
  return request.post('/tags/insertTag', { tagName: tagItem.tagName })
}

export const updateTag = (tagItem) => {
  return request.post('/tags/updateTag', { ...tagItem })
}
