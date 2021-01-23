/* 应用项目根文件 */

// 各种库
import React, { Component } from 'react';  // react库
import {BrowserRouter, Route, Switch} from 'react-router-dom'  // 路由库

// 样式文件
import './App.less'  

//组件文件
import Login from './pages/login/login'
import Admin from './pages/admin/admin'


class App extends Component {
    render() {
        return (
            <BrowserRouter>  {/* 第一层路由外面要写在浏览器路由中 */}
                <Switch>
                    <Route path='/login' component={Login}/>
                    <Route path='/' component={Admin}/>  {/* path='/'表示根目录 */}
                    {/* <Redirect path=''/> */}
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;