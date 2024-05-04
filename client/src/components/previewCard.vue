<template>
    <div>
        <el-card style="max-width: 310px; padding: 0px" shadow="hover">
            <div class="card_container">
                <div>
                    <el-image :src="detailInfo.img_src" class="card_img"></el-image>
                </div>
                <div class="card_content">
                    <span class="tilte">{{ detailInfo.tilte }}</span>
                    <br />
                    <span class="content">{{ detailInfo.content }}</span>
                    <br />
                    <span class="price"> {{ `￥${detailInfo.price}` }}</span>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
const props = defineProps({
    detailInfo: {
        type: Object,
        default: () => ({}),
    },
})

onMounted(() => {
    // console.log(props.detailInfo.img_src, 'src') //  ../assets/images/1.png
})


</script>

<style lang="scss" scoped>

.card_container {
    display: flex;
    background-color:rgba(247, 249, 250);

    ::v-deep .el-card__body,
    ::v-deep .el-card {
        padding: 8px;
    }
    
    .card_img {
        width: 128px;
        height: 140px;
    }

    .card_content {
        position: relative;
        margin-left: 10px;
        margin-top: 10px;
        cursor: pointer;

        .tilte {
            font-weight: bold;
        }

        .price {
            font-size: 16px;
            color: red;
        }
        .content {
            font-size: 12px;
            padding-top: 10px;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3; /* 超出几行省略 */
            overflow: hidden;       
        }
        .content:hover {
            color: hsla(160, 100%, 37%, 1);
        }

        .price {
            position: absolute;
            top: 112px;
        }
    }
   
}
</style>