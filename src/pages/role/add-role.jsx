import React, { Component } from 'react';
import PropTypes from 'prop-types'

import { Form, Input} from 'antd';


class AddRole extends Component {

    formRef = React.createRef()
   
    static propTypes = {
        addRole: PropTypes.func
    }
        
    

    render() {
        // 清空上次输入，重新获取初始值,需要用异步函数才能获设置value值
        setTimeout(()=>this.formRef.current.resetFields(),0)

        const layout={  // 表格布局
            labelCol:{span:6},
            wrapperCol:{span:16}
        }

        return (
            <Form 
            ref={this.formRef}
            onChange={()=>{
                const role = this.formRef.current.getFieldsValue()
                this.props.addRole(role) // 向父组件传递role名
            }}
            >
                <Form.Item {...layout}
                label="角色名称:"
                name="name" 
                rules={[  
                    { required: true, whitespace:true, message: '请输入角色名' },  // 必须输且不能为空格                    
                ]} 
                >
                    <Input placeholder="请输入角色名称"/>
                </Form.Item>
            </Form>
        );
    }
}



export default AddRole;