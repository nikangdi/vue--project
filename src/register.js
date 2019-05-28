// cube-ui 的 creatapi
//Api式组件
//通过 createAPI 把 Hello.vue 变成一个 API 式调用的组件并调用

import {createAPI} from 'cube-ui'
import Vue from 'vue'
import HeaderDetail from 'components/header-detail/header-detail'
import ShopCartList from 'components/shop-cart-list/shop-cart-list'
import ShopCartSticky from 'components/shop-cart-sticky/shop-cart-sticky'
import Food from 'components/food/food'


createAPI(Vue, HeaderDetail)
createAPI(Vue, ShopCartList)
createAPI(Vue, ShopCartSticky)
createAPI(Vue, Food)
