<template>
  <div id="app">
    <!-- 页面总共分成两部分 -->
    <!-- 头部分 -->
    <Header :seller="seller"></Header>

    <!-- tabbar部分 -->
    <div class="tab-wrapper">
      <Tab :tabs="tabs" :initialIndex=0></Tab>

    <!-- 手动做header-detail的话在这个位置 -->

    </div>
   
  </div>
</template>

<script>
import { getSeller } from 'api/index.js'

import Header from 'components/header/Header.vue'
import Tab from 'components/tab/Tab.vue'

import Goods from 'components/goods/Goods'
import Ratings from 'components/ratings/Ratings'
import Seller from 'components/seller/Seller'


export default {
  name: 'app',
  data(){
    return {
      seller:{}, //数据seller
      // tabs:[    //错误  不应该放到data中
      //放在data中   seller并不会自动计算得到，会在初始化时候得到，那时候是undifined
      //之后页面调用全都会报错
      //data数据初始化实在beforecreated中，ajax实在created中，故 data中的this.seller还没从ajax获取，所以undefined
      //        { label:"商品", component: Goods, data: { seller:this.seller }},
      //        { label:"评价", component: Ratings,data: { seller:this.seller }},
      //        { label:"商家", component: Seller ,data:{ seller:this.seller }} 
      // ],//传递给tab的数据
      
    }
  },
  methods:{
    _getSeller(){
      getSeller().then(seller=>{
        this.seller = seller;
        // console.log(this.seller);
      })
    }
  },
  created(){
    this._getSeller();
  },
  computed: {
      tabs() {
        return [
          {
            label: '商品',
            component: Goods,
            data: {
              seller: this.seller,
            },
          },
          {
            label: '评价',
            component: Ratings,
            data: {
              seller: this.seller,
            },
          },
          {
            label: '商家',
            component: Seller,
            data: {
              seller: this.seller,
            },
          },
        ]
      },
    },
  components: {
    Header,
    Tab
    
  }
}
</script>
<style lang="stylus">
 #app
    .tab-wrapper
      position: fixed
      top: 136px
      left: 0
      right: 0
      bottom: 0
      

</style>
