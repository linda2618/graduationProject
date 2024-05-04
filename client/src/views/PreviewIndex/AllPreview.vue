<template>
    <!-- 主页，默认页面 -->
    <div class="preview">
        <!-- 搜索部分 -->
        <div class="search">
            <el-input v-model="keyword" style="width: 440px" placeholder="输入宝贝" clearable class="search_input" />
            <el-select placeholder="查询分类" v-model="category_id" style="width: 140px" class="search_input">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button type="success" class="search_button" @click="searchPro">搜索</el-button>
            <el-button type="info" class="search_button" @click="back">返回</el-button>
            <el-button type="info" class="search_button" @click="getProductInfo">回到全部</el-button>
        </div>

        <!-- 图片轮播 -->
        <div class="image">
            <span class="title">特价大甩卖</span>
            <div class="carousel">
                <el-carousel :interval="4000" indicator-position="none" type="card" height="200px"
                    @change="changeCount">
                    <el-carousel-item v-for="item in urls" :key="item" height="400px">
                        <h3 justify="end">
                            <el-image :src="item.img" alt="" srcset="" class="carousel-image" style="height: 300px;"
                                justify="end" />
                        </h3>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="carousel_text">
                <div v-for="(item,index) in currentItem" :key="index" class="text_price">
                    <div>{{item.name}}</div>
                    <div>{{item.data}}</div>
                </div>
            </div>
        </div>

        <!-- 猜你喜欢 -->
        <div class="guess_title">
            <h3>猜你喜欢</h3>
            <el-image :src="xi" class="guess_img" />
        </div>
        <div v-loading="loading" class="guess_main" v-if="detailInfos.length > 0">
            <div class="guess_card" v-for="item in detailInfos">
                <PreviewCard :detailInfo="item" @click="goDetail(item.product_id)">
                </PreviewCard>
            </div>
        </div>
        <div v-else class="guess_no">
            查询不到商品哦~~
        </div>

        <!-- 侧边固定tab -->
        <FixedAside v-show="showAside" @goTop="goTop"></FixedAside>

    </div>
</template>

<script setup>
import { ref, reactive, inject, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'

import p1 from  '../../assets/images/1.png'
import p2 from  '../../assets/images/2.png'
import p3 from  '../../assets/images/3.png'
import p4 from  '../../assets/images/4.png'
import p5 from  '../../assets/images/5.png'
import p6 from '../../assets/images/6.png'
import xi from '../../assets/images/xi.png'
import PreviewCard from '../../components/previewCard.vue'
import FixedAside from '../../components/fixedAside.vue'

const axios = inject("axios")
const router = useRouter()
const keyword = ref('')
const category_id = ref()
const showAside = ref(false)
const loading = ref(true)

// 引入本地图片
const urls = reactive([
    {img: p1},
    {img: p2},
    {img: p3},
    {img: p4},
    {img: p5},
    {img: p6},
])
let currentIndex = ref(0)
//特价列表
const countList = reactive([
    { name: '皮皮虾有活动啦'  , data: '39.9元' },
    { name: '今日鸭梨特价', data: '9.9元' },
    { name: '售出火龙果', data: '19.9元' },
    { name: '白菜甩卖'  , data: '5.9元' },
    { name: '今日胡萝卜特价'  , data: '8.9元' },
    { name: '新鲜曹鱼'  , data: '29.9元' },
])

let currentItem = computed(() => {
    const startIndex = currentIndex.value;
    const endIndex = startIndex + 3 
    let sliceList = []
    if (endIndex >= 6) {
        const end = endIndex % 6
        return sliceList = [...countList.slice(startIndex), ...countList.slice(0, end)]
    }

    return countList.slice(startIndex, endIndex)
})

//图片切换时
const changeCount = (e) => {
    //改变当前索引
   currentIndex.value = e % 6
}

const categoryOptions = ref([])

//查询所有分类
const loadDatas = async () => {
    try {
        let result = await axios.get('/category/getList')
        categoryOptions.value = result.data.rows.map((item) => {
            return {
                label: item.title,
                value: item.id
            }
        })
    } catch (error) {
        ElMessage.error(error.msg)
    }
}

//商品详情
let detailInfos = reactive([
    {
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
    }
])

//获取全部商品
const getProductInfo = async () => {
    loading.value = true
    let result = await axios.get('/product/info')

    if (result.data.code == 200) {
        detailInfos = result.data.rows;
        setTimeout(() => {
            loading.value = false
        }, 1000)
    } else {
        ElMessage.error("node接口问题")
    }
}

// 进入详情页
const goDetail = (id) => {
      router.push({
        path: '/productDetail',
        query: {id},
    })
}

//监听窗口大小，控制侧边栏 显示/隐藏
let scrollTop = ref({ top:  document.documentElement.scrollTop });

const handleScroll = () => {
  // 获取滚动条的位置或滚动的距离
    scrollTop.value.top = document.documentElement.scrollTop;
    // console.log(scrollTop.value.top, 'top!!')
    if (scrollTop.value.top >= 520) {
        showAside.value = true;
        return;
    }
    showAside.value = false;
};

const back = () => {
    if (!localStorage.getItem('remember')) {
        localStorage.clear();
    }
    router.go(-1);
}
// 回到顶部
const goTop = () => {
    window.scrollTo({
        top: 10,
        behavior: 'smooth'
    });
}

// 搜索
const searchPro = async () => {
    loading.value = true
    let key = keyword.value
    let id = category_id.value
    // let res = await axios.get(`/product/search?category_id=${1}`)
    let res = await axios.get(`/product/search?keyword=${key}&category_id=${id}`)
    console.log(res.data.data.rows)
    if (res.data.code == 200) {
        detailInfos = res.data.data.rows;
        setTimeout(() => {
            loading.value = false
        }, 1000)
        keyword.value = ''
        category_id.value = 0
    } else {
        ElMessage.error("查询失败！")
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    getProductInfo();
    loadDatas()
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>

.preview {
    padding-right: 20px;

    .search {
        width: 100%;
        height: 100px;

        .search_input, 
        .search_button {
            margin-left: 20px;
            margin-top: 35px;

        }
    }
}

.image {
    width: 1200px;  
    margin-top: 40px;

    .title {
        font-size: 20px;;
    }

    .carousel-image {
        width: 580px;
    }
    
    .carousel_text {
        display: flex;
        justify-content: space-around;
    }
}

.guess_title {
    margin-top: 50px;
    display: flex;

    .guess_img {
        margin-left: 20px;
        padding-top: 20px;
        width: 78px;
        height: 24px;
    }
}

.guess_main {
    display: flex;
    flex-wrap: wrap;
    background-color:rgba(241, 239, 237);
    min-height: 200px;

    .guess_card {
        margin-right: 20px;
        margin-bottom: 20px;
    }
}

.guess_no {
    min-height: 180px;
    font-size: 16px;
    background-color: rgb(213, 212, 212);
    padding-top: 20px;
}

</style>