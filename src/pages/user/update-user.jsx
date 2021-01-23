import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

import { Form, Input} from 'antd';


class AddOrUpdateUser extends PureComponent {

    formRef = React.createRef()
   
    static propTypes = {
        user:PropTypes.object,
        roles: PropTypes.array,
        getUserInfo:PropTypes.func
    }
        
    

    render() {
        const {user, roles, getUserInfo} = this.props

        // 清空上次输入，重新获取初始值,需要用异步函数才能获设置value值
        setTimeout(()=>this.formRef.current.resetFields(),0)

        const layout={  // 表格布局
            labelCol:{span:6},
            wrapperCol:{span:16}
        }

        return (
            <Form {...layout}
                ref={this.formRef}
                onChange={()=>{
                    const userInfo = this.formRef.current.getFieldsValue()
                    getUserInfo(userInfo)
                }}
                initialValues={{
                    username: user.username,
                    phone: user.phone,
                    email: user.email,
                    role_id: user.role_id,
                }}
            >
                <Form.Item 
                    label="用户名:"
                    name="username" 
                    rules={[  
                        { required: true, whitespace:true, message: '用户名不能为空' },             
                    ]} 
                >
                    <Input placeholder="请输入用户名"/>
                </Form.Item>
                {
                    user._id ? null : (
                <Form.Item 
                    label="密码:"
                    name="password" 
                    rules={[  
                        { required: true, whitespace:true, message: '密码不能为空' },             
                    ]} 
                >
                    <Input placeholder="请输入密码"/>
                </Form.Item>
                    )
                }
                <Form.Item 
                    label="手机号:"
                    name="phone" 
                    rules={[  
                        { required: true, whitespace:true, message: '手机号不能为空' },             
                    ]} 
                >
                    <Input placeholder="请输入手机号"/>
                </Form.Item>
                <Form.Item 
                    label="邮箱:"
                    name="email" 
                    rules={[  
                        { required: true, whitespace:true, message: '邮箱不能为空' },             
                    ]} 
                >
                    <Input placeholder="请输入邮箱"/>
                </Form.Item>
                <Form.Item 
                    label="角色:"
                    name="role_id" 
                    rules={[  
                        { required: true, whitespace:true, message: '请选择角色' },             
                    ]} 
                >
                    <select>
                        {
                            roles.map(role=><option key={role._id} value={role._id}>{role.name}</option>)
                        }
                    </select>
                </Form.Item>
            </Form>
        );
    }
}



export default AddOrUpdateUser;