<template>
    <div class="tab-container">
        <cube-tab-bar
          :useTransition=false  
          :showSlider=true
          v-model="selectedLabel"
          :data="tabs"
          class="border-bottom-1px"
          ref='tabBar'
          >
          <!-- v-model表示当前选中了什么，点击是会去修改这个selectLabel ，吃出传入的是label，不是index -->
        </cube-tab-bar>
        <div class="slide-wrapper">
            <cube-slide 
            :loop = false
            :autoPlay= false
            :showDots = false
            :initialIndex = "index"
            :options =  "slideOptions"
             ref="slide" 
             @scroll="onScroll"
             @change="onChange"
            >
            
            <!-- 此处传进来的index便是set所获得的index' -->
            <!-- change事件scroll事件参数并非event，而是已经指定好 -->

            <!-- 重构--out -->
              <!-- <cube-slide-item >
                    <Goods></Goods>
              </cube-slide-item>
              <cube-slide-item >
                  <Ratings></Ratings>
              </cube-slide-item>
              <cube-slide-item >
                  <Seller></Seller>
              </cube-slide-item>-->
            
                <cube-slide-item v-for="(tab,index) in tabs" :key="'slide-item'+index" >
                    <component ref="component" :is="tab.component" :data="tab.data"></component>
                    
                 <!-- 给下一层传数据 -->
                </cube-slide-item>
            </cube-slide> 
        </div>

    </div>
</template>
<script>
//重构--，out
// import Goods from 'components/goods/Goods'
// import Ratings from 'components/ratings/Ratings'
// import Seller from 'components/seller/Seller'

export default {
    name:'tab',
    data(){
        return{
            index: this.initialIndex ,//调用该 组件 的时候 给该组件  传入  默认所处的 页面
            slideOptions: {
                listenScroll: true,
                probeType: 3,
                directionLockThreshold: 0, // 否则可能出现斜着滚动
            },
            //重构-- out
            // tabs:[ 
            //     {label:"商品", component: Goods, data: { }},
            //     {label:"评价", component: Ratings,data: { }},
            //     {label:"商家", component: Seller ,data:{ }} ],
        }

    },
    props: {
      tabs: {
        type: Array,
        default() {
          return []
        }
      },
      initialIndex: {
        type: Number,
        default: 0,
      }
    },
    methods:{
        //slide提供  scroll 事件和change事件
        onScroll(pos){ //参数是slide中scroll事件定好的 Object {x, y} -滚动位置的坐标值
            const tabBarWidth = this.$refs.tabBar.$el.clientWidth;
            const slideWidth = this.$refs.slide.slide.scrollerWidth;
            // console.log(tabBarWidth,slideWidth)
            const transform = -pos.x / slideWidth * tabBarWidth;
            this.$refs.tabBar.setSliderTransform(transform);

        },
        onChange(current){//参数是slide中change事件已经定好的，是    当前页面的索引值
            this.index = current;
            //切到某一个tab下为请求数组的最好的时机，
            const instance = this.$refs.component[current]  //获取当前组件实例
                if (instance && instance.fetch) {
                instance.fetch() //调用该组件实例上的fetch方法，获取数据
                //!!!!!!!!!!!!!么讴歌组件都应该有自己的fetch组件
            }
        }


    },
    mounted() {
      this.onChange(this.index)//onchange事件 是每次划入的时候都会执行，但是第一次没有执行
      //这里是对刚加载的时候执行一次onchange事件，获取到该页面上的goods数据
      
    },
    computed:{
        selectedLabel:{
            get(){
                // console.log(newVal)//直接这样 还会有获得其他的数据

                // 根据index，从tabs中获取  当前tab
                // console.log(this.tabs[this.index].label);
                return this.tabs[this.index].label;
            },
            set(newVal){
                //  每次点击 组件内部 会修改 双向绑定的 selectLabel，
                //  set用于寻找 当前的index，并修改
                //  index可用于  上下联动时候的定位
                this.index = this.tabs.findIndex((value)=>{return value.label === newVal})
                // console.log(newVal)
            }
        }

    },
    //重构 --  del
    // components:{
    //     Goods,
    //     Ratings,
    //     Seller
    // }
    
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
.tab-container
    display: flex
    flex-direction: column
    height: 100%
    >>> .cube-tab
      padding: 10px 0
    .slide-wrapper
      flex: 1
      overflow: hidden




</style>


