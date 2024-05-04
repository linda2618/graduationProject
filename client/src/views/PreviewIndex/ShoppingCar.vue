<template>
  <div class="shopCar">
    <!-- 购物车 -->
    <div class="w">
      <!-- 搜索 -->
      <div class="search">
        <span>你喜欢?  喜欢就快快带回家吧~~</span>
        <!-- <el-input v-model="search" style="width: 50%; height: 40px; margin-top: 6px" placeholder="搜索"
          :prefix-icon="Search" class="search_input" /> -->
        <el-button type="info" plain style="width: 40px; height: 30px; margin-top: 16px"
          @click="goBack">返回</el-button>
      </div>
      <!-- 主体 -->
      <div class="shop_main">
        <div class="shop_merchandise">
          <div>购物车 （全部 {{ shopInfo.length }}）</div>
          <div>
            已选商品:<span class="red">{{ totalAmount }}</span>件，
            合计:<span class="red"> ￥{{ totalPrice.toFixed(2) }}</span>
            <el-button class="sua" type="info" @click="emptyCart" round>
              清空购物车
            </el-button>
          </div>
        </div>
        <div class="shop_content" v-if="shopInfo.length">
          <div class="shop_checkbox">
            <input id="checkAll" type="checkbox" class="check_all" :checked="searchAll"
              @change="handleCheckAllChange($event.target.checked)" />全选
            <div class="content">
              <span>店铺</span>
              <span class="mia">描述</span>
              <span class="price">单件</span>
              <span class="num">数量</span>
              <span class="total">总额</span>
              <span class="option">操作</span>
            </div>
            <div class="divider"></div>
            <div id="checkItem">
              <div class="check_group" v-for="item in shopInfo" :key="item.product_id" :value="item.product_id"
                :label="item.product_id">
                <!-- 全选 -->
                <input class="store" type="checkbox" name="store" :checked="item.checked == 1"
                  @click="handleSingle(item)">
                {{ item.store }}
                <br />
                <div class="main">
                  <div class="img">
                    <el-image :src="item.dataSrc" class="card_img"></el-image>
                    <div class="title">{{ item.tilte }}</div>
                  </div>
                  <div class="content">
                    {{ item.content }}
                  </div>
                  <div>
                    ￥{{ item.price }}
                  </div>
                  <div class="num">
                    <el-input-number v-model="item.num" :min="1" size="small" @change="handleChange($event, item.id)" />
                  </div>
                  <div class="price">
                    ￥{{ (item.price * item.num).toFixed(2) || '?' }}
                  </div>
                  <div class="delete" @click="deleteItem(item)">
                    删除
                  </div>
                </div>
                <div class="divider"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pro_box" v-else>购物车里空空如也~~</div>
      </div>
      <!-- 结算栏 -->
      <div class="account">
        <el-button class="buy" type="warning" round @click="noOption">
          立即购买
        </el-button>
        <div class="select_acc">
          已选商品:<span class="red">{{ totalAmount }} </span>件，
          合计:<span class="red"> ￥{{ totalPrice.toFixed(2) }}</span>
          <el-button class="sua" :type="hasMer ? 'warning' : 'info'" round @click="noOption">
            结算
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, inject, nextTick } from "vue"
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'
import p1 from '../../assets/images/1.png'

const axios = inject("axios")
const router = useRouter()
const search = ref("")
let totalPrice = ref(0);
let totalAmount = ref(0);
const loading = ref(true)
const searchAll = ref(false)

const shopInfo = ref([])

//获取全部商品
const getCarInfo = async () => {
  let result = await axios.get('/product/info')

  if (result.data.code == 200) {
    shopInfo.value = result.data.rows.filter(item => item.is_car == 1)
    setTimeout(() => {
      loading.value = false
    }, 1000)

    //计算总价
    totalSelectedPrice()
  } else {
    ElMessage.error("node接口问题")
  }
}
 
const hasMer = computed(() => {
  return shopInfo.length > 0;
});

//判断是否全选中
const allItemsSelected = computed(() => {
  return shopInfo.value.length > 0 && shopInfo.value.every(item => item.checked == 1);
});
// 监听所有商品选择状态的变化
watch(allItemsSelected, (newValue) => {
  console.log('变化了！', newValue)
  searchAll.value = newValue
});

// 全选/取消全选事件
const handleCheckAllChange = async (value) => {
  console.log(value, '138')
  try {
    const updatedItems = shopInfo.value.map(item => {
      return { ...item, checked: value ? 1 : 0 };
    });

    await Promise.all(updatedItems.map(item => handleSingle(item, 'all')));
    totalSelectedPrice();
  } catch (error) {
    ElMessage.error("修改失败：" + error.message);
  }
};

