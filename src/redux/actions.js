
import {SET_HEAD_TITLE, RECEIVE_USER, ERROR_MSG,RESET_USER} from './action-types'
import {reqLogin} from '../api/index'
import storageUtils from '../utils/storageUtils'


// 同步的action，返回的是对象:{tye:'', date:'xx'}
// 更新标题的同步action
export const setHeadTitle = (headTitle)=> ({type:SET_HEAD_TITLE, data:headTitle})
// 退出登陆同步action
export const logout = () =>{
    storageUtils.removeUser()
    return {type:RESET_USER, clearUser:{}}
}

 
// 发送ajax请求的异步action：返回的是函数: dispatch => {}
// 请求后分发的同步action: 供异步action调用
export const receiveUser = (user) => ({type: RECEIVE_USER, user})  //成功的同步action
export const showErrorMsg = (errorMsg) => ({type: ERROR_MSG, errorMsg})  //失败的同步action
// 异步ajax请求的action
export const login = (username, password) => {
    return async dispatch => { 
         // 1.发送异步ajax请求
        const res = await reqLogin(username, password)
        // 2.异步任务执行完成时，分发一个同步action，必需
        if(res.status===0){  // 请求成功，分发成功的同步action
            const user = res.data
            storageUtils.saveUser(user)  // 将user信息保存到storage中，组件刷新时需要读取初始值
            dispatch(receiveUser(user))
        } else {  // 请求失败，分发失败的同步action
            const errorMsg = res.msg
            dispatch(showErrorMsg(errorMsg))
        }
    }
} 

