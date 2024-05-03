<template>
    <div id="login_container">
        <div class="login_panel">
            <el-card title="登录/注册">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="登录" name="first">
                        <el-form :model="admin" :rules="rules">
                            <el-form-item prop="account" label="账号">
                                <el-input v-model="admin.account" placeholder="请输入账号" />
                            </el-form-item>
                            <el-form-item prop="password" label="密码">
                                <el-input v-model="admin.password" type="password" placeholder="请输入密码" />
                            </el-form-item>
                        </el-form>

                    </el-tab-pane>
                    <el-tab-pane label="注册" name="second">
                        <el-form :model="regInfo" :rules="regRules">
                            <el-form-item prop="account" label="账号">
                                <el-input v-model="regInfo.account" placeholder="请输入账号" />
                            </el-form-item>
                            <el-form-item prop="password" label="输入密码">
                                <el-input v-model="regInfo.password" type="password" placeholder="请输入密码" />
                            </el-form-item>
                            <el-form-item prop="rePassword" label="确认密码">
                                <el-input v-model="regInfo.rePassword" type="password" placeholder="请再次输入密码" />
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
                <template #footer>
                    <el-checkbox v-if="activeName==='first'" class=" remember" v-model="admin.remember"
                        label="记住我" @click="" />
                    <el-button v-if="activeName === 'first'" @click="login">登录</el-button>
                    <el-button v-if="activeName === 'second'" @click="sign"> 注册</el-button>
                    <el-button @click="reset">重置</el-button>
                    <el-button @click="goBack">返回</el-button>
                </template>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { AdminStore } from '../stores/AdminStore.js'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'

const axios = inject("axios")
const adminStore = AdminStore()
const router = useRouter()
const activeName = ref('first')

const rules = {
    account: [
        { required: true, message: "请输入账号", trigger: 'blur' },
        { min: 5, max: 12, message: "账号长度5~12个字符", trigger: 'blur' }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: 'blur' },
        { min: 5, max: 12, message: "账号长度5~12个字符", trigger: 'blur' }
    ]
}

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== regInfo.password) {
    callback(new Error("两次密码输入不同！"))
  } else {
    callback()
  }
}

const regRules = {
    account: [
        { required: true, message: "请输入账号", trigger: 'blur' },
        { min: 5, max: 12, message: "账号长度5~12个字符", trigger: 'blur' }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: 'blur' },
        { min: 5, max: 12, message: "账号长度5~12个字符", trigger: 'blur' }
    ],
    rePassword: [
        { required: true, message: "请再次输入密码", trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }
    ]
}
const admin = reactive({
    account: localStorage.getItem("account") || "",
    password: localStorage.getItem("password") || "",
    remember: localStorage.getItem("remember") == 1 || false,
})

const regInfo = reactive({
    account: "",
    password: "",
    rePassword: "",
})

//登录按钮
const login = async () => {
    let result = {}
    if (admin.account === 'admin') {
        result = await axios.post('/admin/login', {
            account: admin.account,
            password: admin.password,
        })
        if (result.data.code == 200) localStorage.setItem("option", true)
        ElMessage.success("管理员登录成功")
    }
    else {
        result = await axios.post('/user/login', {
            account: admin.account,
            password: admin.password,
        })
    }
    if (result.data.code == 200) {
        adminStore.token = result.data.data.token
        adminStore.account = result.data.data.account
        adminStore.id = result.data.data.user_id
        if (admin.remember) {
            localStorage.setItem("account", admin.account)
            localStorage.setItem("password", admin.password)
            localStorage.setItem("remember", admin.remember? 1 : 0)
        } else {
            localStorage.clear();
        }
        localStorage.setItem("id", result.data.data.user_id || result.data.data.id )
        if (!localStorage.getItem("option")) ElMessage.success("登录成功")
        // 跳转 页面
        router.push('/preview')
    } else {
        ElMessage.error("登录失败")
    }
}

// 注册按钮
const sign = async () => {
    let result = await axios.post('/user/register', {
        account: regInfo.account,
        password: regInfo.password,
    })
    if (result.data.code == 200) {
        ElMessage.success("注册成功")
        admin.account = regInfo.account
        activeName.value = "first"     

    } else {
        ElMessage.error("登录失败")
    }  
}

const reset = () => {
    if (activeName.value === 'first') {
        admin.account = ''
        admin.password = ''
    } else {
        regInfo.account = ''
        regInfo.password = ''
        regInfo.rePassword = ''
    }
    localStorage.clear();
}

const goBack = () => {
    router.push('/')
}

const handleClick = () => {
    console.log(activeName.value, '当前页面')
}
</script>

<style lang="scss" scoped>
#login_container {
    height: 100%;
}

.login_panel {
    width: 500px;
    margin: 250px auto;
    opacity: .8;
}

.n-button {
    margin-right: 30px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.remerber {
    margin-right: 20px;
}
</style>