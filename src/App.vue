<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
    	  <router-link to="/goods" class="tab-item">商品</router-link>
    	  <router-link to="/ratings" class="tab-item">评论</router-link>
    	  <router-link to="/seller" class="tab-item">商家</router-link>
    </div>
    <div class="content">
       <keep-alive>
         <router-view :seller="seller"></router-view>
       </keep-alive>
    </div>
  </div>
</template>

<script>
 import vHeader from '@/components/header/header';
 import {urlParsea} from './common/js/util.js';
 const ERR_OK = 0;
 export default {
   name: 'app',
   data () {
     return {
       seller: {
        id: (() => {
          let queryParam = urlParsea();
          return queryParam.id;
        })()
       }
     };
   },
   mounted () {
     this.axios.get('/api/seller?id=' + this.seller.id).then((res) => {
       res = res.data;
       if (res.errno === ERR_OK) {
         this.seller = Object.assign({}, this.seller, res.data);
       };
     });
   },
   components: {
     vHeader
   }
 };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'
  .tab
    height: 40px
    line-height: 40px
    width: 100%
    display: flex
    boderbottom (rgba(7,17,27,0.1))
    .tab-item
      flex: 1
      text-align: center
      display: block
      font-size: 14px
      color: rgb(77,85,93)
      &.active
        color: rgb(240,20,20)
</style>
