<template>
    <div class="car_part">
        <div class="store">{{ detailInfo.store }}</div>
        <div class="divider"></div>
        <div class="main">
            <div class="img">
                <el-image :src="dataSrc" class="card_img"></el-image>
                <div>{{ detailInfo.title }}</div>
            </div>
            <div class="content">
                {{ detailInfo.content }}
            </div>
            <div class="price">
                {{ detailInfo.price }}
            </div>
            <div class="num">
                <el-input-number v-model="num" :min="1" :max="10" size="small" @change="handleChange" />
            </div>
        </div> 
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
    detailInfos: {
        type: Object,
        default: {},
    },
})

const num = ref(1)
const detailInfo = ref({})
const handleChange = (value) => {
  console.log(value)
}

onMounted(() => {
    detailInfo.value = props.detailInfos
    console.log(detailInfo.value, 'defailvalue')

})

</script>

<style lang="scss" scoped>

.car_part {
    width: 100%;
    background-color: #ccc;
    border-radius: 12px;

    .store {
        margin-left: 20px;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
    }

    .main {   
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .img {
            display: flex;
            align-items: center;
            font-size: 14px;;
            .card_img {
                width: 70px;
                height: 80px;
                margin-right: 4px;
                margin-bottom: 8px;
            }
        }

        .content{
            overflow: hidden;
            text-overflow: ellipsis;
            width: 20%;
            color:#fff;
            font-size: 12px;
            // 三行换行后省略
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            word-break: break-all;
        }
        
        .price {
            font-weight: bold;
            color: rgb(230, 23, 23);
        }
        .num {
            // width: 30px;
        }
    }
}
</style>