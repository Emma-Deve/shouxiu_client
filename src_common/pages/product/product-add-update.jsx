import React, { Component } from 'react';

// 引入antd
import {Card,Form, message, Cascader, Input, Button, } from 'antd'
import { ArrowLeftOutlined} from '@ant-design/icons';


// 引入自定义组件
import { reqCategories,reqAddOrUpdateProduct } from '../../api/index'  // 接口请求函数
import LinkButton from '../../components/linkButton/linkButton';
import PicturesWall from './picture-wall';
import RichTextEditor from './rich-text-editor';

const { TextArea } = Input;  // antd 的 TextArea输入框

class ProductAddUpdate extends Component { 
    
        form = React.createRef()  // 为Form表单创建容器对象this.form
        picturesWall = React.createRef()  // 使用React.createRef()为PictureWall创建容器对象this.picturesWall
        detail = React.createRef()    // 使用React.createRef()为RichTextEditor创建容器对象this.detail
    

    state = {
        initOptions:[],  // 一级分类列表
      };

    // 提交表单: 获取更新数据，提交数据，发送请求，更新列表重新显示
    onFinish= async (value)=>{  // antd4 会自己进行表单验证

        // 搜集数据
        const {_id} = this.updateCategories
        const {name, desc, price,categoryIds} = value        
        const imgs = this.picturesWall.current.getImgs()  // 获取组件PictureWall中的图片名
        const detail = this.detail.current.getDetail()  // 获取商品详情
        let categoryId=''
        let pCategoryId=''
        if(categoryIds.length===1){
            categoryId='0'
            pCategoryId = categoryIds[0]
        } else {
            categoryId = categoryIds[0]
            pCategoryId = categoryIds[1]
        }
        const product ={name, desc, price, imgs, detail, categoryId, pCategoryId}  // 添加的product对象
        if(this.isUpdate){  // 更新的product对象
            product._id = _id
        }

        // 调用接口函数添加/更新
        const res = await reqAddOrUpdateProduct(product)

        // 根据请求结果处理：成功-退回商品列表(自动重新渲染更新)；失败-提示信息
        if(res.status === 0){
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
            this.props.history.goBack() 
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
        }
    }

    // 发送请求获取分类信息：生成一级列表和更新时二级列表默认值
    getCategories=async(parentId)=>{
        const res = await reqCategories(parentId)        
        if(res.status === 0){
            const categories = res.data
            // 获取一级分类，生成一级列表
            if (parentId==='0'){
                const initOptions = categories.map(item=>({
                    value: item._id,
                    label: item.name,
                    isLeaf: false,
                    
                }))
                this.setState({initOptions})

                // 点击 更新 时，显示加载对应的二级列表
                const {categoryId} = this.updateCategories
                if(this.isUpdate && categoryId !=='0') {
                    const updateSubCategories = await this.getCategories(categoryId)
                    if(updateSubCategories && updateSubCategories.length>0){
                        const updateSubOptions = updateSubCategories.map(item=>({
                            value: item._id,
                            label: item.name,
                            isLeaf: true,
                        })) 
                        // 找到更新商品对应的targetOption 和 他的孩子  targetOption.children 并赋值（名字不能改，antd用于生成数据） 
                        const targetOption = initOptions.find(item=>item.value===categoryId)
                        targetOption.children = updateSubOptions
                    }
                }

            // 获取二级分类信息，传递分类结果
            } else {
                // 添加选项点击加载
                return categories
            }
        } else {
            message.error("获取分类菜单失败")
        }
    }    

    // 根据当前选中id 生成二级分类
    subOptions = async (subOptions) => {        
        // 获取当前选中分类
        const targetOption = subOptions[subOptions.length - 1]  // 选中的分类，数组，其中只有一个对象元素，获取此对象
        const parentId = targetOption.value
        // 发送数据请求
        targetOption.loading = true;  // 显示loading效果
        const subCategories = await this.getCategories(parentId)  // ajax请求为promise的结果，要用await才能获取
        targetOption.loading = false;
        // 显示二级分类：有则显示，没有就将当前分类的isLeaf改成false
        if(subCategories && subCategories.length > 0){
            targetOption.children = subCategories.map(item=>({  // 将获得的结果关联到一级分类的选中类上：targetOption.children
                value: item._id,
                label: item.name,
                isLeaf: true,
            }))
        } else {
            targetOption.isLeaf = true
        }        
          this.setState({
            initOptions: [...this.state.initOptions],
          });
      };

