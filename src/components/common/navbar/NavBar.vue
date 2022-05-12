<!--
 * @Description: 做个俗人 贪财好色  一身正气
 * @Version: 2.0
 * @Autor: CoCo
 * @Date: 2022-04-24 04:10:42
 * @LastEditors: CoCo
 * @LastEditTime: 2022-04-24 13:25:57
-->
<template>
        <div class="nav-bar">
            <div @click="goback" class="left">
                <slot name="left">
                    <img src="~assets/images/left.png" alt="">
                </slot>
            </div>
            <div class="center">
                <slot>EWShop</slot>
            </div>
            <div class="right">
                <slot name="right"></slot>
            </div>
        </div>
</template>

<script>
    import {useRouter} from 'vue-router';
    export default {
        name: "NavBar",
        setup() {
            const router = useRouter();

            const goback=()=>{
                router.go(-1);
            }

            return {
                goback
            }
        }
    }
</script>

<style scoped lang="scss">
    .nav-bar {
        background:var(--color-tint);
        color:#fff;
        position: fixed;
        left:0;
        right:0;
        top:0;
        z-index: 9;
        height:45px;
        line-height: 45px;
        text-align: center;
        display: flex;
    }
    .left, .right {
        width:60px;
        padding:12px;

    }

    .left img {
        width:25px;
        height:25px;
    }
    .center {

        flex: 1;
    }

</style>