<template>
    <div class="category-container">
        <el-button @click="showAddModal = true" type="primary">添加</el-button>
        <el-table :data="categoryList" stripe border>
            <el-table-column label="编号" prop="id"></el-table-column>
            <el-table-column label="名称" prop="title"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="success" @click="toUpdate(row)">修改</el-button>
                    <el-button type="danger" @click="deleteCategory(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加分类弹框 -->
        <el-dialog v-model="showAddModal" title="添加分类">
            <el-form :model="addCategory">
                <el-form-item label="名称">
                    <el-input v-model="addCategory.tilte" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="cancelAdd">取消</el-button>
                <el-button type="primary" @click="addMessage">提交</el-button>
            </div>
        </el-dialog>

        <!-- 修改分类名称 -->
        <el-dialog v-model="showUpdateModal" title="修改分类">
            <el-form :model="updateCategory">
                <el-form-item label="名称">
                    <el-input v-model="updateCategory.tilte" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="cancelUpdate">取消</el-button>
                <el-button type="primary" @click="updateMessage(updateCategory.tilte)">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import myEventBus from "../../../eventBus/index.js";

const emitter = myEventBus();
const getBorder = ()  => {
    emitter.emit("updateCateOption");
}

const axios = inject("axios");
const router = useRouter();

const categoryList = ref([]); //定义category列表

onMounted(() => {
    loadDatas();
});

//查询所有数据
const loadDatas = async () => {
    let result = await axios.get("/category/getList");
    categoryList.value = result.data.rows;
};

//添加、修改数据
const updateCategory = reactive({
    tilte: "",
    id: 0,
});

const addCategory = reactive({
    tilte: "",
});

//修改按钮
const toUpdate = (item) => {
    showUpdateModal.value = true;
    updateCategory.tilte = item.tilte;
    updateCategory.id = item.id;
};

//弹框操作
const showAddModal = ref(false); //显示隐藏添加弹框
const showUpdateModal = ref(false); //显示隐藏修改弹框

const addMessage = async () => {
    if (!addCategory.tilte.trim()) {
        ElMessage.error("请输入内容");
        return;
    }

    let res = await axios.post(
        "/category/add",
        { tilte: addCategory.tilte.trim() }
    );

    if (res.data.code == 200) {
        ElMessage.success(res.data.msg);
        loadDatas();
    } else {
        ElMessage.error(res.data.msg);
    }
    addCategory.tilte = "";
    showAddModal.value = false;
    getBorder();
};
const updateMessage = async (value) => {
    if (!updateCategory.tilte.trim()) {
        ElMessage.error("请输入内容");
        return;
    }

    let res = await axios.put("/category/update", {
        tilte: updateCategory.tilte.trim(),
        id: updateCategory.id,
    });
    if (res.data.code) {
        ElMessage.success(res.data.msg);
        loadDatas();
    } else {
        ElMessage.error(res.data.msg);
    }
    showUpdateModal.value = false;
    getBorder();
};

const cancelAdd = () => {
    ElMessage.success("取消");
    showAddModal.value = false;
};

const cancelUpdate = () => {
    ElMessage.success("取消");
    showUpdateModal.value = false;
};

//删除按钮
const deleteCategory = async (item) => {
    ElMessageBox.alert('是否删除该分类', '注意：', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        let res = await axios.delete(`/category/delete?id=${item.id}`);
        if (res.data.code == 200) {
            loadDatas();
            ElMessage.info(res.data.msg);
        } else {
            ElMessage.error(res.data.msg);
        }
    }).catch(() => {
        ElMessage.info('已取消删除');
    }); 

    getBorder();
};
</script>

<style lang="scss" scoped>
.category-container {
    margin-top: 30px;
    opacity: 0.9;
}

.n-button {
    margin: 10px 40px;
}
</style>
