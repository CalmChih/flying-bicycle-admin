import request from '@/util/request.js'

export const getGoodsList = (searchParam) => {
  return request.get('/goods/getGoodsList', {
    params: {
      currentPage: searchParam.currentPage,
      pageSize: searchParam.pageSize
    }
  })
}

export const getGoodsTotal = () => {
  return request.get('/goods/getGoodsTotal')
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
