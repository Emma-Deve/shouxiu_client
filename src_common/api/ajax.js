/* 发送ajax请求 的 函数模块，需要：
1. 用axios 实现数据的请求 */

// 引入axios
import axios from 'axios'
import { message } from 'antd'

// 编写ajax请求函数
    /* ajax函数包含三个参数：
        路径：url，
        数据内容：data ，包含所有接受的参数名和参数值，如果传过来的值为对象，可以不用加{}，如user，
            如果传过来的值为其他类型，一定要加{} 如{_id}。为了以防有些请求没有data内容，定义一个初始值{}，空对象：data={}
        数据请求方式：method，GET是最常用的请求，所以给定初始默认方式GET：method="GET"，接口函数发送的是GET请求时可以不写
        语法不确定时去github上查*/
export default async function ajax(url, data={}, method='GET'){
    let result={}
    try {
        if(method==="GET"){
            result = await axios.get(url, {params:data})
        } else {
            result = await axios.post(url, data)
        }    
    } catch (error) {
        message.error(error.message)
    }
    return result.data  // 必须return才能拿到请求结果：获取promise对象里面的data，返回的是一个只包含data的对象
}

/* 总结：
promise/then：如果需要得到返回结果，需要在外层再封装一层Promise（resolve，reject）函数
async/await：直接能得到异步函数的返回结果
两种情况的得到的return结果都是promise对象，需要用 await 才能取到data值 */