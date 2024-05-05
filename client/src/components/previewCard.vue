<template>
    <div>
        <el-card style="max-width: 422px; padding: 0px" shadow="hover">
            <div class="card_container">
                <div class="card_img">
                    <div v-html="detailInfo.img_src" style=" min-width: 180px;
                        max-width: 210px; max-height: 200px; overflow: hidden;">
                    </div>
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
    console.log(props.detailInfo.img_src, 'src') //<p><img src="http://localhost:8080/upload561392112013381.png" alt="" data-href="" style=""/></p>
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
        min-width: 180px;
        max-width: 210px;
        max-height: 200px;
        overflow: hidden;
    }

    .card_content {
        position: relative;
        margin-left: 10px;
        margin-top: 10px;
        cursor: pointer;

        .tilte {
            font-weight: bold;
            margin-top: 25px;
        }

        .price {
            position: absolute;
            top: 142px;
            font-size: 16px;
            color: red;
        }
        .content {
            font-size: 12px;
            padding-top: 40px;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4; /* 超出几行省略 */
            overflow: hidden;       
        }
        .content:hover {
            color: hsla(160, 100%, 37%, 1);
        }
    }
   
}
</style>