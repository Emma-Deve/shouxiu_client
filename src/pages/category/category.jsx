import React, { Component } from 'react';

// 引入样式
import './category.less'

// 引入自定义组件
import LinkButton from '../../components/linkButton/linkButton'
import {reqCategories,reqAddCategory,reqUpdateCategory} from '../../api/index'

// 引入第三方组件
import {Card, Table, Button, message,Modal} from 'antd'
import { PlusOutlined,SwapRightOutlined } from '@ant-design/icons';
import AddCategoryForm from './add-category-form'
import UpdateCategoryForm from './update-category-from'

class Category extends Component {
    state={
        categories:[],  // 父级列表
        subCategories:[],  // 子级列表
        parentId:'0',  // 父级parentId
        parentName:'',  // 二级目录的父级名
        loading:false,  // 是否正在获取数据
        modalVisible: 0, // 显示添加对话框1，显示更新对话框2，都不显示0

    }

    //获取商品列表：向服务器传递parentId，请求数据，得到的是一个对象（看API文档），需要的数据为其中的data数组
    getCategories=async()=>{  
        const {parentId} = this.state // 将state里面的parentId传给ajax发送请求
        this.setState({loading:true})  // 发送请求前设置loading为true
        const res= await reqCategories(parentId)
        this.setState({loading:false})  // 收到请求后设置loading为false
        const categories = res.data
        if(res.status===0){  // 如果请求成功获取值，不成功报错
             if( parentId === '0'){ // 如果 parentId为0，父级目录，否则为子级目录
                this.setState({categories})
            }else{
                this.setState({subCategories:categories})        

            }     
        } else {
            message.error('获取列表失败')
        }
    }
    
    // 点击事件：回到一级列表
    returnBackCategories=()=>{
        this.setState({   
            parentId:'0', 
            parentName:''
        },()=>{    
            this.getCategories()  // 获取商品列表
        })
    }

    // 点击事件获取二级列表：通过点击事件获取点击处的元素（即此二级列表的父元素）
    /* setState在这里是异步更新状态，要获得值后再处理的代码，需要放在后面的回调函数中 */
    getSubCategories=(category)=>{
        this.setState({   // 更新state中的parentId值
            parentId:category._id,  // 子列表的 parentId 为父列表的_id
            parentName:category.name
        },()=>{    
            this.getCategories()  // 获取商品列表
        }) 
    }

    // 添加商品列表：点击OK时发生的动作
    addCategory = () => {
        // 点击OK按钮前需要先对表单进行验证，验证成功才能关闭对话框
        this.addForm.validateFields()
            .then(async(values)=>{
                this.setState({modalVisible:0})  // 关闭对话框  

                // 获取表格数据，如果名字相同可以直接用结构赋值：
                const categoryName = values.addCategory 
                const parentId = values.parentCategoryId
                console.log(values)
                // 也可以用如下方法获取，拿到表单后获取数据的方式有很多，推荐上面一种
                // const categoryName = this.addForm.getFieldValue('addCategory') 
                // const parentId = this.addForm.getFieldValue('parentCategoryId') 
                const res = await reqAddCategory({parentId,categoryName})  // 发送增加请求
                if (res.status===0){
                    this.getCategories()   // 获取列表显示
                } else {
                    message.error('更新分类失败')
                }        
                })
            .catch(err=>{message.error('请输入类名')})          
    }

    // 更新商品列表
    /* 点击更新按钮：显示对话框，获取点击处分类信息，显示在对话框中 */
    handleUpdate=(category)=>{
        this.category = category
        this.setState({modalVisible:2,category})  // 显示对话框    
    }

    /* 点击OK按钮：隐藏对话框，发送ajax请求，获取新列表显示 */
    updateCategory = () => {
        // 点击OK按钮前需要先对表单进行验证，验证成功才能关闭对话框
        this.updateForm.validateFields()
            .then(async(values)=>{
                this.setState({modalVisible:0})  // 隐藏对话框
                const categoryName = values.categoryName
                const categoryId = this.category._id  // 获取id值
                const res = await reqUpdateCategory(categoryId,categoryName) // 根据id和列表名发送ajax请求
                if (res.status===0){
                    this.getCategories()  // 更新显示列表 
                } else {
                    message.error('更新分类失败')
                } 
            })
            .catch(err=>{message.error('请输入类名')})          
    }
        
        
    
    // 组件加载完成时调用接口函数，发送ajax请求，获取列表数据
    componentDidMount(){
        this.getCategories()
    }

    render() {  // 状态变化后，需要重新更新的代码都写在render()中
        // 初始化列数组
        const columns = [
            {
              title: '一级分类列表',
              dataIndex: 'name',
            },
            {
              title: '操作',
              width:300,
              render: (category) =>  // 传递参数，获取点击事件发生位置的对象元素
              <span>
                  <LinkButton onClick={()=>this.handleUpdate(category)}>修改分类</LinkButton>  {/* 点击事件传参必须要用箭头函数 */}
                  { parentId === '0' ? (<LinkButton  onClick={()=>{this.getSubCategories(category)}}>查看子分类</LinkButton>) : ''} 
                    {/* 二级列表时不需要查看子分类 */}                  
              </span>
            }
          ];

        // 取出state中用于渲染的数据，方便调用
        const {categories,loading, parentId,subCategories,parentName,modalVisible} = this.state
        const category = this.category || {name:''}  // 第一次渲染时this.category为undefined，此时让其等于空对象，防止报错，因为undefined是没有name属性的
        
        // 左上角title
        const title= parentId === '0' ? '一级列表' : (
            <span>
                <LinkButton onClick={this.returnBackCategories}>一级列表</LinkButton>&nbsp;
                <SwapRightOutlined /> &nbsp;
                <span>{parentName}</span>
            </span>
        )

        // 右侧添加按钮
        const addButton = (
        <Button className="button-add" type="primary" icon={<PlusOutlined />} onClick={()=>this.setState({modalVisible:1})}>添加</Button>
        )

        return (   // 需要显示在页面上的内容写在return中
           // 用card将 表格内容 包起来
            <Card className="card" title={title} extra={addButton}>
                <Table className="card-table"
                bordered 
                rowKey='_id'  // 设置表每行id
                loading={loading}
                size="small"                
                dataSource={parentId ==='0' ? categories : subCategories}   // 判断显示一级还是二级列表
                columns={columns} 
                pagination={{pageSize:5, showQuickJumper:true}}  // 分页器，快速跳转
                />
                <Modal 
                // forceRender  // 有时候Modal渲染比较慢滞后，导致数据不能立刻渲染，需要加forceRender，确保拿到数据
                title="添加分类"
                visible={modalVisible===1}
                onOk={this.addCategory}
                onCancel={()=>this.setState({modalVisible:0})}
                >
                    <AddCategoryForm 
                    parentId={parentId}
                    categories={categories}
                    addCategory={(addForm) => this.addForm=addForm}
                    />               
                </Modal>
                <Modal 
                title="修改分类"
                visible={modalVisible===2}
                onOk={this.updateCategory}
                onCancel={()=>this.setState({modalVisible:0})}
                >
                    <UpdateCategoryForm 
                    categoryName={category.name}   /* 父组件通过传递props属性，传递参数categoryName和值{category.name}给子组件UpdateFrom */  
                    getNewCategory={(updateForm) => this.updateForm=updateForm}  /* 父组件通过传递props方法，获取子组件的newCategory值，存到state中 */
                    />             
                </Modal>              
            </Card>
        );
    }
}

export default Category;