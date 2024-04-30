<script setup>
import { ref } from 'vue'
import { deleteTag, getTagList, insertTag, updateTag } from '@/api/tags.js'
import _ from 'lodash'
import { message } from 'ant-design-vue'

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
    title: '标签名称',
    dataIndex: 'tagName',
    key: 'tagName'
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
  tagName: ''
})
const tagItem = ref({
  tagId: null,
  tagName: ''
})

const resetPage = () => {
  searchParam.value.currentPage = 1
  pagination.value.current = 1
  searchParam.value.pageSize = parseInt(pagination.value.pageSizeOptions[0])
}

const getTagListByPage = async (page) => {
  tableLoading.value = true
  resetPage()
  if (page !== null && page !== undefined) {
    pagination.value.current = page.current
    searchParam.value.currentPage = page.current
    searchParam.value.pageSize = page.pageSize
  }
  const {
    data: { list, total }
  } = await getTagList(searchParam.value)
  tableData.value = list
  pagination.value.total = total
  tableLoading.value = false
}
getTagListByPage()

const deleteTagItem = async (tagId) => {
  await deleteTag(tagId)
  message.success('删除成功')
  await getTagListByPage()
}
const updateTagItem = async () => {
  await updateTag(tagItem.value)
  message.success('更新成功')
  editModalVisible.value = false
  tagItem.value = {}
  await getTagListByPage()
}
const insertTagItem = async () => {
  await insertTag(tagItem.value)
  message.success('新增成功')
  saveModalVisible.value = false
  tagItem.value = {}
  await getTagListByPage()
}

const onSearch = async () => {
  await getTagListByPage()
}

const editModalVisible = ref(false)
const saveModalVisible = ref(false)
const openEditModal = async (tags) => {
  editModalVisible.value = true
  tagItem.value = _.cloneDeep(tags)
}
const openSaveModal = async () => {
  saveModalVisible.value = true
}
</script>

<template>
  <div class="topAction">
    <a-button type="primary" @click="openSaveModal">新增</a-button>
    <a-input-search
      v-model:value="searchParam.tagName"
      placeholder="标签名称"
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
    @change="getTagListByPage"
    size="large"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a @click="openEditModal(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteTagItem(record.categoryId)"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="editModalVisible"
    title="编辑"
    centered
    @ok="updateTagItem"
    @cancel="tagItem = {}"
    cancelText="取消"
    okText="保存"
  >
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" :model="tagItem">
      <a-form-item label="标签名称">
        <a-input v-model:value="tagItem.tagName" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:open="saveModalVisible"
    title="新增"
    centered
    @ok="insertTagItem"
    @cancel="tagItem = {}"
    cancelText="取消"
    okText="确定"
  >
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" :model="tagItem">
      <a-form-item label="标签名称">
        <a-input v-model:value="tagItem.tagName" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
.topAction {
  display: flex;
  justify-content: space-between;
}
</style>
