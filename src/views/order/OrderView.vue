<script setup>
import { ref } from 'vue'
import { getOrderInfo, getOrderList } from '@/api/order.js'

const pagination = ref({
  showSizeChanger: true, // 是否可以改变每页显示的条数
  pageSizeOptions: ['10', '20', '30', '40'], // 可选的每页显示条数
  showTotal: (total) => `共 ${total} 条`, // 显示总条数和当前数据范围
  current: 1, // 当前页数
  total: 50, // 总条数
  hideOnSinglePage: true
})
const columns = [
  {
    title: '订单id',
    width: 120,
    dataIndex: 'orderId',
    key: 'orderId',
    fixed: 'left'
  },
  {
    title: '用户账号',
    width: 120,
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '商品图片',
    dataIndex: 'goodsImg',
    key: 'goodsImg',
    width: 120
  },
  {
    title: '商品id',
    dataIndex: 'goodsId',
    key: 'goodsId',
    width: 80
  },
  {
    title: '商品标题',
    dataIndex: 'goodsTitle',
    key: 'goodsTitle',
    width: 120
  },
  {
    title: '租赁开始时间',
    dataIndex: 'reservationStartTime',
    key: 'reservationStartTime',
    width: 160
  },
  {
    title: '租赁结束时间',
    dataIndex: 'reservationEndTime',
    key: 'reservationEndTime',
    width: 160
  },
  {
    title: '租赁天数',
    dataIndex: 'reservationDays',
    key: 'reservationDays',
    width: 100
  },
  {
    title: '总价格',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    width: 80
  },
  {
    title: '支付时间',
    dataIndex: 'payTime',
    key: 'payTime',
    width: 160
  },
  {
    title: '退款金额',
    dataIndex: 'refundAmount',
    key: 'refundAmount',
    width: 100
  },
  {
    title: '退款理由',
    dataIndex: 'refundReason',
    key: 'refundReason',
    width: 200
  },
  {
    title: '订单状态',
    dataIndex: 'orderState',
    key: 'orderState',
    width: 120,
    fixed: 'right'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160,
    fixed: 'right'
  }
]
const tableData = ref([])
const tableLoading = ref(false)

const searchParam = ref({
  currentPage: 1,
  pageSize: 10,
  orderId: ''
})

const resetPage = () => {
  searchParam.value.currentPage = 1
  pagination.value.current = 1
  searchParam.value.pageSize = parseInt(pagination.value.pageSizeOptions[0])
}

const getOrderListByPage = async (page) => {
  tableLoading.value = true
  resetPage()
  if (page !== null && page !== undefined) {
    pagination.value.current = page.current
    searchParam.value.currentPage = page.current
    searchParam.value.pageSize = page.pageSize
  }
  const {
    data: { list, total }
  } = await getOrderList(searchParam.value)
  tableData.value = list
  pagination.value.total = total
  tableLoading.value = false
}
getOrderListByPage()

const stateColorMap = new Map()
stateColorMap.set('待支付', 'red')
stateColorMap.set('待取车', 'cyan')
stateColorMap.set('待还车', 'purple')
stateColorMap.set('交易成功', 'green')
stateColorMap.set('交易退款', 'red')
stateColorMap.set('交易取消', 'red')
stateColorMap.set('售后中', 'orange')

const onSearch = async () => {
  tableLoading.value = true
  if (searchParam.value.orderId === '') {
    await getOrderListByPage()
    return
  }
  await getOrderInfo(searchParam.value)
    .then((resp) => {
      if (resp.data) {
        tableData.value = new Array(resp.data)
        pagination.value.total = tableData.value.length
      } else {
        tableData.value = []
        pagination.value.total = 0
      }
    })
    .catch(() => {})
    .finally(() => {
      tableLoading.value = false
    })
}
</script>

<template>
  <div class="topAction">
    <a-input-search
      v-model:value="searchParam.orderId"
      placeholder="订单号"
      enter-button
      @search="onSearch"
      :allowClear="true"
      style="width: 250px"
    />
  </div>
  <a-table
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content', y: '70vh', scrollToFirstRowOnChange: true }"
    :pagination="pagination"
    :loading="tableLoading"
    @change="getOrderListByPage"
    size="large"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'goodsImg'">
        <a-image
          :width="120"
          :height="70"
          :src="record.goodsImg"
          fallback="data:image/png;base64,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"
        />
      </template>
      <template v-if="column.key === 'orderState'">
        <span>
          <a-tag :color="stateColorMap.get(record.orderState)" :bordered="false">
            {{ record.orderState }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'totalPrice'">
        {{ record.totalPrice ? `￥${record.totalPrice}` : '-' }}
      </template>
      <template v-if="column.key === 'refundAmount'">
        {{ record.refundAmount ? `￥${record.refundAmount}` : '-' }}
      </template>
    </template>
  </a-table>
</template>

<style scoped>
.topAction {
  display: flex;
  justify-content: space-between;
}
</style>
