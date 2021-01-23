import React, { Component } from 'react';
import {Modal} from 'antd'
import { withRouter} from 'react-router-dom'

// 引入样式文件
import './header.less'


// 调用storage储存工具
import storageUtils from '../../utils/storageUtils' 
import GetTime from '../../utils/format-date'
import LinkButton from '../linkButton/linkButton'
import {reqWeather} from '../../api/index'  // 发送天气请求，非默认输出要用{}

import menuList from '../../config/menuConfig'  // 引入导航栏数据文件

class Header extends Component {
    state={    // state值每次更新就会重新渲染
        currentTime:GetTime(Date.now()),
        dayPictureUrl:'',
        weather:'',
        title:''
    }

    // 每个1s获取一次当前时间，更新状态数据：render每隔1s渲染一次
    getTime=()=>{
        this.intervalId = setInterval(()=>{  // 获取interval的Id
            const currentTime = GetTime(Date.now())// 每隔1s获取一次时间
            this.setState({currentTime})  // 并更新state值
        // console.log(this.state.currentTime)
        },1000) 
        // console.log(this.intervalId)
    }
    
    // 调用API接口函数，获取天气：异步函数要在await中读取
    getWeather=async()=>{
        const {dayPictureUrl,weather} = await reqWeather('北京')
        this.setState({dayPictureUrl,weather})
    }
    componentDidMount(){
        this.getWeather()
        this.getTime()
    }
    // 卸载此组件时清除定时器，否则会一直更新
    componentWillUnmount(){
        clearInterval(this.intervalId)  
    }

    // 点击退出，清除用户登录状态
    logout=()=>{
        Modal.confirm({  /* antd组件：弹出对话框 */
            title: '是否确认退出？',
            onOk: ()=>{  // 这里要使用箭头函数，解决this的问题
                // 退出时删除页面用户信息
                storageUtils.removeUser()
                // 跳转链接到登录界面
                this.props.history.replace('/login') // 需要包装成路由组件：路由组件才有history,location,match
            },
            onCancel:()=>{
                return ''
            } 
          });
    }

     // 根据请求的path，显示对应标题
     getTitle=()=>{
        const path = this.props.location.pathname 
        let title
        menuList.forEach(item =>{  // 查找一级导航
            if(item.key === path){
                title = item.title
            } else if(item.children){  // 查找二级导航
                const cItem = item.children.find(item=> path.indexOf(item.key)===0)
                    if(cItem) {
                       title = cItem.title
                    }
            } 
        })
        return title 
    }

    // 渲染
    render() {
        const path = this.props.location.pathname 
        const {currentTime,dayPictureUrl,weather} = this.state
        const user = storageUtils.getUser()  // 获取storageUtils里的用户信息
        const title = this.getTitle(path)  // 每次刷新都重新获取title
       
        return (
        <div className="header">
            <div className="header-top">
                <span className="header-top-user">Hello {user.username}</span>
                <LinkButton onClick={this.logout}>退出</LinkButton>
            </div>
            <div className="header-bottom">
                <div className="header-bottom-left">
                    {title}
                    <div className="triangle"></div>
                </div>
                <div className="header-bottom-right">
                    <span>{currentTime}</span>
                    <img src={dayPictureUrl} alt="weather" />
                    <span>{weather}</span>
                </div>
            </div>
        </div>
        );
    }
}

export default withRouter(Header);