import request from '@/util/request.js'

export const getAfterSalesList = (searchParam) => {
  return request.post('/afterSales/getAfterSalesList', { ...searchParam })
}

export const getAfterSalesByOrderId = (searchParam) => {
  return request.get('/afterSales/getAfterSalesByOrderId', {
    params: {
      orderId: searchParam.orderId
    }
  })
}

export const updateAfterSalesInfo = (searchParam) => {
  return request.post('/afterSales/updateAfterSalesInfo', { ...searchParam })
}
