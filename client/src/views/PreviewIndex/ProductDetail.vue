<template>
    <div class="main">
        <!-- 商品详情 -->
        <FixedHeader class="fixHead" @isShow="isShow"></FixedHeader>
        <div v-if='!showPre'>
            <div class="detail">
                <div class="content">
                    <div class="search">
                        <span>你喜欢?</span>
                        <el-button type="info" plain style="width: 45px; height: 25px;  margin-top: 35px;"
                            @click="goBack">返回</el-button>
                    </div>
                    <div>
                        <el-card v-loading="loading">
                            <div class="store">
                                <span>
                                    所属店铺： {{ productInfo?.shop }}
                                </span>
                                <span @click="goStore">
                                    <el-icon>
                                        <Goods />
                                    </el-icon>
                                    进入店铺
                                </span>
                            </div>
                            <el-divider />
                            <div class="info">
                                <div class="img">
                                    <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                                        style="width: 100%" />
                                </div>
                                <div class="content">
                                    <span class="title">{{ productInfo.tilte }}</span>
                                    <span class="jia">￥<span class="price">{{ productInfo.price }}</span></span>
                                    <span>{{ productInfo.content }}</span>
                                    <span>付款后48小时内发货</span>
                                    <span>生产时间：{{ formatDate(productInfo.create_time) }}</span>
                                    <span v-if="productInfo.update_time">最近上线时间：{{
                                        formatDate(productInfo.update_time) }}</span>
                                    <!-- 立即购买formatDate/加入购物车 -->
                                    <div class="car">
                                        <el-button @click="noOption" type="danger">立即购买</el-button>
                                        <el-button v-if="productInfo.is_car == 1" type="warning"
                                            @click="addToCar(0)">取消购物车</el-button>
                                        <el-button v-else type="warning" @click="addToCar(1)">加入购物车</el-button>
                                        <!-- <span class="collect"><el-icon>
                                                <Star />
                                            </el-icon><el-icon>
                                                <StarFilled />
                                            </el-icon>收藏</span> -->
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>

            </div>
            <FixedAside v-show="showAside"></FixedAside>
        </div>
        <div v-else>
            <!-- currentTab 改变时组件也改变 -->
            <component :is="currentComponent"></component>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, shallowRef, onBeforeUnmount} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from './until'

import FixedHeader from '../../components/fixedHeader.vue'
import FixedAside from '../../components/fixedAside.vue'
import YouProfile from '../PreviewIndex/YouProfile.vue'
import ManService from '../PreviewIndex/Connection/ManService.vue'

const axios = inject("axios")
const currentComponent = shallowRef()
const route = useRoute()
const router = useRouter()
const search = ref('')
const showAside = ref(true)
const showPre = ref(false)
let productInfo = ref({
    product_id: 0,
    category_id: 0,
    tilte: "",
    content: "",
    price: 0,
    is_car: 0,
    checked: 0,
    num: 1,
    shop: '',
    img_src: '',
})
const loading = ref(true)

const isShow = (val, type) => {
    showPre.value = val
    switch (type) {
        case 'YouProfile':
            currentComponent.value = YouProfile;
            break;
        case 'ManService':
            currentComponent.value = ManService;
            break;
        default:
            break;
    }
} 

const getProductInfo = async() => {
    //获取货品id
    const product_id = route.query.id

    let result = await axios.get('/product/detail', { params: { product_id } })

    if (result.data.code == 200) {
        productInfo.value = result.data.rows[0];
        setTimeout(() => {
            loading.value = false
        }, 1000)
    } else {
        ElMessage.error("node接口问题")
    }

}

const goStore = () => {
    console.log('进入店铺~！')
}

const goBack = () => {
    router.go(-1)
}

// 结算（暂未完善）
const noOption = () => {
    ElMessageBox.confirm('该功能有待开发', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '关闭',
        type: 'warning'
    }).then(() => {
        ElMessage.info('感谢支持');
    }).catch(() => {
        ElMessage.info('感谢支持');
    });
}

//监听窗口大小，控制侧边栏 显示/隐藏
const windowSize = ref({ width: window.innerWidth });

const handleResize = () => {
    windowSize.value = { width: window.innerWidth };
    if (windowSize.value.width <= 750) {
        showAside.value = false;
        return;
    }
    showAside.value = true;
};

//加入购物车
const addToCar = async (type) => {
    const id = route.query.id

    if (!localStorage.getItem('id')) {
        ElMessage.error("请先登录！")
        return;
    }

    if (type === 0) {
        try {
            await ElMessageBox.confirm('确认取消购物车', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '关闭',
                type: 'warning'
            });
            const result = await axios.put('/product/car', {
                product_id: id,
                is_car: type,
            });
            if (result.data.code === 200) {
                ElMessage.warning("取消购物车成功");
                getProductInfo();
            }
        } catch (error) {
            ElMessage.info('取消操作已关闭');
        }
    } else {
        let result = await axios.put('/product/car', {
            product_id: id,
            is_car: type,
        })
        console.log(result, 'result')
        if (result.data.code == 200) {
            ElMessage.warning("加入购物车成功");
            getProductInfo();
        }
    }
}

onMounted(() => {
    getProductInfo();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});

</script>

<style lang="scss" scoped>
.main {
    width: 100%;
}

.detail {
    width: 100%;
    height: 640px;
    background-color: rgb(241, 239, 237);
    padding-top: 50px;

    .content {
        width: 70%;
        margin: 10px auto;

        .search {
            width: 100%;
            height: 90px;
            margin-bottom: 20px;
            line-height: 90px;
            background-color: #fff;
            border-radius: 40px;
            display: flex;
            justify-content: space-around;

            span {
                font-weight: bold;
                color: #ccc;
                font-size: 16px;
            }
        }

        .store {
            display: flex;
            justify-content: space-between;
        }

        .info {
            display: flex;
            justify-content: start;

            .content {
                display: flex;
                flex-direction: column;
                margin-left: 20px;

                span {
                    font-size: 14px;
                    margin-bottom: 12px;
                }

               .title {
                font-size: 17px;
                font-weight: bold;
               }

               .jia {
                color: red;

                .price {
                    font-size: 25px;
                }

               }
               .car {
                    margin-top: 11px;

                    .collect {
                        margin-left: 20px;
                    }

                }
            }

        }
    }
}

</style>