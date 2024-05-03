<template>
    <div>
        <!-- 猜你喜欢 -->
        <div class="guess_title">
            <h3>猜你喜欢</h3>
            <br>
            <h4 class="red">{{ title }}系列</h4>
        </div>
        <div v-if="dataLists.length > 0" v-loading="loading" class="guess_main">
            <div class="guess_card" v-for="item in dataLists">
                <PreviewCard :detailInfo="item" @click="goDetail(item.product_id)">
                </PreviewCard>
            </div>
        </div>
        <div v-else class="noContent">还没有该分类下的商品哦~</div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PreviewCard from '../../components/previewCard.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
    id: {
        type: Number,
        default: 0,
    },
    title: {
        type: String,
        default: '',
    },
})

// watch写法错误！！！
// let idRef = ref(props.id) 
// watch(idRef, (newValue, oldValue) => {
//     idRef.value = newValue;
//     console.log(newValue, 'id--newValue')
//     goCate();
// });

const router = useRouter()
const axios = inject("axios")
const loading = ref(true)
const dataLists = ref([])

// watch正确写法！！！
watch(() => props.id, (newValue, oldValue) => {
    loading.value = true
    goCate();
});

const goCate = async () => {
    console.log(props.title, 'title')
    let res = await axios.get(`/product/search?category_id=${props.id}`)
    if (res.data.code == 200) {
        dataLists.value = res.data.data.rows;
        setTimeout(() => {
            loading.value= false
        }, 500)
    } else {
        ElMessage.error("查询失败！")
    }
}

// 进入详情页
const goDetail = (id) => {
    router.push({
        path: '/productDetail',
        query: { id },
    })
}
onMounted(() => {
    goCate();
})


</script>

<style lang="scss" scoped>
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
    background-color: rgba(241, 239, 237);
    min-height: 500px;


    .guess_card {
        margin-right: 20px;
        margin-bottom: 20px;
    }

}

.noContent {
    margin: 100px 0;
    font-size: 20px;
    color: #717171;
}

.red {
    color: rgb(236, 75, 75);
}
</style>