      // 根据 parentId=0 获取一级分类
    async componentDidMount(){
        this.getCategories('0')
    }    
    
    // 渲染组件
    render() {
        // 选择分类
        // 点击 修改 按钮，获取对应分类的value值（一级/二级id）
        const updateCategories = this.props.location.state   // 获取点击时传递过来的商品信息
        this.isUpdate = !!updateCategories  // 将有无商品变成布尔值 true/false，用于后期判断
        this.updateCategories = updateCategories || {}  // 同时兼顾更新与添加：点击更新||点击添加
        const categoryIds=[]  // 分类initValue是数组格式，分别对应一级/二级分类id
        const {categoryId,pCategoryId} = this.updateCategories
        if(this.isUpdate){
            if(categoryId==='0'){  // 只有一级分类时，只显示一级分类
                categoryIds.push(pCategoryId)
            }else{  // 否则显示一级和二级分类：一级分类在组价打开即加载，二级目录需要设置打开即加载
                categoryIds.push(categoryId)
                categoryIds.push(pCategoryId)
            }
        }
        // 页面左上角title
        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}><ArrowLeftOutlined /></LinkButton>
                <span>{this.isUpdate ? "更新商品" : "添加商品"}</span>
            </span>
        )
       
        // 制定Form布局的配置对象
        const layout = {
            labelCol: { span:4 },  //左侧label宽度
            wrapperCol: { span: 8 },  // 右侧输入框的宽度
          };
                       
        // 渲染页面：Card包含Form（需要进行表单验证）        
        return (
            <Card title={title}>                
                <Form {...layout}
                ref={this.form}  // 将form对象装进this.form容器中
                    onFinish={this.onFinish}
                    initialValues={{
                        name:this.updateCategories.name,
                        desc:this.updateCategories.desc,
                        price:this.updateCategories.price,  
                        categoryIds:categoryIds,  // cascader默认值为数组     
                    }}
                >
                    <Form.Item  label="商品名称:"  name="name"
                        rules={[  
                            { required: true, whitespace:true, message: '请输入商品名' },  // 必须输且不能为空格                    
                        ]} 
                    >
                         <Input />
                    </Form.Item>

                    <Form.Item label="商品描述:" name="desc"  
                        rules={[  
                            { required: true, whitespace:true, message: '请输入商品描述' }
                        ]}           
                    >
                        <TextArea
                            placeholder="请输入商品描述"
                            autoSize={{ minRows: 2, maxRows: 5 }}
                        />
                    </Form.Item>

                    <Form.Item label="商品价格:" name="price"  // 表单内容属性名 value.parentId
                        rules={[  
                            // { required: true, whitespace:true, message: "请输入商品价格" },  // 必须输且不能为空格 
                            // { validator (rule,value,callback) { if (value*1 < 0.001) {callback("请输入大于0的价格")}} } //自定义验证规则             
                        ]} 
                    >
                        <Input type="number" addonAfter="元" placeholder="请输入商品价格"/>
                    </Form.Item>

                    <Form.Item label="商品分类:" name="categoryIds"  
                    
                        rules={[  
                            { required: true, message: '请选择商品分类' },  // 必须输且不能为空格                    
                        ]} 
                    >
                        <Cascader
                            options={this.state.initOptions}  // 下拉选项
                            loadData={this.subOptions}  // 获取数据
                        />
                    </Form.Item>
                    
                    <Form.Item label="商品图片:" name="imgs"
                    >
                        <PicturesWall 
                        ref={this.picturesWall}   /* 将容器对象this.picturesWall交给组件<PictureWall>，用来存放其ref属性 */
                        imgs={this.updateCategories.imgs}  // 传递需要更新的imgs
                        />
                    </Form.Item> 

                    <Form.Item  
                    wrapperCol={{ ...layout.wrapperCol, span: 16 }}  // 修改样式
                    label="商品详情:" 
                    name="detail">
                        <RichTextEditor 
                        ref={this.detail} /* 将容器对象this.detail交给组件<RichTextEditor>，用来存放其ref属性 */
                        updateDetail = {this.updateCategories.detail}  // 传递需要更新的detail
                        />  
                    </Form.Item>

                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}> {/* 修改样式 */}
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Form.Item>
                    
                </Form>
            </Card>
        );
    }
}

export default ProductAddUpdate;