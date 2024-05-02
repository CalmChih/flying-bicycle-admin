<script setup>
import { onMounted, ref } from 'vue'
import {
  FunnelPlotOutlined,
  TagOutlined,
  AccountBookOutlined,
  LineChartOutlined,
  UserOutlined,
  ShoppingOutlined,
  ShopOutlined
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

document.body.style.overflow = 'hidden'

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
  { key: 'AfterSalesView', title: '售后管理' },
  { key: 'AnalysisView', title: '统计分析' }
]
const selectedMenuTitle = ref('')

const adminLogout = async () => {
  await logout()
  userStore.logout()
  message.success('退出登录成功')
  await router.push('/login')
}
</script>

<template>
  <a-layout class="container">
    <a-layout-header class="fixed-nav-bar">
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

    <a-layout class="content-container">
      <a-layout-sider v-model:collapsed="collapsed" collapsible class="left-menu">
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
          <a-menu-item key="AfterSalesView" title="售后管理">
            <ShoppingOutlined />
            <span>售后管理</span>
          </a-menu-item>
          <a-menu-item key="AnalysisView" title="统计分析">
            <LineChartOutlined />
            <span>统计分析</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content style="margin: 16px 16px" class="right-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
}
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .fixed-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background-color: #fcfcfc;
    width: 100%; /* 设置宽度为100% */
  }
  .content-container {
    display: flex;
    flex-direction: row;
    height: calc(100% - /* 顶部导航栏的高度，假设为64px */ 64px);
    .left-menu {
      position: sticky;
      top: 64px; /* 与顶部导航栏底部对齐 */
      height: calc(100% - 64px); /* 减去顶部导航栏高度 */
      /* 其他样式，如宽度、背景色等 */
    }
    .right-content {
      flex-grow: 1;
      overflow-y: auto;
      padding-top: 64px; /* 为顶部导航栏留出空间 */
      /* 其他样式 */
    }
  }
}
</style>
