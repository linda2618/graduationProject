<template>
    <div class="fixed_aside">
        <!-- 固定在侧边的tab -->
        <div class="aside">
            <div @click="goNews" class="hand"><el-icon>
                    <ChatDotRound />
                </el-icon>消息</div>
            <div @click="goShop" class="hand"><el-icon>
                    <ShoppingTrolley />
                </el-icon>购物车
                <i class="car_num">{{ carNum }}</i>
            </div>
            <div @click="goFeek" class="hand"><el-icon>
                    <Edit />
                </el-icon>反馈</div>
            <div @click="goService" class="hand"><el-icon>
                    <User />
                </el-icon>客服</div>
            <div @click="goTop" class="hand">
                <el-icon>
                    <Top />
                </el-icon>回顶部
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, defineEmits, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'

const axios = inject("axios")
const router = useRouter()

const emit = defineEmits(['go-top']);
// 点击跳转页面
const goNews = () => {
    router.push({ name: 'news' });
}

const goShop = () => {
    if (!localStorage.getItem('id')) {
        ElMessage.warning("请先登录");
        return;
    }
    router.push({ name: 'shopCar' });
}

const goFeek = () => {
    router.push({ name: 'feedback' });
}

const goService = () => {
    router.push({ name: 'manService' });
}

const goTop = () => {
    emit('go-top');
}

const carNum = ref(0)

//获取购物车商品数量
const getCarInfo = async () => {
    let result = await axios.get('/product/info')

    if (result.data.code == 200) {
        let shopInfo = result.data.rows.filter(item => item.is_car == 1)
        carNum.value = shopInfo.length

    } else {
        ElMessage.error("报错！")
    }
}

onMounted(() => {
    getCarInfo();
})

</script>

<style lang="scss" scoped>

.fixed_aside {
    width: 70px;
    position: fixed;
    top:100px;
    right: 10px;
    background-color: #fff;
    border-radius: 20px;

    .aside {
        display: flex;
        flex-direction: column;


        div {
            display: flex;
            flex-direction: column;
            margin: 16px 12px;
            text-align: center;
            font-size: 12px;
            .el-icon {
                margin-left: 8px;
                font-size: 28px;;
            }
        }
    }
}

.hand {
    cursor: pointer;
}

.car_num {
    position: relative;
        top: -50px;
        left: 35px;
        width: 20px;
        height: 14px;
        background-color: rgb(234, 108, 41);
        border-radius: 8px;
        color: #fff;
        font-size: 10px;
        padding-top: 2px;
        padding-right: 2px;
}
</style>