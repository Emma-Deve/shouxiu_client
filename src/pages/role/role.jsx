import React, { Component } from 'react';

import {Button, Card, Table, Modal, message} from 'antd'

import {PAGE_SIZE} from '../../utils/constants'  // 常量
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'  // 接口请求函数
import AddRole from './add-role'  // 添加组件
import UpdateRole from './update-role'  // 更新组件
import GetTime from '../../utils/format-date'  // 将时间变成固定格式

// redux
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'

class Role extends Component {


    state = {
        roles: [],
        role:{},
        showAdd:0,
        showUpdate:0,
    }

    // 获取角色列表
    getRoles= async () => {
        const res = await reqRoles()
        if(res.status===0){
            const roles = res.data
            this.setState({roles})
        }        
    }

    // 添加角色
    addRole=async()=>{
        const roleName = this.role.name
        const res = await reqAddRole(roleName)
        console.log(res.data)
        if(res.status===0){
            const role = res.data
            this.setState({
                roles:[...this.state.roles,role]  // 为state中的数组增加一个元素
            })
        }
        this.setState({showAdd:0})
    }

    // 设置角色权限
    authRole=async()=>{
        const user = this.props.user  // 获取redux的state-user
        const updateRole ={
            _id: this.state.role._id,
            menus:this.menus,
            auth_name: user.username,            
        }
            // 更新用户
        const res = await reqUpdateRole(updateRole) 
        if(res.status===0){
            /* 如果当前设置的是自己角色的权限，退出当前账户，重新登录 */
            if(this.state.role.name === user.role.name){
                this.props.logout()
                message.success('更新当前角色权限成功，请重新登录')  
            } else {
                this.getRoles()
                this.setState({showUpdate:0})
                message.success('设置角色权限成功')
            }
        }        
    }
    
    // 获取角色列表
    componentDidMount(){
        this.getRoles()
    }
     
    render() {
        const {roles, role, showAdd, showUpdate}= this.state

        this.columns = [
            {
              title: '角色名称',
              dataIndex: 'name',
            }, {
                title: '创建时间',
                dataIndex: 'create_time',
                render:GetTime  // 设置时间格式，相当于：(create_time)=>GetTime(create_time)
            }, {
              title: '授权时间',
              dataIndex: 'auth_time',
              render:GetTime
            },  {           
                title: '授权人',
              dataIndex: 'auth_name',
              }
          ]    

        const title=(
            <span>
                <Button type={"primary"} onClick={()=>this.setState({showAdd:1})}>创建角色</Button>&nbsp;&nbsp;                
                <Button type={"primary"} disabled={!role._id} onClick={()=>this.setState({showUpdate:1})}>设置角色权限</Button>  {/* 没有id值时，disabled */}
            </span>
        )

        return (
            <Card className="card" title={title}>
                <Table className="card-table"
                bordered 
                rowKey='_id' // 这里设置了rowKey 就不需要在column中设置key了
                size="default"                
                dataSource={roles}  
                columns={this.columns} 
                pagination={{defaultPageSize:PAGE_SIZE}} 
                rowSelection={{  // radio选择框
                    type: "radio",
                    onSelect:(value)=>this.setState({role:value}),  // 点击radio选中并获取value值
                }}        
                />

                {/* 添加角色对话框 */}
                <Modal 
                title="添加分类"
                visible={showAdd}
                onOk={this.addRole}
                onCancel={()=>this.setState({showAdd:0})}
                >
                    <AddRole addRole={(role)=>this.role = role}/>    {/* 获取表格值 */}           
                </Modal>

                {/* 设置角色权限对话框 */}
                <Modal 
                title="设置角色权限"
                visible={showUpdate}
                onOk={this.authRole}
                onCancel={()=>this.setState({showUpdate:0})}
                >
                    <UpdateRole 
                    role={role}   /*传递当前角色参数  */ 
                    updateRole={(checkedMenus)=>this.menus = checkedMenus}
                    />             
                </Modal>

            </Card>
    
        );
    }
}

export default connect(
    state=>({user:state.user}),
    {logout}
)(Role) ;