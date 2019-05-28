<template>
    <transition name="fade">
      <cube-popup 
      :maskClosable=true
      position="bottom"
      type="shop-cart-list"
      :z-index=90
      @mask-click="maskClick"
      v-show="visible"
      >
        <transition name="move" @after-leave="afterLeave" >
          <div v-show="visible">
            <!-- 购物车头部分 -->
            <div class="list-header">
              <h1 class="title">购物车</h1>
              <span class="empty" @click="empty">清空</span>
            </div>
            <!-- 购物车列表部分 -->
            <cube-scroll class="list-content" ref="listContent">
              <ul>
                <li class="food" v-for="(food,index) in selectFoods" :key="'selectedfood'+index">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span >￥{{food.price*food.count}}</span>
                  </div>
                  <div class="cart-control-wrapper">
                    <CartControl @add="onAdd" :food="food"></CartControl>
                  </div>
                </li>
              </ul>
            </cube-scroll>
          </div>
        </transition>
      </cube-popup>
    </transition>    
</template>
<script>
import popupMixin from 'common/mixins/popup'
import CartControl from 'components/cart-control/cart-control'

export default {
    name:'shop-cart-list',
    mixins:[popupMixin],
    props:{
        selectFoods:{
            type:Array,
            default(){
                return []
            }
        }

    },
    // data(){
    //   return{
    //     visible:false
    //   }
    // },
    methods:{
      //重构  
      //该块逻辑同主页点击公告弹出店铺描述模块类似，createApi
      //将show（）与hide（）方法进行提取并mixins混入
      // _hide(){
      //   this.visible = false

      // },
      // _show(){
      //   this.visible = true
      // },
      maskClick(){
        this._hide()
      },
      empty(){
        // console.log("empty")
        this.dialogComp = this.$createDialog({
          type:"confirm",
          content:"清空购物车？",
          $events:{
            confirm:()=>{
              this.selectFoods.forEach((food)=>{
                food.count = 0;
              })
              this._hide();
            }
          }
        })
        this.dialogComp.show()
      },
      onAdd(target){
        //cartcontrol通过$emit一个add来调用绑定shopcartlist中的，即本组件 中的 onadd
        //本组件 是作为一个createapi组件
        //作为子组件，需要在父组件中  进行 事件函数  比如执行小球动画 等
        // console.log("onADD")
        this.$emit("add",target)
      },
      afterLeave(){
        this.$emit("leave")
        
      },
    },
    components:{
      CartControl
    }

    
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .cube-shop-cart-list
    bottom: 48px
    &.fade-enter, &.fade-leave-to
      opacity: 0
    &.fade-enter-active, &.fade-leave-active
      transition: all .3s ease-in-out
    .move-enter, .move-leave-to
      transform: translate3d(0, 100%, 0)
    .move-enter-active, .move-leave-active
      transition: all .3s ease-in-out
    .list-header
      height: 40px
      line-height: 40px
      padding: 0 18px
      background: $color-background-ssss
      .title
        float: left
        font-size: $fontsize-medium
        color: $color-dark-grey
      .empty
        float: right
        font-size: $fontsize-small
        color: $color-blue

    .list-content
      padding: 0 18px
      max-height: 217px
      overflow: hidden
      background: $color-white
      .food
        position: relative
        padding: 12px 0
        box-sizing: border-box
        .name
          line-height: 24px
          font-size: $fontsize-medium
          color: $color-dark-grey
        .price
          position: absolute
          right: 90px
          bottom: 12px
          line-height: 24px
          font-weight: 700
          font-size: $fontsize-medium
          color: $color-red
        .cart-control-wrapper
          position: absolute
          right: 0
          bottom: 6px

</style>


