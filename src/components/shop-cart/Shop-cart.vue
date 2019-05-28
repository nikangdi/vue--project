<template>
    <div class="shop-cart-container">

        <div class="shopcart">
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'highlight':totalCount>0}">
                            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                        </div>
                        <!-- 购物车标志右上角的count -->
                        <div class="num" v-show="totalCount>0">
                           <bubble :num="totalCount"></bubble>
                          <!-- <bubble :num="totalCount"></bubble> -->
                        </div>
                    </div>
                    <div class="price" :class="{'highlight':totalPrice>0}" >￥{{totalPrice}}</div>
                    <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right" @click.stop="pay">
                    <div class="pay" :class="payClass" >
                        {{payDesc}}
                    </div>
                </div>

            </div>
            <!-- 假设初始的时候有十个 小球 且都在shopcart这里 -->
            <div class="ball-container">
                <!-- 创建出是个小球 -->
                    <div v-for="(ball,index) in balls" :key="'ball'+index">
                          <transition
                            @before-enter="beforeDrop"
                            @enter="dropping"
                            @after-enter="afterDrop">
                            <div class="ball" v-show="ball.show">
                              <div class="inner inner-hook"></div>
                            </div>
                          </transition>  
                    </div>
            </div>
        </div>

    </div>
</template>
 <script>
   import Bubble from 'components/bubble/bubble'

  const BALL_LEN = 10  //做多同时有几个小球在做动画
  const innerClsHook = 'inner-hook'

  function createBalls() {
    let balls = []
    for (let i = 0; i < BALL_LEN; i++) {
      balls.push({show: false})
    }
    return balls//只是是个小球的显示开关
  }

  export default {
    name: 'shop-cart',
    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      //在自己内部调用自己的副本create-api
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      sticky: {
        type: Boolean,
        default: false
      },
      fold: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        balls: createBalls(),
        listFold: this.fold
      }
    },
    created() {
      this.dropBalls = []//不需要响应式，故可以在created中放置
    },
    computed: {
      totalPrice() {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
         //computed property 一定要注意return  return  return！！！！！！！！！！！！！！
      },
      totalCount() {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      payClass() {
        if (!this.totalCount || this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }
    },
    methods: {
      toggleList() {
        // console.log('togglelist-click')
            // 双开关
        if (this.listFold) {
          if (!this.totalCount) { //没有选择商品的时候不使用事件
            return
          }
          this.listFold = false
          // console.log("on");
          this._showShopCartList()
          this._showShopCartSticky()//在自己内部调用自己的副本create-api
        } else {
          this.listFold = true
           // console.log("off");
          this._hideShopCartList()
        }
      },
      pay(e) {
        if (this.totalPrice < this.minPrice) {
          return//此时无效
        }
        this.$createDialog({//cube-ui  Dialog
          title: '支付',
          content: `您需要支付${this.totalPrice}元`
        }).show()
        // e.stopPropagation()
      },
      drop(el) {// 每一个的加号点击时候的元素对象 加到一个数组中
        for (let i = 0; i < this.balls.length; i++) {
          const ball = this.balls[i]
          if (!ball.show) { //只取现在没在做动画的小球，最多同时显示十个小球
            ball.show = true
            ball.el = el//将点击的元素对象放到ball上，家到一个数组中
            this.dropBalls.push(ball)//正在做动画的小球
            return
          }
        }
      },
      beforeDrop(el) {
        const ball = this.dropBalls[this.dropBalls.length - 1]
        const rect = ball.el.getBoundingClientRect()//加号element的位置
        const x = rect.left - 32
        const y = -(window.innerHeight - rect.top - 22)//负数
        el.style.display = ''
         //初始的位置  先移动到加号处
        el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`
      },
      dropping(el, done) {
        this._reflow = document.body.offsetHeight
        //动画的最后位置
        el.style.transform = el.style.webkitTransform = `translate3d(0,0,0)`
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(0,0,0)`
        el.addEventListener('transitionend', done)
      },
      afterDrop(el) {
        const ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      _showShopCartList() {
        this.shopCartListComp = this.shopCartListComp || this.$createShopCartList({
          $props: {
            selectFoods: 'selectFoods'
          },
          $events: {
            leave: () => {
                //销毁sticky的时机
              this._hideShopCartSticky()
              // this.listFold = true
   
                    //    this._hideShopCartList()
            },
            hide: () => {//瞬间的状态
                        //shopcartlist中  混入的部分
                        this.listFold = true//放置在leave中  也可以  只是在hide中逻辑性更强
                        // console.log("hide")
                        //这个解决得问题是  点击蒙层，cartcontrollist消失时候，标志位没有变化，故下次点击shopcat两次才能弹出list
                        //设置过了maskclick,其隐藏后 并没有把cartcontrol中的 标志位listFold设置为true 
            },
            add: (el) => { 
                //?????????????????????????？？？？？？？？？？？？？？？
            //此时  为 点击加号
            // 调用  shopCartStickyComp createapi组件中的 drop
              this.shopCartStickyComp.drop(el)
            }
          }
        })
        this.shopCartListComp._show()
      },
      _showShopCartSticky() {
        this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectFoods',
            deliveryPrice: 'deliveryPrice',
            minPrice: 'minPrice',
            fold: 'listFold',
            list: this.shopCartListComp
          }
        })
        this.shopCartStickyComp._show()
      },
      _hideShopCartList() {
        const list = this.sticky ? this.$parent.list : this.shopCartListComp
        list.hide && list._hide()
         //parent指的是  sticky

        // this.shopCartListComp.hide()
      },
      _hideShopCartSticky() {
        this.shopCartStickyComp._hide()
      }
    },
    watch: {
      fold(newVal) {
        this.listFold = newVal
      },
      totalCount(count) {
        if (!this.fold && count === 0) {
          this._hideShopCartList()
        }
      }
    },
    components: {
      Bubble
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .shopcart
    height: 100%
    .content
      display: flex
      background: $color-background
      font-size: 0
      color: $color-light-grey
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: $color-background
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: $color-dark-grey
            &.highlight
              background: $color-blue
            .icon-shopping_cart
              line-height: 44px
              font-size: $fontsize-large-xxx
              color: $color-light-grey
              &.highlight
                color: $color-white
          .num
            position: absolute
            top: 0
            right: 0
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-weight: 700
          font-size: $fontsize-large
          &.highlight
            color: $color-white
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: $fontsize-small-s
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-weight: 700
          font-size: $fontsize-small
          &.not-enough
            background: $color-dark-grey
          &.enough
            background: $color-green
            color: $color-white
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: $color-blue
          transition: all 0.4s linear
</style>

