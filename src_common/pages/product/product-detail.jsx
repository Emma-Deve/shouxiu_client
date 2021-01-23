import React, { Component } from 'react';

// 引入antd
import {Card, List, message} from 'antd'
import { ArrowLeftOutlined} from '@ant-design/icons';

// 引入自定义组件
import {reqCategory} from '../../api/index'  // 接口请求函数
import LinkButton from '../../components/linkButton/linkButton';
import {BASE_IMG_PATH} from '../../utils/constants'

class ProductDetail extends Component {

    state={
        categoryName:'',   // 一级分类名
        pCategoryName:'',  // 二级分类名
    }

    // 组件加载完成后立刻获取所属分类：根据分类id获取分类名，product参数中只有id，没有名字
    async componentWillMount() {
        // 获取 一级/二级 分类id
        const {categoryId, pCategoryId} = this.props.location.state.product
        console.log()
        // 如果二级分类不存在，就获取一级id分类名
        let res
        if(pCategoryId === 0){
            res = await reqCategory(categoryId)
            if(res.status === 0) {
                const categoryName = res.data.name
                this.setState({categoryName})
            } else {
                message.error('获取详情失败')
            }            
        } else {
            // 如果二级分类存在，同时发送一级/二级id分类名
            res = await Promise.all([reqCategory(categoryId),reqCategory(pCategoryId)])  //同时发送2个请求
            if(res[0].status === 0 && res[1].status === 0) {
                const categoryName = res[0].data.name   
                const pCategoryName = res[1].data.name
                this.setState({categoryName,pCategoryName})
            } else {
                message.error('获取详情失败')
            } 
            
        }
        

    }
    
    render() {
        const {name, desc, price, imgs, detail} = this.props.history.location.state.product
        const {categoryName,pCategoryName} = this.state

        // 页面左上角title
        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}><ArrowLeftOutlined /></LinkButton>
                <span>商品详情</span>
            </span>
        )
        // 渲染页面：Card包含List
        return (
            <Card className="product-detail" title={title}>                
                <List className="list">
                    <List.Item>
                        <span>
                            <span className="item">商品名称：</span>
                            <span>{name}</span>
                        </span>
                    </List.Item>
                    <List.Item>
                        <span>
                            <span className="item">商品描述：</span>
                            <span>{desc}</span>
                        </span>
                    </List.Item>
                    <List.Item>
                        <span>
                            <span className="item">商品价格：</span>
                            <span>{price}</span>
                        </span>
                    </List.Item>
                    <List.Item>
                        <span>
                            <span className="item">所属分类：</span>
                            <span>{categoryName} {pCategoryName ? ' --> ' + pCategoryName : ''}</span>
                        </span>
                    </List.Item>
                    <List.Item>
                        <span>
                            <span className="item">商品图片：</span>
                            {
                                imgs.map(img => <img key={img} alt="img" src={BASE_IMG_PATH + img}/>)
                            }
                        </span>
                    </List.Item>
                    <List.Item>
                        <span>
                            <span className="item">商品详情：</span>
                            <div dangerouslySetInnerHTML={{__html:detail}}></div>  {/* 用对象将html包裹起来，防止XSS的攻击*/}
                        </span>
                    </List.Item>
                </List>
            </Card>
        );
    }
}

export default ProductDetail;