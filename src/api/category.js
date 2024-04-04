import request from '@/util/request.js'

export const getCategoryList = (searchParam) => {
  return request.post('/category/getCategoryList', { ...searchParam })
}

export const deleteCategory = (categoryId) => {
  return request.delete('/category/deleteCategory', {
    params: {
      categoryId: categoryId
    }
  })
}

export const insertCategory = (categoryItem) => {
  return request.post('/category/insertCategory', { categoryName: categoryItem.categoryName })
}

export const updateCategory = (categoryItem) => {
  return request.post('/category/updateCategory', { ...categoryItem })
}
