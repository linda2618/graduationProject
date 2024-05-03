<template>
    <!-- 主页，侧边栏+头部导航 -->
    <el-container class="container">
        <el-aside width="160px" class="pre_aside">
            <el-scrollbar>
                <!-- :default-openeds="['1']" -->
                <el-menu>
                    <el-menu-item index="1" @click="goMenu"><el-icon>
                            <Menu />
                        </el-icon>首页</el-menu-item>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <Tickets />
                            </el-icon>农产品分类
                        </template>
                        <el-menu-item-group>
                            <el-menu-item v-for="(item, index) in categoryLists" :index="`2-${index + 1}`"
                                @click="goCateShow(item.id)">{{ item.title }}</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-sub-menu index="3">
                        <template #title>
                            <el-icon>
                                <PieChart />
                            </el-icon>销售可视
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="3-1">产品销售情况</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-menu-item index="4-1" v-if="isAdmin" @click="goCategory">
                        <el-icon>
                            <Goods />
                        </el-icon>
                        商品管理操作
                    </el-menu-item>
                    <el-menu-item index="5-1" v-if="isAdmin" @click="goProduct">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        商品分类操作
                    </el-menu-item>
                </el-menu>
            </el-scrollbar>
        </el-aside>
        <el-container>
            <!-- 头部固定 -->
            <el-header class="header">
                <div @click="goShop"><el-icon>
                        <ShoppingTrolley />
                    </el-icon>购物车</div>
                <!-- <div @click="goCollect"><el-icon>
                        <Star />
                    </el-icon>收藏夹</div> -->
                <div>
                    <el-icon>
                        <InfoFilled />
                    </el-icon>
                    <el-dropdown>
                        <span class="drewLink">
                            联系我们
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="goManService">人工客服</el-dropdown-item>
                                <el-dropdown-item @click="goFeedback">意见反馈</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div v-if="isShow" @click="goProfile" class="ml"><el-icon>
                        <User />
                    </el-icon>个人信息</div>
                <div v-else @click="goLogin" class="ml"><el-icon>
                        <User />
                    </el-icon>请先登录！</div>
                <div v-if="isShow" @click="logOut" class="log"><el-icon>
                        <SwitchButton />
                    </el-icon>退出</div>
            </el-header>
            <!-- 主体部分嵌入组件 -->
            <div class="main">
                <!-- currentTab 改变时组件也改变 -->
                <component :is="currentComponent" :id="cateId" :title="title"></component>
            </div>
        </el-container>
    </el-container>
</template>


<script setup>
import { ref, shallowRef, inject, reactive, computed, onMounted, watch } from 'vue'
import AllPreview from './AllPreview.vue'
import ShoppingCar from './ShoppingCar.vue'
import Collect from './Collect.vue'
import YouProfile from './YouProfile.vue'
// import YouProfile from './test.vue'
import Feedback from './Connection/Feedback.vue'
import ManService from './Connection/ManService.vue'
import CateShow from './CateShow.vue'
import Category from './OnlyAdmin/Category.vue'
import Product from './OnlyAdmin/Product.vue'
import myEventBus from "../../eventBus/index.js";

import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'

const axios = inject("axios")
const router = useRouter()
const currentComponent = shallowRef(AllPreview)
const categoryLists = ref([])

const isShow = computed(() => {
    return !!localStorage.getItem('id'); 
})

const isAdmin = computed(() => {
    return !!localStorage.getItem('option');
})

const hasHead = ref(true)

//管理员界面
const goCategory = () => {
    hasHead.value = false
    currentComponent.value = Category
}

const goProduct = () => {
    hasHead.value = false
    currentComponent.value = Product
}


// 点击头部，切换组件
const goShop = () => {
    if (!localStorage.getItem('id')) {
        ElMessage.warning("请先登录！");
        return;
    }
    currentComponent.value = ShoppingCar
}
const goCollect = () => {
    currentComponent.value = Collect    
}
const goProfile = () => {
    currentComponent.value = YouProfile
}

// 客服联系
const goManService = () => {
    currentComponent.value = ManService
}

const goFeedback = () => {
    currentComponent.value = Feedback
}


// 回到首页浏览
const goMenu = () => {
    currentComponent.value = AllPreview
}

const goLogin = () => {
    router.push('/login')
}

const logOut = () => {
    localStorage.removeItem('id'); // 清除登录状态
    localStorage.removeItem('option'); 
    router.go(0);
    ElMessage.info("已退出登录");
}

// 获取全部分类
const allCateList = async () => {
    let res = await axios.get(`/category/getList`);
    if (res.data.code == 200) {
        categoryLists.value = res.data.rows;
    } else {
        ElMessage.error("查询失败")
    }
}
// eventbus 事件总线
const emitter = myEventBus();
emitter.on("updateCateOption", () => {
    allCateList();
});

let cateId = ref(0)
let title = ref('')
const goCateShow = (id) => {
    let temp = categoryLists.value.filter(item => item.id == id)
    title.value = temp[0].title
    cateId.value = id;
    currentComponent.value = CateShow;
}

onMounted(() => {
    allCateList();
})
</script>

<style lang="scss" scoped>

.container {
    width: 100%;
}
 
.header {
    display: flex;
    background-color: #f8f8f8;
    width: 100%;
    height: 30px;
    font-size: 12px;
    padding-top: 8px;
    position: fixed;
    z-index: 100;

    div, .container {
        font-size: 12px;
        cursor: pointer;
        margin-right: 20px;
    }
    div:hover {
        color: hsla(160, 100%, 37%, 1);

    }
}

.main {
    margin-top: 30px;
}

.ml {
    margin-left: -22px;
}
.log {
    margin-left: 64%;
}

.pre_aside {
    min-height: 600px;
    border-right: #ccc 1px solid;
}
</style>