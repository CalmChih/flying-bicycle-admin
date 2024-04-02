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

export const getGoodsInfoByTitle = (searchParam) => {
  return request.get('/goods/getGoodsInfoByTitle', {
    params: {
      goodsTitle: searchParam.goodsTitle
    }
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
