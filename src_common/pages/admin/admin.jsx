import React, { Component } from 'react';
import {Redirect,Switch,Route} from 'react-router-dom'


// 调用storage储存工具
import storageUtils from '../../utils/storageUtils' 
// import memoryUtils from '../../utils/memoryUtils' 

// 引入样式文件
import './admin.less'

// 引入antd样式
import { Layout } from 'antd'

// 引入组件文件
import LeftNav from '../../components/lef-nav/left-nav'
import Header from '../../components/header/header'
// 引入路由组件
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

// antd中的layout组件
const {Footer, Sider, Content } = Layout;  // 只能写到import下面

class Admin extends Component {
    render() {
        // 判断用户是否已经登录，如果已经登录直接调转到主页面
        const user = storageUtils.getUser()  // 获取storageUtils里的用户信息

        if(!user._id){return <Redirect to='/login'/>}  // 如果用户存在，跳转到登陆页面

        // 否则显示一下内容
        return (

               //从ant引入布局样式
            <Layout className="layout">
                <Sider className="layout-sider">
                    <LeftNav/>
                </Sider>
                <Layout className="layout-layout">
                    <Header/>
                    <Content className="layout-layout-content">
                        {/* 中间内容部分由路由组件组成：对应导航栏用<Link to="">用同样的路径，每次只显示一个路由组件，用switch */}
                        {<Switch>
                            <Route path="/home" component={Home}/>
                            <Route path="/category" component={Category} />
                            <Route path="/product" component={Product} />
                            <Route path="/user" component={User} />
                            <Route path="/role" component={Role} />
                            <Route path="/charts/bar" component={Bar} />
                            <Route path="/charts/line" component={Line} />
                            <Route path="/charts/pie" component={Pie} />
                            <Redirect to="/home"/>
                        </Switch>}
                    </Content>
                    <Footer  className="layout-layout-footer">推荐使用谷歌浏览器，可以获得更加页面操作体验</Footer>
                </Layout>
            </Layout>
            
        );
    }
}

export default Admin;