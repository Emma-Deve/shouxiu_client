import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom'

// 引入样式文件
import './left-nav.less'

// 引入图片
import logo from '../../assets/images/logo.png'

// 引入侧边导航栏数据文件
import menuList from '../../config/menuConfig'

// 引入antd样式
import { Menu} from 'antd';

import storageUtils from '../../utils/storageUtils'  // 调用storage储存工具


const { SubMenu } = Menu;  // antd 表单组件


class LeftNav extends Component {

    state = {
        menuNodes:[] 
    }

    // 获取有权限的导航栏item
    hasAuth=(item)=>{
        /* 当前账号各种信息存在storage中：其中item的权限在 application-storage-role-menus 中有显示。
        遍历menuList时，当其中的item 在menus中存在时，说明有此权限，返回true，生成标签，否则返回false*/
        const {key, isPublic,children} = item
        const userMessage = storageUtils.getUser() 
        const {username} = userMessage
        const {menus} = userMessage.role  // storage中的menus权限
        /* 如下情况返回true，反则为false
        1. admin有所有权限：username === 'admin'为true
        2. 首页默认都可见：在menuList中设置isPublic=true，布尔值
        3. item中的key在menus中能找到: menus.indexOf(key)!==-1 返回布尔值 
        4. key.children 中的key 在menus中能找到：!!children.find(item=>menus.indexOf(item.key)!==-1)*/
        if(username === 'admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        } else if(children){
            return !!children.find(item=>menus.indexOf(item.key)!==-1)  // 将数据类型变成布尔值
        }
        return false
    }

    // 根据导航栏数据生成导航目录：map() + 递归(一级导航 + 二级导航 + ..级导航)
    getMenuNodes=(menuList)=>{
        const path = this.props.location.pathname  // 获取当前打开路径
        
        return menuList.map(item => {
            // 如果当前用户有此item的权限，生成菜单项，没有则不生成
            if(this.hasAuth(item)){
                // 一级目录：如果item没有childen，用<menu.Item>生成一级导航目录
                if(!item.children) {
                    return ( /* antd 格式 */
                        <Menu.Item className="lef-nav-menu-item" key={item.key} icon={item.icon}>
                            <Link to={item.key}>{item.title}</Link>
                        </Menu.Item>
                    )
                } else {
                // 二级目录：如果打开路径匹配到了二级路径，返回对应一级路径
                    if(item.children.find(cItem=>path.indexOf(cItem.key) === 0)){  // 用indexOf还可以匹配到子路径的路由路径
                        this.openKey=item.key
                    }
                    return (
                        <SubMenu className="lef-nav-subMenu" key={item.key} icon={item.icon} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }
           
        })
    }

    // 在第一次render前执行一次
    UNSAFE_componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {

        let selectKey = this.props.location.pathname
        const openKey = this.openKey
        console.log(selectKey)

        // 处理/product 下级路由页不能选中的的debugger:匹配所有/product(包括所有/product/xxx)*/
        if(selectKey.indexOf('/product') !== -1){
            selectKey = '/product'
        }

        return (            
            <div className="left-nav"> 

                {/* // 左侧栏标题，点击标题回到home页面 */}
                <Link  to='/home'  className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h3>硅谷后台</h3>
                </Link>

                {/* 从antd引入导航菜单样式，设置link路径，与admin中的对应路由链接一致，每次只显示一个路由组件 */}
                {/* 获取动态的页面路径selectedKeys; defaultSelectedKeys只能打开第一次指定的路径*/}
                <Menu className="lef-nav-menu" selectedKeys={[selectKey]} defaultOpenKeys={[openKey]} mode="inline" theme="dark"> 

                {/* 根据数据文件渲染导航 */}
                { this.menuNodes }
                </Menu> 
            </div>                        
            
        )
    }
}

export default withRouter(LeftNav);  // withRouter为高阶组件，给非路由组件传递3个props属性