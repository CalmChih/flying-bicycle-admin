import request from '@/util/request.js'

export const getOrderList = (searchParam) => {
  return request.post('/order/getOrderList', { ...searchParam })
}

export const getOrderInfo = (searchParam) => {
  return request.get('/order/getOrderInfo', {
    params: {
      orderId: searchParam.orderId
    }
  })
}

export const getGoodsRentalRanking = () => {
  return request.get('/order/getGoodsRentalRanking')
}

export const getOrderTrend = (searchParams) => {
  return request.post('/order/getOrderTrend', { ...searchParams })
}
