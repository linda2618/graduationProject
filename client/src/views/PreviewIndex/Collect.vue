<template>
    <div>
        <div class="header">
            <span class="sou">收藏夹</span>
            <el-input
                v-model="search"
                style="width: 200px;  height: 25px; margin-top: 10px; margin-right: 50px;"
                placeholder="搜索"
                :prefix-icon="Search"
            />
        </div>
        <!-- 收藏卡片 -->
        <div class="coll_card">
            <div
            v-for="item in 5"
            >
                <CollectComponent
                    :dataSrc="imgs[item]"
                    :title="'新鲜大白菜'"
                    :content="'今日特价新鲜大白菜,便宜卖不要99.9也不要9.99,只要5.9!!!只要5.9!!!只要5.9!!!'"
                    :price="6"
                    class="card"
                    @click="goDetail"
                >
                </CollectComponent>
            </div>
            
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, } from 'vue'
import { Search } from '@element-plus/icons-vue'
import CollectComponent from '../../components/CollectComponent.vue'
import p1 from  '../../assets/images/1.png'
import p2 from  '../../assets/images/2.png'
import p3 from  '../../assets/images/3.png'
import p4 from  '../../assets/images/4.png'
import p5 from  '../../assets/images/5.png'
import p6 from '../../assets/images/6.png'

const search = ref('')
const imgs = ref([
    p1, p2, p3, p4, p5, p6
])


</script>

<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: rgb(247, 123, 102);
    color: #000;
    font-size: 13px;
    .sou {
        margin-left: 20px;
    }
}

.coll_card {
    display: flex;
    flex-wrap: wrap;
    .card {
        margin: 10px;
    }
}



</style>