<template>
    <div class="com_header">
        <!-- 头部固定 -->
        <div class="header">
            <div @click="goShop"><el-icon>
                    <ShoppingTrolley />
                </el-icon>购物车</div>
            <!-- <div @click="goCollect"><el-icon>
                    <Star />
                </el-icon><el-icon>
                    <StarFilled />
                </el-icon>收藏夹</div> -->
            <div v-if="isShow" @click="goProfile" class="ml"><el-icon>
                    <User />
                </el-icon>个人信息</div>
            <div v-else @click="goLogin" class="ml"><el-icon>
                    <User />
                </el-icon>请先登录！</div>
            <div @click="goConnect"><el-icon>
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
                            <el-dropdown-item>人工客服</el-dropdown-item>
                            <el-dropdown-item>意见反馈</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, defineEmits, computed } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const emit = defineEmits(['is-show']);

const isShow = computed(() => {
    return !!localStorage.getItem('id');
})
const goLogin = () => {
    router.push('/login')
}
// 点击头部，跳转页面
const goShop = () => {
    if (!localStorage.getItem('id')) {
        ElMessage.warning("请先登录!");
        return;
    }
    emit('is-show', true);
}

const goCollect = () => {
    emit('is-show', true);
}

const goProfile = () => {
    emit('isShow', true, 'YouProfile');
}

const goConnect = () => {
    emit('isShow', true);

}

</script>

<style lang="scss" scoped>
.com_header {
    width: 100%;
    position: fixed;
    background-color: #f8f8f8;


    .header {
        width: 70%;
        margin: 0 auto;
        display: flex;
        justify-content: end;
        font-size: 11px;
        padding: 5px 0;
        z-index: 100;

        div, .container {
            font-size: 12px;
            cursor: pointer;
            margin-right: 30px;
        }
        div:hover {
            color: hsla(160, 100%, 37%, 1);

        }
    }
}

</style>