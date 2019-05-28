<template>
    <div class="header-container">
        <div class="content-wrapper">
            <div class="avatar">
                <img width="64" height="64" :src="seller.avatar">
            </div>
            <div class="content">
                <div class="title">
                  <span class="brand"></span>
                  <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                  {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                  <support-ico :size=1 :type="seller.supports[0].type"></support-ico>
                  <span class="text">{{seller.supports[0].description}}</span>
                </div>
                <div v-if="seller.supports" class="support-count" @click='showDetail'>
                <!-- 这条于具有小技巧 undefined【0】报错  解决深层嵌套数据问题-->
                    <span class="count">{{seller.supports.length}}个</span>
                    <i class="icon-keyboard_arrow_right"></i>
                </div>
            </div>

        </div>
        <div class="bulletin-wrapper" @click='showDetail'>
            <span class="bulletin-title"></span>
            <span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="background">
            <img :src="seller.avatar" width="100%" height="100%">
        </div>

    </div>
</template>
 <script>
 import SupportIco from 'components/support-ico/support-ico'
 export default {
     
     props:['seller'], //seller数据对象
     methods:{
         showDetail() {
             //  api式组件显示
             
             //有的话直接用，没有的话创建  creat-api
             //通过   createAPI 把 Hello.vue 变成一个 API 式调用的组件并调用
             //实例化这个组件   const instance = this.$createAaBb(config, renderFn, single) 
             //就是  一个对象  ，可以调用实例 中的 方法 和 属性 ！！！！！！
             //  而且这个实例化组件的元素是被附加到 body 元素下的
             // remove 方法 如果调用了，该实例就会被销毁且会从 body 下移除
             //.show() 方法调用了   该api式组件就会显示出来
            this.headerDetailComp = this.headerDetailComp || this.$createHeaderDetail({
                $props: {
                    seller: 'seller'//传递给子组件的config中有$props  $events
                }
            })
            //??????
            //因为this.headerDetailComp返回的是一个组件 的实例 ，故 可以调用  其中 的方法
            this.headerDetailComp._show()
            // console.log(this.headerDetailComp.visible)//  成功的
         }

     },
     components:{
        'support-ico': SupportIco,
     }
 }
 </script>

 <style lang="stylus" scoped>
 @import "~common/stylus/mixin"
 @import "~common/stylus/variable"
 .header-container
    position: relative //有一些会用到定位,设置背景的时候用到了相对定位层级,
    overflow: hidden
    color: $color-white
    // background-color: green //content-wrapper 与 bulletin共同撑开了header-container
    background: $color-background-ss
    .content-wrapper
        position: relative //有一些会用到定位, 设置背景的时候用到了相对定位层级,
        display:flex
        align-items :center
        padding: 24px 12px 18px 24px
        .avatar
            // flex: 0 0 64px
            width: 64px
            margin-right: 16px
            img
                border-radius: 4px
        .content
            flex: 1  
            // background-color :pink
            .title
                display:flex
                align-items: center
                margin-bottom: 8px
                .brand
                    width: 30px
                    height: 18px
                    bg-image('brand')
                    background-size: 30px 18px
                    background-repeat: no-repeat
                .name
                    margin-left: 6px
                    font-size: $fontsize-large
                    font-weight: bold
            .description
                margin-bottom: 8px
                line-height: 12px
                font-size: $fontsize-small
            .support
                display: flex
                align-items: center
                .support-ico
                  margin-right: 4px
                .text
                  line-height: 12px
                  font-size: $fontsize-small-s
        .support-count
            position: absolute
            right: 12px
            bottom: 14px
            display: flex
            align-items: center
            padding: 0 8px
            height: 24px
            line-height: 24px
            text-align: center
            border-radius: 14px
            background: $color-background-sss
            .count
              font-size: $fontsize-small-s
            .icon-keyboard_arrow_right
              margin-left: 2px
              line-height: 24px
              font-size: $fontsize-small-s

    .bulletin-wrapper
         position: relative
         display: flex
         align-items: center
         height: 28px
         line-height: 28px
         padding: 0 8px
         background: $color-background-sss
        .bulletin-title
            flex: 0 0 22px
            width: 22px
            height: 12px
            margin-right: 4px
            bg-image('bulletin')
            background-size: 22px 12px
            background-repeat: no-repeat
        .bulletin-text
            flex: 1
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            font-size: $fontsize-small-s
        .icon-keyboard_arrow_right
            flex: 0 0 10px
            width: 10px
            font-size: $fontsize-small-s
    .background 
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: -1
        filter: blur(10px) //滤镜 


 </style>
 
 