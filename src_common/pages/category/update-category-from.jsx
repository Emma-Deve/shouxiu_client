
// 方法一：类组件，通过props传递参数
// 用 Form.useForm 创建表单数据域进行控制（推荐使用）


import React, { Component } from 'react';
import { Form, Input} from 'antd';

import PropTypes from 'prop-types'

const ref = React.createRef();  
class UpdateCategoryForm extends Component {
    
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        getNewCategory: PropTypes.func.isRequired,
    }
            

    render() {
        const {categoryName} = this.props
        setTimeout(()=>ref.current.resetFields(),0)   // 清空上次输入，重新获取初始值
        // 需要用异步函数才能获设置value值;这里的value要与select里面的value对应起来，否则无效
        // setTimeout(()=>ref.current.setFieldsValue({categoryName}),0) // 更新初始值
        return (
            <Form 
            ref={ref}  // 通过为表单设置ref，获取表单内容
              onChange={() => { 
                const updateForm = ref.current;
                this.props.getNewCategory(updateForm)
              }}
            initialValues={{categoryName}}  // 表单默认值，也可以在item中设置
            >
                <Form.Item
                label="请输入分类名:"
                name="categoryName"  
                rules={[  
                    { required: true, whitespace:true, message: '请输入分类名' }, 
                   /*  方法二：当没有submit时，通过表单验证动态获取输入值：优点：对输入的信息进行验证
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



export default UpdateCategoryForm;
