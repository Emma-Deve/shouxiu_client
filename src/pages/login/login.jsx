import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'

import './login.less'  // 引入样式文件

import {connect} from 'react-redux'
import {login} from '../../redux/actions'

// antd样式
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '../../assets/images/logo.png'  // 引入标题部分的图片
   

class Login extends Component {

    login = async (values) => {  // 4.x版本的antd会自己处理错误
        const {username,password} = values
        this.props.login(username,password)  // 发送异步action登陆请求
    }

      自定义表单验证条件
      validator=(rule, value)=>{  // rule和value都不能省
        if (!value) {
          return Promise.reject('password is required')
        } else if(value.length<4) {
            return Promise.reject('4 letters at least')
        } else if(value.length>12) {
            return Promise.reject('12 letters at most')
        } else if(!/^[a-zA-Z0-9_]+$/) {
            return Promise.reject('password have to contain numbers, letters and uderlines')
        } else { return Promise.resolve()}
    }
    
    render() {

        // 判断用户是否已经登录，如果已经登录直接调转到主页面
        const user = this.props.user  // 获取redux中的state：user

        // 如果登陆成功，跳转到主页
        if(user&&user._id){
            return <Redirect to='/home'/>
        } 
        const errorMsg = this.props.user.errorMsg  // 如果用户名或密码错误，显示错误信息

        // 否则显示以下内容
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>  {/* 将图片文件作为一个变量引入，背景图片在less文件中设置 */}
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section name="normal_login" className="login-content">
                    <span style={{color:'red'}}>{errorMsg}</span>
                    <h2>用户登录</h2>
                   {/*  登陆表单-antd库 */}
                    <Form className="login-form"
                        initialValues={{remember: true,}}
                        onFinish={this.login}
                    >
                        <Form.Item  // username输入框
                        // 设置用户名和密码的判断规则规则：必须输入，4-12位，英文+数字或下划线组成
                        // 方法一：直接用rules判断
                            name="username"  
                            rules={[  
                                { required: true, whitespace:true, message: 'Username is required' },  // 必须输且不能为空格
                                { min: 4, message: '4 letters at least' },
                                { max: 12, message: '12 letters at most' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username have to contain numbers, letters and uderlines' },  // 正则表达式
                            ]}  
                            initialValue={"admin"}  // 设置用户名默认值
                                           
                        >
                        
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item  // 密码输入框
                        // 方法二：用validator函数自定义判断规则：通常用于复杂的判断
                            name="password"
                            rules={[
                                // {required: true, whitespace:true, message: 'Username is required'}
                                {validator:this.validator},
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        
                        <Form.Item>  {/* 提交按钮 */}
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                login
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        );
    }
}



export default connect(
    state=>({
        user: state.user,
        errorMsg:state.errorMsg
    }),
    {login}
)(Login) // withRouter为高阶组件，给非路由组件传递3个props属性


/* 
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