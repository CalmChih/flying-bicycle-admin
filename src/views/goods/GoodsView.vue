<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  deleteGoods,
  getGoodsList,
  insertGoods,
  updateGoods,
  updateGoodsNum,
  uploadImg
} from '@/api/goods.js'
import { getCategoryList } from '@/api/category.js'
import _ from 'lodash'
import { message } from 'ant-design-vue'
import { getTagList } from '@/api/tags.js'
import { UploadOutlined } from '@ant-design/icons-vue'

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
    title: '商品图片',
    width: 120,
    dataIndex: 'goodsImg',
    key: 'goodsImg'
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
    title: '商品金额',
    dataIndex: 'goodsPrice',
    key: 'goodsPrice',
    width: 100
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
    width: 180,
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

const deleteGoodsItem = async (goodsId) => {
  console.log(goodsId)
  const { msg } = await deleteGoods(goodsId)
  message.success(msg || '删除成功')
  await getGoodsListByPage()
}

const editModalVisible = ref(false)
const saveModalVisible = ref(false)
const goodsItem = ref({
  goodsImg: '',
  goodsTitle: '',
  goodsDesc: '',
  goodsPrice: undefined,
  goodsNum: undefined,
  categoryId: undefined,
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
const validateGoodsNum = async (_rule, value) => {
  if (value === null) {
    return Promise.reject('请输入商品数量')
  } else if (value < 1) {
    return Promise.reject('商品数量至少为1')
  } else {
    return Promise.resolve()
  }
}
const validateGoodsTagsArr = async (_rule, value) => {
  console.log(value)
  if (value.length < 1) {
    return Promise.reject('请选择或填写商品标签')
  }
  return Promise.resolve()
}
const validateGoodsPrice = async (_rule, value) => {
  if (value === null) {
    return Promise.reject('请输入商品金额')
  } else if (value <= 0) {
    return Promise.reject('商品金额必须大于0')
  } else {
    return Promise.resolve()
  }
}
const rules = {
  goodsTitle: [{ required: true, message: '请输入商品标题', trigger: 'blur' }],
  goodsDesc: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
  goodsPrice: [{ validator: validateGoodsPrice, trigger: 'blur' }],
  goodsNum: [{ validator: validateGoodsNum, trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
  goodsTagsArr: [{ validator: validateGoodsTagsArr, trigger: 'blur' }]
}

const editFormRef = ref()
const saveFormRef = ref()

const updateGoodsInfo = async () => {
  editFormRef.value.validate().then(async () => {
    editModalVisible.value = false
    await updateGoods(goodsItem.value)
    goodsItem.value = {}
    message.success('保存成功')
    await getGoodsListByPage()
  })
}

const onSearch = async () => {
  await getGoodsListByPage()
}

const insertGoodsItem = async () => {
  saveFormRef.value.validate().then(async () => {
    saveModalVisible.value = false
    await insertGoods(goodsItem.value)
    message.success('新增商品成功')
    goodsItem.value = {}
    await getGoodsListByPage()
  })
}
const openSaveModal = async () => {
  saveModalVisible.value = true
  const {
    data: { list }
  } = await getCategoryList()
  categoryList.value = list
}
const saveModalCancel = () => {
  saveModalVisible.value = false
  saveFormRef.value.resetFields()
  goodsItem.value = {}
}
const openEditModal = async (goods) => {
  editModalVisible.value = true
  goodsItem.value = _.cloneDeep(goods)
  fileList.value = [
    {
      uid: '1',
      status: 'done',
      url: goodsItem.value.goodsImg
    }
  ]
  const {
    data: { list }
  } = await getCategoryList()
  categoryList.value = list
}
const editModalCancel = () => {
  editModalVisible.value = false
  editFormRef.value.resetFields()
  goodsItem.value = {}
}

const editGoodsNumModalVisible = ref(false)
const openEditGoodsNumModal = (goods) => {
  editGoodsNumModalVisible.value = true
  goodsItem.value.goodsId = goods.goodsId
  goodsItem.value.goodsNum = goods.goodsNum
}
const onUpdateGoodsNum = async () => {
  await updateGoodsNum(goodsItem.value)
  message.success('商品库存更新成功')
  editGoodsNumModalVisible.value = false
  goodsItem.value = {}
  await getGoodsListByPage()
}
const editGoodsNumModalCancel = () => {
  editGoodsNumModalVisible.value = false
  goodsItem.value = {}
}

const tagChanged = (tagsArr) => {
  goodsItem.value.goodsTags = tagsArr.join(',')
}
const categoryChanged = (categoryId) => {
  goodsItem.value.categoryName = categoryList.value.find(
    (category) => category.categoryId === categoryId
  ).categoryName
}
const fileList = ref([])
const uploadGoodsImg = async ({ file }) => {
  const resp = await uploadImg(file)
  fileList.value = [
    {
      uid: '1',
      name: file.name,
      status: 'done',
      response: resp,
      url: resp.data
    }
  ]
  goodsItem.value.goodsImg = resp.data
}
onMounted(() => {
  watch(
    () => (fileList.value.length > 0 ? fileList.value[0].url : ''),
    (newUrl) => {
      // 当 fileList[0].url 变化时，更新 goodsImg
      goodsItem.value.goodsImg = newUrl
    }
  )
})
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
    :scroll="{ x: 'max-content', y: '70vh', scrollToFirstRowOnChange: true }"
    :pagination="pagination"
    :loading="tableLoading"
    @change="getGoodsListByPage"
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
      <template v-if="column.key === 'goodsPrice'">
        {{ record.goodsPrice ? `￥${record.goodsPrice}` : '-' }}
      </template>
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
          <a @click="openEditGoodsNumModal(record)">修改库存</a>
          <a-divider type="vertical" />
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
    @cancel="editModalCancel"
    cancelText="取消"
    okText="保存"
  >
    <a-form
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      :model="goodsItem"
      ref="editFormRef"
      :rules="rules"
      :hideRequiredMark="true"
    >
      <a-form-item label="商品图片" name="goodsImg">
        <a-upload
          v-model:file-list="fileList"
          list-type="picture"
          :max-count="1"
          accept=".jpg, .png, .jpeg"
          :custom-request="uploadGoodsImg"
        >
          <a-button>
            <uploadOutlined />
            上传商品图片
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="商品名称" name="goodsTitle">
        <a-input v-model:value="goodsItem.goodsTitle" />
      </a-form-item>
      <a-form-item label="商品描述" name="goodsDesc">
        <a-textarea
          v-model:value="goodsItem.goodsDesc"
          :autoSize="true"
          show-count
          :maxlength="255"
        />
      </a-form-item>
      <a-form-item label="商品金额" name="goodsPrice">
        <a-input-number
          v-model:value="goodsItem.goodsPrice"
          addon-before="￥"
          addon-after="元/小时"
          :controls="false"
        />
      </a-form-item>
      <a-form-item label="商品分类" name="categoryId">
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
      <a-form-item label="商品标签" name="goodsTagsArr">
        <a-select
          v-model:value="goodsItem.goodsTagsArr"
          mode="tags"
          style="width: 100%"
          placeholder="填写标签值"
          :options="tagOptions"
          @change="tagChanged"
        ></a-select>
      </a-form-item>
      <a-form-item label="商品状态" name="state">
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
    @cancel="saveModalCancel"
    cancelText="取消"
    okText="确定"
  >
    <a-form
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      :model="goodsItem"
      ref="saveFormRef"
      :rules="rules"
      :hideRequiredMark="true"
    >
      <a-form-item label="商品图片" name="goodsImg">
        <a-upload
          v-model:file-list="fileList"
          list-type="picture"
          :max-count="1"
          accept=".jpg, .png, .jpeg"
          :custom-request="uploadGoodsImg"
        >
          <a-button>
            <uploadOutlined />
            上传商品图片
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="商品名称" name="goodsTitle">
        <a-input v-model:value="goodsItem.goodsTitle" />
      </a-form-item>
      <a-form-item label="商品描述" name="goodsDesc">
        <a-textarea
          v-model:value="goodsItem.goodsDesc"
          :autoSize="true"
          show-count
          :maxlength="255"
        />
      </a-form-item>
      <a-form-item label="商品金额" name="goodsPrice">
        <a-input-number
          v-model:value="goodsItem.goodsPrice"
          addon-before="￥"
          addon-after="元/小时"
          :controls="false"
        />
      </a-form-item>
      <a-form-item label="商品数量" name="goodsNum">
        <a-input-number v-model:value="goodsItem.goodsNum" :controls="false" />
      </a-form-item>
      <a-form-item label="商品分类" name="categoryId">
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
      <a-form-item label="商品标签" name="goodsTagsArr">
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
  <a-modal
    v-model:open="editGoodsNumModalVisible"
    title="修改库存"
    centered
    @ok="onUpdateGoodsNum"
    @cancel="editGoodsNumModalCancel"
    cancelText="取消"
    okText="确定"
  >
    <a-form
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      :model="goodsItem"
      ref="editGoodsNumFormRef"
      :rules="rules"
      :hideRequiredMark="true"
    >
      <a-form-item label="商品数量" name="goodsNum">
        <a-input-number v-model:value="goodsItem.goodsNum" :controls="false" />
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