//单个商品是否选中
const handleSingle = async (item, type) => {
  let newCheckedState = 0
  if (type === 'all') {
     newCheckedState = item.checked;
  } else {
    if (item.checked == 1) {
       newCheckedState = 0
    } else {
       newCheckedState = 1
    }
  }

  try {
    const result = await axios.put('/product/checked', {
      product_id: item.product_id,
      checked: newCheckedState,
    })

    if (result.data.code == 200) {
      getCarInfo();
    } else {
      ElMessage.error("修改失败");
    }
  } catch (error) {
    ElMessage.error(error);
  }
};


// 1.更新单个商品数量
const handleChange = (value, id) => {
  const item = shopInfo.value.find(item => item.id === id)
  if (item) {
    item.num = value
  }
  totalSelectedPrice();
}

// 2.计算已选商品总件/总价格
const totalSelectedPrice = () => {
  let totalPriceValue = 0
  let totalNum = 0
  if (shopInfo.value)
  shopInfo.value.forEach(goods => {
    if (goods.checked) {
      totalPriceValue += goods.price * goods.num
      totalNum += goods.num
    }
  })
  totalPrice.value = totalPriceValue
  totalAmount.value = totalNum
}

// 返回上一页
const goBack = () => { 
  router.go(-1)
}

// 删除商品
const deleteItem = (item) => {
  ElMessageBox.alert('是否删除该商品', '注意：', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    shopInfo.value = shopInfo.value.filter(i => i.id !== item.id)
    totalSelectedPrice();
  }).catch(() => {
    ElMessage.info('已取消删除');
  }); 
}

// 删除所有商品
const emptyCart = () => {
  ElMessageBox.confirm('您确定删除所有商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    shopInfo.value = []
    totalSelectedPrice();
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

// 结算（暂未完善）
const noOption = () => {
  ElMessageBox.confirm('该功能有待开发', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '关闭',
    type: 'warning'
  }).then(() => {
    ElMessage.info('感谢支持');
  }).catch(() => {
    ElMessage.info('感谢支持');
  });
}
onMounted(() => {
  getCarInfo();
})
</script>

<style lang="scss" scoped>
.shopCar {
  height: 100%;
  background-color: #f2f1f1;

  .search {
    width: 100%;
    height: 60px;
    line-height: 60px;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 40px;
    display: flex;
    justify-content: space-around;

    span {
      font-weight: bold;
      color: #ccc;
      font-size: 16px;
    }
  }

  .shop_main {
    width: 100%;

    .shop_merchandise {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
      height: 60px;
      line-height: 60px;
      margin: 10px auto;
      background-color: #fff;
      border-radius: 20px;

      .red{
        color: red;
        margin-right: 20px;
      }

      .sua:hover {
        background-color: rgb(241, 152, 89);
      }
    }

    .shop_content {
      
      background-color: #fff;
      border-radius: 20px;
      
      .shop_checkbox {
        margin: 0 20px;

        .content{
          margin: 10px 20px;
          display: flex;
          .mia {
            margin-left: 28%;
          }
          .price {
            margin-left: 25%;
          }
          .num {
            margin-left: 14%;
          }
          .option {
            margin-left: 8%;
          }
          .total {
            margin-left: 12%;
          }
        }

        .check_all {
          margin-top: 20px;
        }
        .store {
          margin-top: 24px;
        }

        .main {   
            padding: 10px 20px;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #e6e3e3;
            .img {
              width: 22%;
                display: flex;
                align-items: center;
                font-size: 13px;;
                .card_img {
                    min-width: 70px;
                    height: 80px;
                    margin-right: 4px;
                    margin-bottom: 8px;
                }

                .title {
                  width: 100px;
                  min-width: 60px;
                  margin-left: 5px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  // 三行换行后省略
                  display: -webkit-box;
                  -webkit-line-clamp: 3;
                  -webkit-box-orient: vertical;
                  word-break: break-all;
                }
            }

            .content{
                overflow: hidden;
                text-overflow: ellipsis;
                width: 20%;
                color:#6d6d6d;
                font-size: 12px;
                // 三行换行后省略
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                word-break: break-all;
            }
            .price {
                font-weight: bold;
                color: rgb(230, 23, 23);
            }
            .delete {
              cursor: pointer;
              font-size: 13px;
              color: rgb(96, 96, 95);
            }
        }
      }
    }

    .pro_box {
      margin: 200px 418px;
      font-size: 16px;
    }
  }

  .account {
    z-index: 999;
    border-top: #ccc 1px solid;
    display: flex;
    position: fixed;
    left: 160px;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    .buy {
      margin-top: 10px;
      margin-left: 20px;
      font-size: 18px;
    }

    .select_acc {
      position: absolute;
      right: 200px;

      .red {
          color: red;
          margin-right: 20px;
      }

    }
  }
}
</style>
