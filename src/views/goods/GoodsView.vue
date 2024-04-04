<script setup>
import { ref } from 'vue'
import { deleteGoods, getGoodsList, insertGoods, updateGoods } from '@/api/goods.js'
import { getCategoryList } from '@/api/category.js'
import _ from 'lodash'
import { message } from 'ant-design-vue'
import { getTagList } from '@/api/tags.js'

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
    title: '商品名称',
    width: 120,
    dataIndex: 'goodsTitle',
    key: 'goodsTitle',
    fixed: 'left'
  },
  {
    title: '商品描述',
    width: 400,
    dataIndex: 'goodsDesc',
    key: 'goodsDesc'
  },
  {
    title: '商品标签',
    dataIndex: 'goodsTags',
    key: 'goodsTags',
    width: 200
  },
  {
    title: '商品分类',
    dataIndex: 'categoryName',
    key: 'categoryName',
    width: 150
  },
  {
    title: '商品数量',
    dataIndex: 'goodsNum',
    key: 'goodsNum',
    width: 100
  },
  {
    title: '商品状态',
    dataIndex: 'stateStr',
    key: 'stateStr',
    width: 150
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right'
  }
]
const tableData = ref([])

const stateOption = [
  { label: '正常', value: 1 },
  { label: '下架', value: 2 }
]

const searchParam = ref({
  currentPage: 1,
  pageSize: 10,
  goodsTitle: ''
})

const tableLoading = ref(false)

const resetPage = () => {
  searchParam.value.currentPage = 1
  pagination.value.current = 1
  searchParam.value.pageSize = parseInt(pagination.value.pageSizeOptions[0])
}

const getGoodsListByPage = async (page) => {
  tableLoading.value = true
  resetPage()
  if (page !== null && page !== undefined) {
    pagination.value.current = page.current
    searchParam.value.currentPage = page.current
    searchParam.value.pageSize = page.pageSize
  }
  const {
    data: { list, total }
  } = await getGoodsList(searchParam.value)
  tableData.value = list
  tableData.value.forEach((goods) => {
    goods.goodsTagsArr = goods.goodsTags.split(',')
  })
  pagination.value.total = total
  tableLoading.value = false
}
getGoodsListByPage()

const openEditModal = async (goods) => {
  editModalVisible.value = true
  goodsItem.value = _.cloneDeep(goods)
  const {
    data: { list }
  } = await getCategoryList()
  categoryList.value = list
}

const deleteGoodsItem = async (goodsId) => {
  console.log(goodsId)
  const { msg } = await deleteGoods(goodsId)
  message.success(msg || '删除成功')
  await getGoodsListByPage()
}

const editModalVisible = ref(false)
const saveModalVisible = ref(false)
const goodsItem = ref({
  goodsTitle: '',
  goodsDesc: '',
  goodsNum: 1,
  categoryId: null,
  categoryName: '',
  goodsTags: '',
  goodsTagsArr: [],
  state: 1,
  stateStr: ''
})

const categoryList = ref([])
const tagOptions = ref([])
const colorList = ['blue', 'purple', 'cyan']

const getTags = async () => {
  const {
    data: { list }
  } = await getTagList()
  list?.forEach((tag) => {
    tagOptions.value.push({ label: tag.tagName, value: tag.tagName })
  })
}
getTags()

const updateGoodsInfo = async () => {
  editModalVisible.value = false
  await updateGoods(goodsItem.value)
  goodsItem.value = {}
  message.success('保存成功')
  await getGoodsListByPage()
}

const onSearch = async () => {
  await getGoodsListByPage()
}

const insertGoodsItem = async () => {
  saveModalVisible.value = false
  await insertGoods(goodsItem.value)
  message.success('新增商品成功')
  goodsItem.value = {}
  await getGoodsListByPage()
}
const openSaveModal = async () => {
  saveModalVisible.value = true
  const {
    data: { list }
  } = await getCategoryList()
  categoryList.value = list
}

