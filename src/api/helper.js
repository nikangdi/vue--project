import axios from 'axios'

const ERR_OK = 0;//请求并成功返回数据，成功的状态

const baseUrl = process.env.NODE_ENV==="development"?'/':'http://ustbhuangyi.com/sell/';

//函数柯里化用于实现当同一个请求地址时，不同params的情况，会返回一些不同的get请求方法
export function get (url){
    return function(params){
        return axios.get(baseUrl+url,{params}).then(res=>{
            const {errno,data} = res.data;
            if(errno === ERR_OK){
                return data;
            }
        }).catch(e=>{})
    }
}