<template>
    <div>
        <el-card
            style="width: 200px; height: 190px; padding: 0px"
            shadow="hover"
        >
            <img
                :src="dataSrc"
                class="card_img">
            </img>
            <div class="font">
                <span class="title">{{ title }}</span>
                <br/>
                <span class="red"> {{ `￥${price}` }}</span>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
    // detailInfo: {
    //     type: Object,
    //     default: {},
    // },
    dataSrc: {
        type: String,
        default: "",
    },
    title: {
        type: String,
        default: "",
    },
    content: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        default: "0",
    },

})

</script>

<style lang="scss" scoped>
.card_img {
    width: 190px;
}

.font {
    font-size: 14px;
    text-align: center;
}

</style>