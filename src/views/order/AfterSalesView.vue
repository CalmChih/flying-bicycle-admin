<script setup>
import { ref } from 'vue'
import { getAfterSalesByOrderId, getAfterSalesList } from '@/api/afterSales.js'

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
    title: '总价格',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    width: 80
  },
  {
    title: '申请退款金额',
    dataIndex: 'requestRefundAmount',
    key: 'requestRefundAmount',
    width: 100
  },
  {
    title: '退款理由',
    dataIndex: 'refundReason',
    key: 'refundReason',
    width: 200
  },
  {
    title: '实际退款金额',
    dataIndex: 'actualRefundAmount',
    key: 'actualRefundAmount',
    width: 120
  },
  {
    title: '卖家回复',
    dataIndex: 'sellerReply',
    key: 'sellerReply',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160
  },
  {
    title: '售后状态',
    dataIndex: 'state',
    key: 'state',
    width: 120,
    fixed: 'right'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    fixed: 'right',
    width: 140
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

const getAfterSalesListByPage = async (page) => {
  tableLoading.value = true
  resetPage()
  if (page !== null && page !== undefined) {
    pagination.value.current = page.current
    searchParam.value.currentPage = page.current
    searchParam.value.pageSize = page.pageSize
  }
  const {
    data: { list, total }
  } = await getAfterSalesList(searchParam.value)
  tableData.value = list
  pagination.value.total = total
  tableLoading.value = false
}
getAfterSalesListByPage()

const stateColorMap = new Map()
stateColorMap.set('售后完成', 'green')
stateColorMap.set('售后中', 'red')

const onSearch = async () => {
  tableLoading.value = true
  if (searchParam.value.orderId === '') {
    await getAfterSalesListByPage()
    return
  }
  await getAfterSalesByOrderId(searchParam.value)
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
/**
 * 驳回售后申请
 * @returns {Promise<void>}
 */
const refusal = async (orderId) => {
  console.log(orderId)
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
    @change="getAfterSalesListByPage"
    size="large"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'state'">
        <span>
          <a-tag :color="stateColorMap.get(record.state)" :bordered="false">
            {{ record.state }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'totalPrice'">
        {{ record.totalPrice ? `￥${record.totalPrice}` : '-' }}
      </template>
      <template v-if="column.key === 'requestRefundAmount'">
        {{ record.refundAmount ? `￥${record.requestRefundAmount}` : '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <span>
          <a @click="openEditModal(record)">处理售后</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定驳回吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="refusal(record.orderId)"
          >
            <a href="#">驳回</a>
          </a-popconfirm>
        </span>
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
