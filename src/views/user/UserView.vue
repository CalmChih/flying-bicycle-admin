<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { getUserList, updateUserState } from '@/api/user.js'

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
    title: '账号',
    dataIndex: 'username',
    key: 'username',
    fixed: 'left',
    width: 120
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 120
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    width: 120
  },
  {
    title: '生日',
    dataIndex: 'birthday',
    key: 'birthday',
    width: 120
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 120
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
  username: ''
})

const resetPage = () => {
  searchParam.value.currentPage = 1
  pagination.value.current = 1
  searchParam.value.pageSize = parseInt(pagination.value.pageSizeOptions[0])
}

const getUserListByPage = async (page) => {
  tableLoading.value = true
  resetPage()
  if (page !== null && page !== undefined) {
    pagination.value.current = page.current
    searchParam.value.currentPage = page.current
    searchParam.value.pageSize = page.pageSize
  }
  const {
    data: { list, total }
  } = await getUserList(searchParam.value)
  tableData.value = list
  pagination.value.total = total
  tableLoading.value = false
}
getUserListByPage()

const forbidden = async (user) => {
  const userItem = {
    userId: user.id,
    state: 2
  }
  await updateUserState(userItem)
  message.success('封禁成功')
  await getUserListByPage()
}
const unblocking = async (user) => {
  const userItem = {
    userId: user.id,
    state: 1
  }
  await updateUserState(userItem)
  message.success('解封成功')
  await getUserListByPage()
}

const onSearch = async () => {
  await getUserListByPage()
}
</script>

<template>
  <div class="topAction">
    <a-input-search
      v-model:value="searchParam.username"
      placeholder="账号"
      enter-button
      @search="onSearch"
      style="width: 250px"
    />
  </div>
  <a-table
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content', y: '75vh', scrollToFirstRowOnChange: true }"
    :pagination="pagination"
    :loading="tableLoading"
    @change="getUserListByPage"
    size="large"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a-popconfirm
            v-if="record.state === '正常'"
            title="确定封禁吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="forbidden(record)"
          >
            <a href="#">封禁</a>
          </a-popconfirm>
          <a v-else-if="record.state === '封禁'" @click="unblocking(record)">解封</a>
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
