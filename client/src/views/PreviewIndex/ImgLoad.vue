<template>
    <div>
        <el-upload class="upload-demo" ref="upload" action='http://localhost:3001/api/imgload' :data="form"
            :on-preview="handlePreview" :auto-upload="false" :on-success="handleUploadSuccess">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
            </div>
        </el-upload>
        <el-button type="primary" @click="submit">确 定</el-button>

    </div>
</template>
<script setup>
import { ref, reactive, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'

const axios = inject("axios")
const form = ref()

const submit = async () => {
    console.log(form.value, 'form.value')
    let result = await axios.post('/img/imgload', {
        product_id: 1,
        img_src: form.value
    })
    if (result.data.code == 200) {
        ElMessage.success("注册成功")
        activeName.value = "first"

    } else {
        ElMessage.error("登录失败")
    }
}
</script>
