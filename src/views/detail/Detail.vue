<template>
    <div id="detail">
        <nav-bar>
            <template v-slot:default>商品详情:{{id}}</template>
        </nav-bar>

        <van-image style="margin-top:50px"
                   width="100%"
                   lazy-load
                   :src="detail.cover_url"
        />

        <van-card style="text-align: left"
                  :num="detail.stock"
                  :price="detail.price+'.00'"
                  :desc="detail.description"
                  :title="detail.title"
        >
            <template #tags>
                <van-tag plain type="danger">新书</van-tag>
                <van-tag plain type="danger">推荐</van-tag>
            </template>
            <template #footer>
                <van-button type="warning" @click="handleAddCart">加入购物车</van-button>
                <van-button type="danger" @click="goToCart">立即购买</van-button>
            </template>
        </van-card>

        <van-tabs v-model="active">
            <van-badge :content="detail.comments.length" max="99">
                <div class="child" />
            </van-badge>
            <van-tab title="概述">
                <div class="con" v-html="detail.details"></div>
            </van-tab>
            <van-tab title="热评">
                <div v-if="detail.comments.length==0" class="con">
                    该商品还没有评论，快去发表评论吧！
                </div>
            </van-tab>
            <van-tab title="相关图书">
                <goods-list :goods="like_goods"></goods-list>

            </van-tab>

        </van-tabs>


    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import GoodsList from "components/content/goods/GoodsList";
    import {useRoute, useRouter} from 'vue-router';
    import {useStore} from 'vuex';
    import {ref, onMounted, reactive, toRefs} from 'vue';
    import {getDetail} from "network/detail";
    import {addCart} from 'network/cart'
    import {Toast} from 'vant'

    export default {
        name: "Detail",
        components: {
            NavBar,
            GoodsList
        },
        setup() {
            let  active = ref(1);
            const route = useRoute();
            const router = useRouter();
            const store = useStore();

            let id = ref(0);
            let book = reactive({
                detail:{
                    comments:[]
                },
                like_goods:[]
            });

            onMounted(()=>{
                id.value = route.query.id;

                getDetail(id.value).then(res=>{
                    book.detail = res.goods;
                    console.log(res.goods);
                    book.like_goods = res.like_goods;

                })
            })

            // 添加购物车
            const handleAddCart = () =>{
                addCart({goods_id:book.detail.id, num:1}).then(res=>{
                    if(res.status == '201' || res.status == '204') {
                        Toast.success('添加成功')
                        store.dispatch('updateCart');
                    }
                })
            }

            // 立即购买
            const goToCart = () =>{
                addCart({goods_id:book.detail.id, num:1}).then(res=>{
                    if(res.status == '201' || res.status == '204') {
                        Toast.success('添加成功,显示购物车')
                        router.push({path:'/shopcart'})
                        store.dispatch('updateCart');
                    }
                })
            }

            return {
                id,
                ...toRefs(book),
                active,
                handleAddCart,
                goToCart
            }
        }
    }
</script>

<style  lang="scss">
    #detail {
        .van-card__title {
            font-size:20px;
            font-weight: bold;
            height:30px;
            line-height:30px;
            margin:10px 0px;
        }
        .van-card__desc {
            margin-bottom: 10px;
        }
        .van-tag {
            margin-right:10px;
            margin-bottom: 10px;
        }
        .van-card__footer {
            margin-top:10px;
        }
        .van-badge--fixed {
            position: relative;
            top:-35px;
            right:-5px;
        }

    }

    .con {
        padding:10px;
        min-height: 200px;
    }


</style>
