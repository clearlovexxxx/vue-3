import axios from 'axios';
import {Notify, Toast} from 'vant';
import router from '../router'

export function request(config){

    const instance = axios.create({
        baseURL:'https://api.shop.eduwork.cn',
        timeout:5000
    });

    //请求拦截
    instance.interceptors.request.use(config=>{
        // 如果API需要认证， 在这统一设置
        const token = window.localStorage.getItem('token');

        if(token) {
            config.headers.Authorization = 'Bearer '+token;
        }

        return config;
    }, err=>{

    })

    //响应拦截
    instance.interceptors.response.use(res=>{


        return res.data ? res.data : res;
    }, err=>{
        // 如果没有授权， 去login
        if(err.response.status == '401') {
            Toast.fail('请先登录')
            router.push({path:'/login'})
        }

        // 如果有错误， 在这里可以提示
      //  Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0]);
        Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0])
    })

    return instance(config)
}