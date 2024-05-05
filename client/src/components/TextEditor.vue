<!-- 富文本组件 -->
<template>
    <div class="edit">
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
            style="border-bottom: 1px solid #ccc" />
        <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 400px; width: 250px;
        overflow-y: hidden" @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, reactive, inject, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const server_url = inject("server_url")
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
// toolbarConfig排除掉一些功能
const toolbarConfig = { excludeKeys: ["uploadVideo"] };
const editorConfig = { placeholder: '请输入内容...' };


editorConfig.MENU_CONF = {}
// 指定上传的地址
editorConfig.MENU_CONF['uploadImage'] = {
    base64LimitSize: 10 * 1024, // 10kb如果图片比较小可以这样上传
    server: server_url + "/upload/rich_editor_upload",
}
// 插入图片
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src) => {  //插入图片之前会执行的函数
        //   console.log(src, "图片");
        if (src.indexOf("http") !== 0) { //判断src是否包含http
            return `${server_url}${src}`
        }
        return src
    }
}

const mode = ref("default")
const valueHtml = ref("")//和上面是双绑

const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    }
})

const emit = defineEmits(["update:model-value"])
let initFinished = false

onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue;//父页面传过来的值
        initFinished = true;  //这个只是一个变量名，不需要渲染到页面上面，只是处理逻辑的变量名
    }, 10);
});

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
    if (initFinished) {
        emit("update:model-value", valueHtml.value)//valueHtml抛的上面绑定的内容
    }
};

</script>

<style lang="scss" scoped>
.edit {
    margin-top: 80px;
    height: 390px;
}
</style>