const tagChanged = (tagsArr) => {
  goodsItem.value.goodsTags = tagsArr.join(',')
}
const categoryChanged = (categoryId) => {
  goodsItem.value.categoryName = categoryList.value.find(
    (category) => category.categoryId === categoryId
  ).categoryName
}
</script>

<template>
  <div class="topAction">
    <a-button type="primary" @click="openSaveModal">新增</a-button>
    <a-input-search
      v-model:value="searchParam.goodsTitle"
      placeholder="商品名称"
      enter-button
      @search="onSearch"
      :allowClear="true"
      style="width: 250px"
    />
  </div>
  <a-table
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content', y: '75vh', scrollToFirstRowOnChange: true }"
    :pagination="pagination"
    :loading="tableLoading"
    @change="getGoodsListByPage"
    size="large"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'goodsTags'">
        <span>
          <a-tag
            v-for="(tag, index) in record.goodsTagsArr"
            :key="tag"
            :color="colorList[index % colorList.length]"
            :bordered="false"
          >
            {{ tag }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a @click="openEditModal(record)">编辑</a>
          <a-divider type="vertical" />
          <!--          <a @click="deleteGoods(record.id)">删除</a>-->
          <a-popconfirm
            title="确定删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteGoodsItem(record.goodsId)"
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
    @ok="updateGoodsInfo"
    @cancel="goodsItem = {}"
    cancelText="取消"
    okText="保存"
  >
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" :model="goodsItem">
      <a-form-item label="商品名称">
        <a-input v-model:value="goodsItem.goodsTitle" />
      </a-form-item>
      <a-form-item label="商品描述">
        <a-textarea
          v-model:value="goodsItem.goodsDesc"
          :autoSize="true"
          show-count
          :maxlength="255"
        />
      </a-form-item>
      <a-form-item label="商品数量">
        <a-input-number v-model:value="goodsItem.goodsNum" :min="1" />
      </a-form-item>
      <a-form-item label="商品分类">
        <a-select
          v-model:value="goodsItem.categoryId"
          :value="goodsItem.categoryName"
          style="width: 120px"
          @change="categoryChanged"
        >
          <a-select-option
            v-for="category in categoryList"
            :key="category.categoryId"
            :value="category.categoryId"
          >
            {{ category.categoryName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品标签">
        <a-select
          v-model:value="goodsItem.goodsTagsArr"
          mode="tags"
          style="width: 100%"
          placeholder="填写标签值"
          :options="tagOptions"
          @change="tagChanged"
        ></a-select>
      </a-form-item>
      <a-form-item label="商品状态">
        <a-select
          v-model:value="goodsItem.state"
          :value="goodsItem.stateStr"
          style="width: 120px"
          :options="stateOption"
        >
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:open="saveModalVisible"
    title="新增"
    centered
    @ok="insertGoodsItem"
    @cancel="goodsItem = {}"
    cancelText="取消"
    okText="确定"
  >
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" :model="goodsItem">
      <a-form-item label="商品名称">
        <a-input v-model:value="goodsItem.goodsTitle" />
      </a-form-item>
      <a-form-item label="商品描述">
        <a-textarea
          v-model:value="goodsItem.goodsDesc"
          :autoSize="true"
          show-count
          :maxlength="255"
        />
      </a-form-item>
      <a-form-item label="商品数量">
        <a-input-number v-model:value="goodsItem.goodsNum" :min="0" />
      </a-form-item>
      <a-form-item label="商品分类">
        <a-select v-model:value="goodsItem.categoryId" style="width: 120px">
          <a-select-option
            v-for="category in categoryList"
            :key="category.categoryId"
            :value="category.categoryId"
          >
            {{ category.categoryName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品标签">
        <a-select
          v-model:value="goodsItem.goodsTagsArr"
          mode="tags"
          style="width: 100%"
          placeholder="填写标签值"
          :options="tagOptions"
          @change="tagChanged"
        ></a-select>
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
