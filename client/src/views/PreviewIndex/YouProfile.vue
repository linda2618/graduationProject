<template>
  <!-- 头像 -->
  <div class="avatar_header">
    <el-avatar class="avatar" :size="50" :src="form.avatar" />
    <div class="avatar_name">
      <div>
        <span class="name"> {{ form.name }} </span>
        <span class="name">
          ( {{ form.englishName }})
        </span>
      </div>
      <div class="explain">
        Your personal profile
      </div>
    </div>
    <el-button type="info" class="back" @click="back">返回</el-button>
  </div>
  <div class="divider"></div>
  <!-- 个人信息表单 -->
  <div>
    <el-form :model="form" label-width="auto" style="max-width: 600px; margin: 40px 20px;">
      <el-form-item label="昵称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="上传头像">
        <!-- <el-upload name="file" :show-file-list="false" :multiple="false" :http-request="selectImg" class="bor">
          <img v-if="imageUrl" :src="imageUrl" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload> -->

        <el-upload name="file" :show-file-list="false" :multiple="false" :http-request="selectImg"
          :on-success="handleAvatarSuccess" class="bor">
          <img v-if="form.imageUrl" :src="form.imageUrl" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="英文名">
        <el-input v-model="form.englishName" />
      </el-form-item>
      <el-form-item label="收货地址">
        <el-input v-model="form.address" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const form = reactive({
  name: '大壮妹妹爱魔芋',
  englishName: 'lindazhuang',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  imageUrl: '',
})
const server_url = inject("server_url")

const handleAvatarSuccess = (uploadFile) => {
  console.log(uploadFile, uploadFile.url, '111')
  form.imageUrl = uploadFile.url; 
};

const uploadImageToServer = (file) => {
  let formData = new FormData();
  formData.append('file', file);

  fetch(server_url + "/upload/image", {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      form.imageUrl = data.url;
    })
    .catch(error => {
      console.error('Error uploading image:', error);
      ElMessage.error('Error uploading image. Please try again.');
    });
};

const back = () => {
  router.go(-1)
}

const onSubmit = () => {
  console.log(form, 'from--submit!')
}
</script>

<style lang="scss" scoped>
.avatar_header {
  display: flex;
  vertical-align: bottom;

  .avatar {
    margin: 20px;  }

  .avatar_name {
    margin-top: 37px;

    .name {
      margin: 0 auto;
      text-align: center;
    }

    .explain {
      font-size: 12px;
    }
  }
}

.divider {
  margin: 20px 0;
}

.bor {
    border: 1px dashed #ccc;
    margin: 10px;
}

.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: green;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.back {
  position: relative;
  top: 32px;
  left: 240px;
}
</style>
