<template>
  <div class="login">
    <div class="quit no-drag" @click="onQuit">
      <n-icon size="26">
        <CloseOutline />
      </n-icon>
    </div>
    <div class="form">
      <n-tabs type="line" animated>
        <n-tab-pane name="login" tab="登录">
          <n-form :model="loginForm" :rules="rules" :show-label="false" ref="loginFormRef">
            <n-form-item path="email">
              <n-input placeholder="请输入邮箱" v-model:value="loginForm.email" />
            </n-form-item>
            <n-form-item path="password">
              <n-input placeholder="请输入密码" v-model:value="loginForm.password" />
            </n-form-item>
            <n-form-item>
              <n-button style="width: 100%" type="primary" @click="onSubLogin">登录</n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="signIn" tab="注册">
          <n-form :model="signInModel" :rules="signInRules" :show-label="false" ref="signInFormRef">
            <n-form-item path="userName">
              <n-input placeholder="请输入昵称" v-model:value="signInModel.userName" />
            </n-form-item>
            <n-form-item path="email">
              <n-input placeholder="请输入邮箱" v-model:value="signInModel.email" />
            </n-form-item>
            <n-form-item path="password">
              <n-input placeholder="请输入密码" v-model:value="signInModel.password" />
            </n-form-item>
            <n-form-item path="code">
              <n-space>
                <n-input placeholder="请输入验证码" v-model:value="signInModel.code" />
                <n-button
                  :disabled="isDisabled"
                  strong
                  secondary
                  @click="onSendEmail"
                  type="primary"
                  >{{ codeText }}</n-button
                >
              </n-space>
            </n-form-item>
            <n-form-item>
              <n-button style="width: 100%" type="primary" @click="onSubSignIn">注册</n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { signInUser, userEmail, userLogin, userSignIn } from '../api/user'
import { HttpCode } from '../utils/httpCode'
import { CloseOutline } from '@vicons/ionicons5'
import { FormValidationError, useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@renderer/store/user'
window.api.CenterWindow({ winViewId: window.winViewId })
window.api.WindowMinSize({ winViewId: window.winViewId, width: 330, height: 450 })
window.api.changWindowSize({ winViewId: window.winViewId, width: 330, height: 450 })
window.api.WindowSizeAlter({ winViewId: window.winViewId, status: false })

const loginForm = ref({ email: '', password: '' })
const signInModel = ref<signInUser>({ email: '', code: '', password: '', role: 1, userName: '' })

const rules = {
  email: {
    required: true,
    trigger: ['blur'],
    message: '请输入邮箱'
  },
  password: {
    required: true,
    trigger: ['blur'],
    message: '请输入密码'
  }
}
const signInRules = {
  userName: {
    key: 'userName',
    required: true,
    trigger: ['blur'],
    message: '请输入昵称'
  },
  email: {
    key: 'email',
    required: true,
    trigger: ['blur'],
    message: '请输入邮箱'
  },
  password: {
    key: 'password',
    required: true,
    trigger: ['blur'],
    message: '请输入密码'
  },
  code: {
    key: 'code',
    required: true,
    trigger: ['blur'],
    message: '请输入邮箱验证码'
  }
}
const router = useRouter()
const loginFormRef = ref()
const signInFormRef = ref()
const onSubLogin = () => {
  loginFormRef.value.validate((errors?: Array<FormValidationError>) => {
    if (!errors) {
      loginResult()
    } else {
      console.log(errors)
    }
  })
}
const onSubSignIn = () => {
  signInFormRef.value.validate((errors?: Array<FormValidationError>) => {
    if (!errors) {
      signInResult()
    } else {
      console.log(errors)
    }
  })
}
const message = useMessage()
const user = useUserStore()
const loginResult = async () => {
  try {
    const result = await userLogin(loginForm.value)
    console.log(result)
    if (result.code === HttpCode.success) {
      user.addToken(result.data.token)
      router.replace('/')
    } else {
      message.error('账号或密码错误!')
    }
  } catch (error) {
    console.log(error)
  }
}

const isDisabled = ref(false)
const codeText = ref('发送验证码')

const onSendEmail = () => {
  signInFormRef.value.validate(
    async (errors) => {
      if (!errors) {
        const result = await userEmail(signInModel.value.email)
        if (result.code === HttpCode.success) {
          codeTime()
        } else {
          message.error(result.error || '异常')
        }
      }
    },
    (rule) => {
      return rule?.key === 'email'
    }
  )
}
const codeTime = () => {
  let count = 60
  let clock = setInterval(() => {
    count--
    if (count < 1) {
      codeText.value = `发送验证码`
      isDisabled.value = false
    } else {
      codeText.value = `${count} S`
      isDisabled.value = true
    }
  }, 1000)
  setTimeout(() => {
    clearInterval(clock)
    count = 60
  }, 60 * 1000)
}

const signInResult = async () => {
  try {
    const result = await userSignIn(signInModel.value)
    console.log(result)
    if (result.code === HttpCode.success) {
      message.success('注册成功')
    } else {
      message.error(result.error || '异常')
    }
  } catch (error) {
    console.log(error)
  }
}
const onQuit = () => {
  console.log('onQuit')
  window.api.WindowAppQuit({ winViewId: window.winViewId })
}
</script>
<style lang="less" scoped>
.login {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .quit {
    position: absolute;
    top: 0;
    right: 0;
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  .form {
    padding: 15px;
    width: calc(100vw - 30px);
    height: calc(100% - 30px);
  }
}
</style>
