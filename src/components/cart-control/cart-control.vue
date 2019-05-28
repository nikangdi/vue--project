<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop="decrease">
          <!-- stop的原因是 每条信息本身也需要点击，防止冒泡 -->
          <!-- 动画就是减号显示出来和隐藏的过程 -->
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop="add"></div>
  </div>
</template>
<script>
export default {
    name:'cart-control',
    props:{
        food:{
            type:Object,
        }
    },
    methods:{
        add(e){
            if(!this.food.count){
                this.$set(this.food,"count",1)
            }else{
                this.food.count++;
            }
            this.$emit('add',e.target); //每个点击的dom元素对象
        },
        decrease(){
            if(this.food.count){
                this.food.count--;
            }
        }
    },
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .cartcontrol
    display: flex
    align-items: center
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      .inner
        display: inline-block
        line-height: 24px
        font-size: $fontsize-large-xxx
        color: $color-blue
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-to
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      width: 12px
      line-height: 24px
      text-align: center
      font-size: $fontsize-small-s
      color: $color-grey
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: $fontsize-large-xxx
      color: $color-blue
</style>


