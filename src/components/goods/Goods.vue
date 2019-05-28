<template>
  <div class="goods">
    <div class="scroll-nav-wrapper">
      <cube-scroll-nav
        :side=true
        :data="goods"
        :options="scrollOptions"
        v-if="goods.length">
        <template slot="bar" slot-scope="props">
          <!-- props即遍历每一项的good   slot标签内会进行遍历穿进去的数据goods-->
          <cube-scroll-nav-bar
            direction="vertical"
            :labels="props.labels"
            :txts="barTxts"
            :current="props.current">
            <!-- 会根据labels去txts里面找相应的数据 -->
            
            <template slot-scope="props">
              <div class="text">
                <support-ico
                  v-if="props.txt.type>=1"
                  :size=3
                  :type="props.txt.type">
                </support-ico>
                <span>{{props.txt.name}}</span>
                <span class="num" v-if="props.txt.count">
                  <Bubble :num="props.txt.count"></Bubble>
                </span>
              </div>
            </template>
          </cube-scroll-nav-bar>
        </template>
        <cube-scroll-nav-panel
          v-for="good in goods"
          :key="good.name"
          :label="good.name"
          :title="good.name">
          <ul>
            <li
              @click="selectFood(food)"
              v-for="food in good.foods"
              :key="food.name"
              class="food-item">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control  :food="food" @add="onAdd"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
      </cube-scroll-nav>
    </div>
    <div class="shop-cart-wrapper">
       
      <shop-cart
        ref="shopCart"
        :select-foods="selectFoods"
        :delivery-price="seller.deliveryPrice"
        :min-price="seller.minPrice">
      </shop-cart>
    </div>
  </div>
</template>
<script>
import { getGoods } from 'api'
import CartControl from 'components/cart-control/cart-control'
import ShopCart from 'components/shop-cart/Shop-cart'
import SupportIco from 'components/support-ico/support-ico'
import Bubble from 'components/bubble/bubble.vue'
export default {
    data(){
        return {
            goods:[], //获取goods数组信息
            selectedFood:{}, // 已经选择的 商品 的详细信息，用于构建详情页面
            scrollOptions: {
             click: false,//防止左右两个Bs点击一个多次触发点击事件，但是若用preventdefault可能存在一些问题，
             //所以click：false两个据情况判定
             directionLockThreshold: 0
            },
        }
    },
    methods:{
        fetch(){
            if(!this.fetched){ //否则，当从其他组件切换过来，之前选中的状态都会清空
                this.fetched = true;
            
            getGoods().then((goods)=>{
                this.goods = goods
            })
            }
        },
        onAdd(target){ //cartcontrol传过来的点击时间的target-dom对象
            this.$refs.shopCart.drop(target)

        },
         // 点击进入详情页
        selectFood(food) {
          //获取所点击的商品的详细信息
                this.selectedFood = food
                // 显示详情页
                // console.log(food)
                this._showFood()
                this._showShopCartSticky()
        },
        _showFood() {
                this.foodComp = this.foodComp || this.$createFood({
                    $props: {
                      //当前点击的food信息传递
                        food: 'selectedFood'
                    },
                    $events: {
                        add: (el) => {
                            this.shopCartStickyComp.drop(el)
                        },
                        leave: () => {
                            this._hideShopCartSticky()
                        }
                    }
                })
                this.foodComp._show()
            },
            _showShopCartSticky() {
                this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
                    $props: {
                        selectFoods: 'selectFoods',
                        deliveryPrice: this.seller.deliveryPrice,
                        minPrice: this.seller.minPrice,
                        fold: true
                    }
                })
                this.shopCartStickyComp._show()
            },
            _hideShopCartSticky() {
                this.shopCartStickyComp._hide()
            }
    },
    props: {
      data: {
        type: Object,
        default() {  //default不是个方法就是个属性
          return {}
        }
      }
    },
    components:{
        SupportIco,
        ShopCart,
        CartControl,
        Bubble,
    },
    computed: {
      seller() {       
        return this.data.seller; //放到计算属性中   会后期改变  
        //放在data中容易   获取不到这个属性，    ，或者  更新另加watch来实现        
      },
      selectFoods(){
          let ret = [];
          //goods左边
          //foods右边
          this.goods.forEach((good)=>{
              good.foods.forEach((food)=>{
                  if(food.count){ 
                      //如果good的count不为0；
                      //good是一个对象
                      ret.push(food)
                  }
            
              })
          })
          
          return ret;
      },
      barTxts(){ //计算属性，因为数据需要响应式变化
          let ret = []
          this.goods.forEach((good)=>{
              const {type,name,foods} = good//给每一项good解构赋值
              let count = 0
              foods.forEach((food)=>{
                  count += food.count || 0
              })
              ret.push({
                  type,name,count
              })//对每一项good重新构造一个对象,有该项下面的选中food的综合count，有good的名字，有good的type
          })
          return ret;
      }

    }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
  .goods
    position: relative
    text-align: left
    height: 100%
    .scroll-nav-wrapper
      position: absolute
      width: 100%
      top: 0
      left: 0
      bottom: 48px
    >>> .cube-scroll-nav-bar //整个左侧导航栏
      width: 80px
      white-space: normal
      overflow: hidden
    >>> .cube-scroll-nav-bar-item
      padding: 0 10px
      display: flex
      align-items: center
      height: 56px
      line-height: 14px
      font-size: $fontsize-small
      background: $color-background-ssss
      .text
        flex: 1
        position: relative
      .num
        position: absolute
        right: -8px
        top: -10px
      .support-ico
        display: inline-block
        vertical-align: top
        margin-right: 4px
    >>> .cube-scroll-nav-bar-item_active
      background: $color-white
      color: $color-dark-grey
    >>> .cube-scroll-nav-panel-title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid $color-col-line
      font-size: $fontsize-small
      color: $color-grey
      background: $color-background-ssss
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      position: relative
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
        img
          height: auto
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: $fontsize-medium
          color: $color-dark-grey
        .desc, .extra
          line-height: 10px
          font-size: $fontsize-small-s
          color: $color-light-grey
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: $fontsize-medium
            color: $color-red
          .old
            text-decoration: line-through
            font-size: $fontsize-small-s
            color: $color-light-grey
      .cart-control-wrapper
        position: absolute
        right: 0
        bottom: 12px
    .shop-cart-wrapper
      position: absolute
      left: 0
      bottom: 0
      z-index: 50
      width: 100%
      height: 48px
</style>


