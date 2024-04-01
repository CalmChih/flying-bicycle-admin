<script setup>
import { onMounted, ref } from 'vue'
import {
  ShopOutlined,
  FunnelPlotOutlined,
  TagOutlined,
  AccountBookOutlined,
  LineChartOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { logout } from '@/api/login.js'
import { useUserStore } from '@/stores/index.js'
import { message } from 'ant-design-vue'

const collapsed = ref(false)
const selectedKeys = ref([])
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

onMounted(() => {
  selectedKeys.value = [route.name]
  selectedMenuTitle.value = pageHeader.find((item) => item.key === route.name).title
})

const toMenu = (menuInfo) => {
  selectedMenuTitle.value = menuInfo.item.title
  router.push({
    name: menuInfo.key
  })
}

const pageHeader = [
  { key: 'GoodsView', title: '商品管理' },
  { key: 'CategoryView', title: '分类管理' },
  { key: 'TagView', title: '标签管理' },
  { key: 'OrderView', title: '订单管理' },
  { key: 'AnalysisView', title: '统计分析' }
]
const selectedMenuTitle = ref('')

const adminLogout = async () => {
  await logout()
  userStore.removeTokenInfo()
  message.success('退出登录成功')
  await router.push('/login')
}
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="background: #fff; padding: 0; height: 50px; z-index: 100">
      <div class="header">
        <span class="title"> 自行车在线租赁管理系统 </span>
        <a-dropdown placement="bottom">
          <a-avatar size="large" style="margin-right: 20px; margin-top: 5px">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="adminLogout" style="text-align: center"> 退出登录 </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>

    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" collapsible class="sider">
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" @click="toMenu">
          <a-menu-item key="GoodsView" title="商品管理">
            <ShopOutlined />
            <span>商品管理</span>
          </a-menu-item>
          <a-menu-item key="CategoryView" title="分类管理">
            <FunnelPlotOutlined />
            <span>分类管理</span>
          </a-menu-item>
          <a-menu-item key="TagView" title="标签管理">
            <TagOutlined />
            <span>标签管理</span>
          </a-menu-item>
          <a-menu-item key="OrderView" title="订单管理">
            <AccountBookOutlined />
            <span>订单管理</span>
          </a-menu-item>
          <a-menu-item key="AnalysisView" title="统计分析">
            <LineChartOutlined />
            <span>统计分析</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content style="margin: 16px 16px" class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.layout-left {
  //display: flex;
  .sider {
    //position: fixed;
    //min-width: 80px;
    //max-width: 200px;
    //height: 100vh;
  }
}
.header {
  display: flex;
  flex-direction: row;
  //position: fixed;
  //left: 200px;
  width: 100%;
  justify-content: space-between;
  .title {
    margin-left: 20px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
}
.content {
  //position: relative;
  //left: 200px;
  //overflow-x: hidden;
}
</style>
