<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { getGoodsRentalRanking, getOrderTrend } from '@/api/order.js'
import dayjs from 'dayjs'

const bicycleRentalRankingRef = ref()
const orderTrendRef = ref()
let bicycleRentalRanking
const bicycleRentalRankingOption = {
  dataset: [
    {
      dimensions: ['goodsTitle', 'totalCount'],
      source: []
    }
  ],
  xAxis: {
    type: 'category',
    axisLabel: { interval: 0, rotate: 30 },
    name: '商品名称'
  },
  yAxis: {
    name: '预约数量'
  },
  series: [
    {
      type: 'bar'
    }
  ]
}
let orderTrend
const orderTrendOption = {
  dataset: [
    {
      dimensions: ['date', 'totalCount'],
      source: []
    }
  ],
  xAxis: {
    type: 'category',
    axisLabel: { interval: 0, rotate: 30 },
    name: '日期'
  },
  yAxis: {
    name: '下单数量'
  },
  series: [
    {
      type: 'line'
    }
  ]
}

onMounted(() => {
  getBicycleRentalRanking()
  getOrderTrendData()
  window.onresize = function () {
    bicycleRentalRanking.resize()
    orderTrend.resize()
  }
})

const getBicycleRentalRanking = async () => {
  bicycleRentalRanking = echarts.init(bicycleRentalRankingRef.value)
  bicycleRentalRanking.showLoading()
  const { data } = await getGoodsRentalRanking()
  bicycleRentalRankingOption.dataset[0].source = data
  bicycleRentalRanking.setOption(bicycleRentalRankingOption)
  bicycleRentalRanking.hideLoading()
}

const getOrderTrendData = async () => {
  orderTrend = echarts.init(orderTrendRef.value)
  orderTrend.showLoading()
  const searchParams = {
    startTime: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    endTime: dayjs().format('YYYY-MM-DD')
  }
  const { data } = await getOrderTrend(searchParams)
  orderTrendOption.dataset[0].source = data
  orderTrend.setOption(orderTrendOption)
  orderTrend.hideLoading()
}
</script>

<template>
  <div>
    <a-row justify="space-between">
      <a-col flex="1">
        <a-card title="自行车租赁排行榜">
          <div style="height: 300px; width: 100%" ref="bicycleRentalRankingRef"></div>
        </a-card>
      </a-col>
    </a-row>
    <a-row justify="space-between" style="margin-top: 4px">
      <a-col flex="1">
        <a-card title="一周下单数量趋势">
          <div style="height: 300px; width: 100%" ref="orderTrendRef"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped></style>
