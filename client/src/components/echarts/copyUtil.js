import { ElMessage, ElMessageBox } from 'element-plus'

let copyCon = null;

function copyHandler(e) {
  if (copyCon) {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', copyCon);
    } else if (window.clipboardData) {
      window.clipboardData.setData('Text', copyCon);
    }
    copyCon = null;
    ElMessage.success({
      message: '复制成功',
    });
  }
}

function handleCopy(data) {
  copyCon = data;
  document.execCommand('copy');
}

const listener = {
  mounted() {
    document.addEventListener('copy', copyHandler);
  },
  destroyed() {
    document.removeEventListener('copy', copyHandler);
  },
};

export { listener, handleCopy };
