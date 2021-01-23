/* 任务：
1. 点击分页获取当前分页列表 
2. 搜索商品
3. 添加/修改商品 - 在新的链接中，添加/修改在同一链接
4. 查看商品详情
5. 改变上架下架状态*/

import React, { Component } from 'react';

// 引入antd
import {Card, Table, Button,Select,Input, message} from 'antd'
import { PlusOutlined} from '@ant-design/icons';

import LinkButton from '../../components/linkButton/linkButton'
import {reqProductsList, reqProducts,reqUpdateStatus} from '../../api/index'  // 接口函数
import {PAGE_SIZE} from '../../utils/constants'  // 常量：多出用到pagesize，为了方便数据修改，将其定义成一个常量值


const { Option } = Select;
class ProductHome extends Component {

    state={
        loading:false,  // 获取数据是的loading状态
        products:[],   // 商品列表
        total:0,      // 商品总条数
        searchType:'productName',  // 包括productName/productDesc，默认为包括productName（对应select默认为‘按名称搜索’）
        searchName:'',  // 用户输入的搜索内容
        productStatus:'1',  // 商品状态 0：下架；1：在售
        pageNum:1, // 重新render时，默认页面为1

    }

    // 根据点击的分页数和每页条数，获取对应页数据，在声明周期函数中默认获取第一页
    getProducts = async (pageNum)=>{ 
        // 获取pageNum/Page_size/searchType/searchName的值
        this.setState({pageNum})
        const {searchType,searchName} = this.state
        this.setState({loading:true})


        // 判断发送请求的类型：输入框有值-发送搜索请求；输入框无值—发送列表请求
        let res
        if(searchName){
            res = await reqProducts({pageNum,pageSize:PAGE_SIZE,searchType,searchName})  // 根据接口文件传值，对象形参传值
        } else {
            res = await reqProductsList(pageNum,PAGE_SIZE)  //  根据接口文件传值，字符串形参传值
        }
        this.setState({loading:false})
        // 根据请求结果展示列表
        if(res.status === 0){
            const {total,list} = res.data  // 商品总条数从后台数据中获取，并告诉分页器
            this.setState({total, products:list})
        } else {
            message.error('请求数据失败')
        }
    }


    // 根据商品id修改状态（与原状态相反），然后重新获取当前页列表
    updateStatus = async(parentId,status)=>{  // 获取对应的_id 和 status 值
        this.setState({loading:true})
        const res = await reqUpdateStatus(parentId,status)
        this.setState({loading:false})
        // 根据请求结果刷新商品列表，显示当前页
        this.getProducts(this.state.pageNum)  // 获取当前页列表
        if(res.status !== 0){    
            message.error('请求数据失败')
        }

    }

    // 组件完成加载时发送请求获取商品列表，默认获取第1页数据  
    componentDidMount(){
        this.getProducts(1)   
    }
    // 组件加载前设置Table格式
    UNSAFE_componentWillMount(){
        this.columns()
    }

    // 数据的分列
    columns=()=>{
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            }, {
                title: '商品描述',
                dataIndex: 'desc',
            }, {
              title: '价格',
              dataIndex: 'price',
              render: (price) => '¥' + price,  // 根据price属性，获得新的格式
            }, {
                width:80,
                title: '状态',
                // dataIndex: 'status', /* 如果设置了dataIndex，传递的是status的值，但是这里还需要得到其他商品信息，所以不能只写status，得获取所有商品信息 */
                render: (product) => {
                    const {status, _id} = product  // 从传递的所有商品信息中取出 我们需要的参数
                    return (
                        <span>
                            {/* 点击按钮，传递2个参数给点击事件：产品id 和 需要改变的状态（0变成1，1变成0） */}
                            <Button type="primary" onClick={()=>this.updateStatus(_id, status === 0 ? 1 : 0)}>{status === 1 ? '下架' : '上架'}</Button>
                            {status === 1 ? '出售中' : '已下架'}                  
                        </span>
                    )
                } 
                
              }, {
                width:100,                
                title: '操作',
                render: (product) =>
                <span>
                    {/* 跳转到详情页面，传递product参数，参数在 this.props.location.state.{product} */}
                    <LinkButton onClick={()=>this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                    {/* 跳转到修改页面，传递product参数，参数在 this.props.location.state中 */}
                    <LinkButton onClick={()=>this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                </span>
              }
          ];
    }
    
    render() {
        const {loading, products,total, searchType} = this.state

        // 左上角title
        const title = (
            <span>
                {/* 选项改变时，选择类型对应改变 */}
                <Select defaultValue={searchType} style={{width:'200px'}} onChange={value=>this.setState({searchType:value})}>  
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                {/* 动态搜集用户输入内容：受控组件-单向控制即可 */}
                <Input style={{width:'200px', margin:'0 20px', height:'32px'}} 
                    placeholder="关键字" 
                    onChange={e=>this.setState({searchName:e.target.value})}  // 输入内容控制state状态
                    />
                    {/* 点击搜索时，调用函数发送请求并显示数据，默认显示第一页 */}
                <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button> 
            </span>
        )
        // 右上角添加按钮
        const addButton = (
            <Button className="button-add" type="primary" 
            icon={<PlusOutlined />}
            onClick={()=>this.props.history.push('/product/addupdate')}  /* 页面跳转 */
            >添加商品</Button>
            )


        return (
            <Card className="card" title={title} extra={addButton}>
                <Table className="card-table"
                bordered 
                rowKey='_id' // 这里设置了rowKey 就不需要在column中设置key了
                loading={loading}
                size="default"                
                dataSource={products}  
                columns={this.columns} 
                pagination={{
                    current:this.state.pageNum,  // 刷新后回到当前页面
                    total,   // 商品总条数，从后台获取，分页器根据 总条数和每页条数 分页
                    defaultPageSize:PAGE_SIZE,  // 默认每页条数
                    showQuickJumper:true,  // 快速跳转
                    // 获取当前页码，方法一：在pagination分页中获取
                    onChange:this.getProducts  // 相当于onChange:(pageNum)=>{this.getProducts(pageNum)}
                }}  
                    // 获取当前页面：方法二：在Table中获取
                    // onChange={ currentData => this.getProducts(currentData.current)}
                
                />
                
                <Table>

                </Table>
            </Card>
        );
    }
}

export default ProductHome;