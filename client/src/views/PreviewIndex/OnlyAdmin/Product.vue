<template>
    <div class="article-container">
        <el-card>
            <el-tabs v-model="tabValue" type="border-card">
                <el-tab-pane name="list" label="商品列表" class="list">
                    <div v-for="(item, product_id) in productList" :key="product_id" class="blogList">
                        <el-card style="width: 400px;">
                            <div>
                                店铺：{{ item.shop }}
                                <br>
                                商品名：{{ item.tilte }}
                                <br>
                                商品描述：{{ item.content }}
                            </div>
                            <template #footer>
                                <el-space align="center">
                                    <div class="time">发布时间： {{ formatDate(item.create_time) }}</div>
                                    <el-button type="primary" @click="toUpdate(item)">修改</el-button>
                                    <el-button type="danger" @click="toDelete(item)">删除</el-button>
                                </el-space>
                            </template>
                        </el-card>
                    </div>
                </el-tab-pane>

                <el-tab-pane name="add" label="添加商品">
                    <el-form>
                        <el-form-item label="店铺">
                            <el-input v-model="addProduct.shop" placeholder="请输入店铺名" />
                        </el-form-item>
                        <el-form-item label="商品名">
                            <el-input v-model="addProduct.tilte" placeholder="请输入商品名" />
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-select v-model="addProduct.category_id">
                                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品描述">
                            <el-input v-model="addProduct.content" placeholder="请输入描述内容" />
                        </el-form-item>
                        <el-form-item label="商品价格">
                            <el-input v-model="addProduct.price" placeholder="请输入单价" />
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="add" type="primary">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane name="update" label="修改商品" disabled>
                    <el-form>
                        <el-form-item label="店铺">
                            <el-input v-model="updateProduct.shop" placeholder="请输入店铺名" />
                        </el-form-item>
                        <el-form-item label="商品名">
                            <el-input v-model="updateProduct.tilte" placeholder="请输入商品名" />
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-select v-model="updateProduct.category_id" disabled>
                                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品描述">
                            <el-input v-model="updateProduct.content" placeholder="请输入描述内容" />
                        </el-form-item>
                        <el-form-item label="商品价格">
                            <el-input v-model="updateProduct.price" placeholder="请输入单价" />
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="update" type="primary">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '../until'

const axios = inject("axios")

//添加
const addProduct = reactive({
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

//修改
const updateProduct = reactive({
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

const categoryOptions = ref([])
//博客列表
const productList = ref([])
const tabValue = ref('list')

onMounted(() => {
    getAllProduct()
    loadDatas()
})


//获取全部商品
const getAllProduct = async () => {
    try {
        let result = await axios.get('/product/info')

        if (result.data.code == 200) {
            productList.value = result.data.rows;
        } 
    }catch(error) {
        ElMessage.error(error.msg)
    }
}

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
    }catch(error) {
        ElMessage.error(error.msg)
    }  
}

//提交按钮（为某项分类 添加商品）
const add = async () => {
    try {
        let res = await axios.post('/product/add', {
            category_id: addProduct.category_id,
            tilte: addProduct.tilte.trim(),
            content: addProduct.content.trim(),
            shop: addProduct.shop.trim(),
            price: addProduct.price,
            num: addProduct.num,
            is_car: addProduct.is_car,
            checked: addProduct.checked,
            img_src: addProduct.img_src,
        })
        if (res.data.code == 200) {
            ElMessage.success("添加商品成功")
            addProduct.tilte = ""
            addProduct.content = ""
            addProduct.category_id = 0
            addProduct.price = 0
            addProduct.shop = ""
            getAllProduct()
            tabValue.value = "list"
        } 
    }catch(error) {
        ElMessage.error(error.msg)
    }

}

//to修改界面
const toUpdate = async (pro) => {
    tabValue.value = 'update'
    let res = await axios.get('/product/detail?product_id=' + pro.product_id)
    console.log(res.data, 'detail')
    updateProduct.product_id = pro.product_id
    updateProduct.category_id = res.data.rows[0].category_id
    updateProduct.tilte = res.data.rows[0].tilte
    updateProduct.content = res.data.rows[0].content
    updateProduct.shop = res.data.rows[0].shop
    updateProduct.price = res.data.rows[0].price
}

//提交修改
const update = async () => {
    try {
        let res = await axios.put('/product/update', updateProduct)
        if (res.data.code == 200) {
            ElMessage.success(res.data.msg)
            getAllProduct()
            tabValue.value = "list"
        }
    } catch (error) {
        ElMessage.error(error.msg)
    }
}
// 删除操作
const toDelete = async (pro) => {
    ElMessageBox.alert('是否删除该商品', '注意：', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            let res = await axios.delete('/product/delete?product_id=' + pro.product_id)
            if (res.data.code == 200) {
                ElMessage.success(res.data.msg)
                getAllProduct()
            }
        } catch (error) {
            ElMessage.error(error.msg)
        }
        
    }).catch(() => {
        ElMessage.info('已取消删除');
    }); 
}
</script>

<style lang="scss" scoped>
.article-container {
    font-size: 14px;
    opacity: 0.9;

    .list {
        display: flex;
        flex-wrap: wrap;

        .blogList {
            margin-right: 20px;
            margin-bottom: 20px;
        }
    }
}



.time {
    // margin-right: 70px;
    font-size: 12px;
    color: #ccc;
}

.littlePage {
    width: 25px;
    height: 25px;
    border-radius: 5px;
    text-align: center;
    font-weight: bold;
}
</style>
