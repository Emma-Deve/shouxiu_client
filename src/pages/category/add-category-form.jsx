import React, { Component } from 'react';
import PropTypes from 'prop-types'

import { Form, Input } from 'antd';

// 方式一：<Form ref={ref}> 调用：ref.current.resetFields()
// const ref = React.createRef();  //组件外
class AddCategoryForm extends Component {

    // 方式二：<Form ref={this.formRef}> 调用：this.formRef.current.resetFields()
    formRef = React.createRef();   // 组件内

    // 方式三：函数组件，Form.useForm创建实例
    
    static propTypes = {
        parentId: PropTypes.string.isRequired,
        categories:PropTypes.array.isRequired,
        addCategory:PropTypes.func.isRequired,
    }
        

    render() {
        const {parentId,categories} = this.props
        const parentCategoryId = parentId ? parentId : '0'
        // 清空上次输入，重新获取初始值
        setTimeout(()=>this.formRef.current.resetFields(),0)  
        // 需要用异步函数才能获设置value值;这里的value要与select里面的value对应起来，否则无效
        // setTimeout(()=>this.formRef.current.setFieldsValue({parentCategoryId}),0) // 更新初始值
        return (
            <Form 
            // ref={ref}  // 通过为表单设置ref，获取表单内容
                ref={this.formRef} 
              onChange={() => { 
                const addForm = this.formRef.current;  // 获取表格值方法二
                this.props.addCategory(addForm)
              }}
            initialValues={{
                parentCategoryId,
                addCategory: '111'
            }}  // 表单默认值，也可以在item中设置
            >
                <Form.Item 
                label="请选择分类:"
                name="parentCategoryId"  // 表单内容属性名 value.parentId
                rules={[  
                    { required: true, whitespace:true, message: '请选择分类' },  // 必须输且不能为空格                    
                ]} 
                >
                    <select style={{width:'100%'}}>
                        <option key="0" value="0">一级列表</option>        
                        {    
                            categories.map(item=><option key ={item._id} value = {item._id}>{item.name}</option>)  // value = parentId，默认值=parentId，默认值=value一致的option
                        }
                    </select>
                </Form.Item>
                <Form.Item
                label="请输入分类名:"
                name="addCategory"  
                rules={[  
                    { required: true, whitespace:true, message: '请输入分类名' }, 
                   /*  获取表格值方法二：当没有submit时，通过表单验证动态获取输入值：优点：对输入的信息进行验证
                   ({ getFieldValue }) => ({   // 获取表单值
                      validator(rule, value) {  // 自定义表单验证
                        getNewCategory(getFieldValue('categoryName'))   // 将获取的值传递给父组件
                        if (value) {
                          return Promise.resolve();
                        }          
                        return Promise.reject('请输入类名');
                      },
                    }), */
                ]}           
                >
                    <Input placeholder="请输入分类名"/>
                </Form.Item>
            </Form>
        );
    }
}



export default AddCategoryForm;