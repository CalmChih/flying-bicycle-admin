<script setup>
import { ref } from 'vue'
const isCollapse = ref(false)
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="1">
            <el-icon><Bicycle /></el-icon>
            <template #title>商品管理</template>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><Filter /></el-icon>
            <template #title>分类管理</template>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><Discount /></el-icon>
            <template #title>标签管理</template>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><Wallet /></el-icon>
            <template #title>订单管理</template>
          </el-menu-item>
          <el-menu-item index="5">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>统计分析</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="head"> ttttttttttt </el-header>
        <el-main class="body">Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
