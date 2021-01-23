import Header from '../components/header/header'// 展示组件
import {connect} from 'react-redux'
import {setHeadTitle} from '../redux/actions'


// header组件的容器组件，连接redux和header，向header组件传递state和actions
export default connect(
    state=>({headTitle: state.headTitle}),
    {setHeadTitle}
)(Header)


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
*/
