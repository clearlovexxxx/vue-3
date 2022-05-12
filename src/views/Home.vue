<template>
  <div class="home">

  {{recommends}}
  <!--  <img alt="Vue logo" src="@/assets/images/1.png">-->
    <img src="~assets/images/2.png" alt="">

    <br>

    <div class="box">

    </div>

<!--    <img :src="uimg" alt="">
    <br>-->


    <HelloWorld msg="Welcome to Your Vue.js App"/>


  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {ref, reactive, toRefs, onMounted} from 'vue'
import  {getHomeAllData} from 'network/home'
export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  setup() {
        const recommends = ref([]);

        const data = reactive({
            name:'aaa',
            uimg:require('@/assets/images/22.png'),


        })

        onMounted(()=>{
            getHomeAllData().then(res=>{
              console.log(res);

                recommends.value = res.goods.data;
            })
        })

        return {
              ...toRefs(data),
            recommends
        }

  }
}
</script>

<style>
  .box {
    width:200px;
    height:200px;
    background: url('~assets/images/11.png');
  }
</style>
