import React, { Component } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'

import ProductHome from './product-home'
import ProductAddUpdate from './product-add-update'
import ProductDetail from './product-detail'

// 引入样式
import './product.less'

class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path="/product" component={ProductHome} exact/>  {/* 精确匹配路径用exact */}
                <Route path="/product/addupdate" component={ProductAddUpdate} />
                <Route path="/product/detail" component={ProductDetail} />
                <Redirect to="/product" />
            </Switch>
            
        );
    }
}

export default Product;