import React, { Component } from 'react';
import {Modal} from 'antd'
import { withRouter} from 'react-router-dom'

// 引入样式文件
import './header.less'

// 自定义组件
import GetTime from '../../utils/format-date'
import LinkButton from '../linkButton/linkButton'
import {reqWeather} from '../../api/index'  // 发送天气请求，非默认输出要用{}
// redux
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'


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
                this.props.logout()                
            },
            onCancel:()=>{
                return ''
            } 
          });
    }
     
    // 渲染
    render() {        
        const {currentTime,dayPictureUrl,weather} = this.state
        const user = this.props.user  //  获取redux中的state - user      
        const title = this.props.headTitle  // 获取redux中的state - headTitle
       
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




export default connect(
    state=>({
        headTitle: state.headTitle,
        user:state.user
    }),
    {logout}
)(withRouter(Header)) // withRouter为高阶组件，给非路由组件传递3个props属性

/* 也可以将state和dispatch函数拆出来写成如下形式：没有state｜dispatch，connect第1/2个参数写成null */
// const mapStateToProps = {
//   headTitle: state.headTitle,
//   user:state.user
// }
// const mapDispatchToProps = {
//   logout
// }
// export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Header))


/* 解释：
reducer产生的state为对象格式：
    state:{
        headTitle：'首页',
        user: {}
    }
需要用到headTitle的state：state.headTitle = '首页'
需要用到user的state：state.user = {}

展示组件Header：自动接收容器组件header-container传递过来的state属性和dispatch的action，直接调用state属性/action方法：
this.props.headTitle/setHeadTitle(arg)
在需要接受state的地方用：this.props.counter
在需要更新state的地方用：this.props.increment(arg)
*/