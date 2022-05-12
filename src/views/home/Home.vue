<template>
    <div id="home">
            <nav-bar>
                    <template v-slot:default>图书兄弟</template>
            </nav-bar>


        <tab-control v-show="isTabFixed" @tabClick="tabClick" :titles="['畅销', '新书', '精选']"></tab-control>

        <div  class="wrapper">
                <div class="content">
                    <div ref="banref">

                        <home-swiper :banners="banners"></home-swiper>

                        <recommend-view :recommends="recommends"></recommend-view>

                    </div>

                    <tab-control @tabClick="tabClick" :titles="['畅销', '新书', '精选']"></tab-control>

                    <goods-list :goods="showGoods"></goods-list>
                </div>
            </div>

        <back-top @bTop="bTop" v-show="isTabFixed"></back-top>

    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import RecommendView from "./ChildComps/RecommendView";
    import TabControl from "components/content/tabControl/TabControl";
    import GoodsList from "components/content/goods/GoodsList";
    import BackTop from "components/common/backtop/BackTop";
    import HomeSwiper from "./ChildComps/HomeSwiper";
    import {getHomeAllData, getHomeGoods} from 'network/home';
    import {ref, reactive, onMounted,computed, watchEffect, nextTick} from 'vue'

    import BScroll from 'better-scroll'


    export default {
        name: "Home",
        components: {
            NavBar,
            RecommendView,
            TabControl,
            GoodsList,
            BackTop,
            HomeSwiper
        },
        setup() {

            let isTabFixed = ref(false);

            const recommends = ref([]);

            let currentType = ref('sales');

            let banref = ref(null);

            const banners = ref([]);

            const goods = reactive({
                sales: {page:1, list:[]},
                new: {page:1, list:[]},
                recommend:{page:1, list:[]}
            })

            const showGoods = computed(()=>{
                    return goods[currentType.value].list;
            })


            let bscroll = null;
            onMounted(()=>{



                getHomeAllData().then(res=>{
                    //console.log(res.goods.data);
                    recommends.value = res.goods.data;
                    banners.value = res.slides;
                })

                getHomeGoods('sales').then(res=>{
                    goods.sales.list = res.goods.data;
                })

                getHomeGoods('recommend').then(res=>{
                    goods.recommend.list = res.goods.data;
                })

                getHomeGoods('new').then(res=>{
                    goods.new.list = res.goods.data;
                })


                bscroll = new BScroll(document.querySelector('.wrapper'),{
                    click:true,
                    pullUpLoad:true,
                    probeType:3
                });

                bscroll.on('scroll', (position)=>{
                    console.log('当前位置：'+(-position.y));

                    isTabFixed.value = (-position.y) >= banref.value.offsetHeight

                    console.log(banref.value.offsetHeight);


                })

                bscroll.on('pullingUp', ()=>{
                    console.log('上拉加载更多.....')

                    const page = goods[currentType.value].page + 1;
                    getHomeGoods(currentType.value, page).then(res=>{
                        goods[currentType.value].list.push(...res.goods.data)
                        goods[currentType.value].page += 1;
                    })


                    bscroll.finishPullUp();
                    bscroll.refresh();

                    console.log('当前类型：'+currentType.value+",当前页："+page)
                })



            })

            const tabClick = (index) =>{
                let types = ['sales', 'new', 'recommend'];


                currentType.value = types[index];

                nextTick(()=>{
                    bscroll && bscroll.refresh();
                })

            }

            const bTop = ()=>{
                bscroll.scrollTo(0, 0, 500);
            }

            watchEffect(()=>{
                nextTick(()=>{
                    bscroll && bscroll.refresh();
                })

            })

            return {
                recommends,
                currentType,
                tabClick,
                goods,
                showGoods,
                isTabFixed,
                banref,
                bTop,
                banners
            }
        }

    }
</script>

<style scoped lang="scss">
    .banner {
        img {
            width: 100%;
            height: auto;
        }
    }

    #home {
        height: 100vh;
        position: relative;
    }


    .wrapper {
        position: absolute;
        top:45px;
        bottom: 50px;
        left:0px;
        right:0px;
        overflow: hidden;
        .content {

        }
    }

</style>