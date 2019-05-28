<!-- shopCart的 一个副本 -->

<template>
  <div class="shop-cart-sticky" v-show="visible">
    <ShopCart
      ref="shopCart"
      :selectFoods="selectFoods"
      :deliveryPrice="deliveryPrice"
      :minPrice="minPrice"
      :fold="fold"
      :sticky=true
   
    >
    </ShopCart>
  </div>    
</template>
<script>
import ShopCart from 'components/shop-cart/Shop-cart'
import popupMixin from 'common/mixins/popup'


export default {
    name:'shop-cart-sticky',
    mixins: [popupMixin],//每个  createapi都需要定义 hide，show方法以及显示隐藏标志位
    components:{
        ShopCart,
    },
    props:{
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      fold: {
        type: Boolean,
        default: true
      },
      list: {
        type: Object,
        default() {
          return {}
        }
      }        
    },
    methods: {
      drop(el) {
        this.$refs.shopCart.drop(el)
      }
    },

    
}
</script>
<style lang="stylus" scoped>
  .shop-cart-sticky
    position: absolute
    left: 0
    bottom: 0
    z-index: 999
    width: 100%
    height: 48px
</style>




