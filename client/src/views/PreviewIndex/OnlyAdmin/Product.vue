<template>
    <div class="article-container">
        <el-card>
            <!-- 搜索部分 -->
            <div class="search">
                <el-input v-model="keyword" style="width: 440px" placeholder="输入宝贝" clearable class="search_input" />
                <el-select placeholder="查询分类" v-model="category_id" style="width: 140px" class="search_input">
                    <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
                <el-button type="success" class="search_button" @click="searchPro">搜索</el-button>
                <el-button type="info" class="search_button" @click="getAllProduct">回到全部</el-button>
            </div>

            <el-tabs v-model="tabValue" type="border-card">
                <el-tab-pane name="list" label="商品列表" class="list">
                    <div v-loading="loading">
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
                        <el-form-item label="商品图片描述">
                            <TextEditor v-model="addProduct.img_src"></TextEditor>
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
                        <el-form-item label="商品图片描述">
                            <TextEditor v-model="updateProduct.img_src"></TextEditor>
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
import TextEditor from '../../../components/TextEditor.vue'

const axios = inject("axios")

const keyword = ref('')
const category_id = ref()
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
const productList = ref([])
const tabValue = ref('list')
const loading = ref(true)

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
            setTimeout(() => {
                loading.value = false
            }, 1000)
        } 
    }catch(error) {
        ElMessage.error(error.msg)
    }
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
        productList.value = res.data.data.rows;
        setTimeout(() => {
            loading.value = false
        }, 1000)
        keyword.value = ''
        category_id.value = 0
    } else {
        ElMessage.error("查询失败！")
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
    updateProduct.img_src = res.data.rows[0].img_src
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

 .search {
     width: 100%;
     height: 100px;

     .search_input,
     .search_button {
         margin-left: 20px;
         margin-top: 35px;

     }
 }

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
