import { combineReducers } from "redux";
import storageUtils from "../utils/storageUtils";

import {SET_HEAD_TITLE, RECEIVE_USER, ERROR_MSG,RESET_USER} from './action-types'


// 注意：reducer函数一定不能修改原有的state数据，如state.errorMsg=errorMsg
// 定义顶部标题reducer函数
const initHeadTitle = '首页'
function headTitle (state = initHeadTitle, action){
    switch(action.type){
        case SET_HEAD_TITLE:
            return action.data  // 直接获取当前action传递过来的标题名称
        default:
            return state
    }
}

// 定义用户reducer函数
const initUser = storageUtils.getUser()  // 初始值从storage里面读取
function user (state = initUser, action){
    switch(action.type){
        case RECEIVE_USER:
            return action.user
        case ERROR_MSG:
            const errorMsg = action.errorMsg  // errorMsg为string类型，user得到的state类型为对象，数据格式要统一
            return {...state, errorMsg}   // 统一数据类型为对象
        case RESET_USER:
            return action.clearUser  
        default:
            return state
    }
}


// 暴露多个reducer函数
export default combineReducers({
    headTitle,
    user
})

/* 
reducer产生的state为对象格式：
    state:{
        headTitle：'首页',
        user: {}
    }
需要用到headTitle的state：state.headTitle = '首页'
需要用到user的state：state.user = {}
*/