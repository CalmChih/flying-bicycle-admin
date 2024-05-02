import request from '@/util/request.js'

export const getGoodsList = (searchParam) => {
  return request.post('/goods/getGoodsList', {
    ...searchParam
  })
}

export const updateGoods = (goodsItem) => {
  return request.post('/goods/updateGoods', {
    ...goodsItem
  })
}

export const insertGoods = (goodsItem) => {
  return request.post('/goods/insertGoods', {
    ...goodsItem
  })
}

export const deleteGoods = (goodsId) => {
  return request.delete('/goods/deleteGoods', { params: { goodsId } })
}

export const updateGoodsNum = (goodsItem) => {
  return request.post('/goods/updateGoodsNum', { ...goodsItem })
}

export const uploadImg = (file) => {
  return request.post(
    '/goods/uploadImg',
    { file },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}
