<script setup>
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { adminLogin } from '@/api/login.js'
import { useUserStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
const [messageApi] = message.useMessage()

const formState = ref({
  username: '',
  password: ''
})
const rules = {
  username: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: '邮箱格式错误，请填写正确的邮箱',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S*(?=\S{8,15})(?=\S*\d)(?=\S*[a-zA-Z])\S*$/,
      message: '密码长度需在8~15位之间，且必须包含字母和数字',
      trigger: 'blur'
    }
  ]
}
const userStore = useUserStore()
const router = useRouter()
const login = async (values) => {
  const { data } = await adminLogin(values)
  userStore.setTokenInfo(data)
  messageApi.success('登录成功')
  await router.push('/')
}
</script>

<template>
  <a-row justify="space-around" align="middle" class="login-form">
    <a-col :span="6">
      <a-form :model="formState" name="normal_login" @finish="login" :rules="rules">
        <a-form-item>
          <h1 style="text-align: center">登录</h1>
        </a-form-item>
        <a-form-item label="账号" name="username">
          <a-input v-model:value="formState.username">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="formState.password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 3 }">
          <a-button type="primary" html-type="submit" class="login-form-button"> 登录 </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<style scoped>
.login-form {
  height: 100%;
}
.login-form-button {
  width: 100%;
}
</style>
