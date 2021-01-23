import React, { Component } from 'react';

import {Card,Table,Button,Modal,message} from 'antd'


import {PAGE_SIZE} from '../../utils/constants'  // 常量
import GetTime from '../../utils/format-date'  // 将时间变成固定格式
import AddOrUpdateUser from './update-user'  // 添加组件
import {reqUsers,reqDeleteUser, reqAddOrUpdateUser} from '../../api/index'
import LinkButton from '../../components/linkButton/linkButton'


const { confirm } = Modal;

class User extends Component {
    state={
        showAdd:false,
        users:[],
        roles:[],
    }

    // 获取用户列表
    getUsers=async()=>{
        const res = await reqUsers()
        if(res.status===0){
            const {roles, users} = res.data
            this.setState({roles,users})
            this.getRoleNames(roles)
        }
    }
    // 获取角色名对象
    getRoleNames=(roles)=>{
        const roleNames = roles.reduce((total, role)=>{
            total[role._id] = role.name  // 将 键role._id：值role.name 累积到total中，total初始数据为空对象{}
            return total  // 将累积结果total返回给userNames
        },{})
        this.roleNames = roleNames
    }

    // 添加/修改用户
    addOrUpdateUser= async()=>{
        this.setState({showAdd:false})
        if(this.user){
            this.userInfo._id = this.user._id
        }
        const res = await reqAddOrUpdateUser(this.userInfo)
        if(res.status === 0){
            this.getUsers()
        }

    }
        

    // 点击修改按钮
    clickUpdate=(user)=>{
        this.setState({showAdd:true})
        this.user = user
    }

    // 删除用户
    deleteUser=(user)=>{
        console.log(user)
        confirm({
            title: `确认删除${user.username}吗?`,
            onOk:async ()=>{
                const res = await reqDeleteUser(user._id)
                if(res.status===0){
                message.success('删除成功')
                this.getUsers()
                }
            }              
          })
    }

    // 初始化列
    initColumns=()=>{
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            }, {
                title: '邮箱',
                dataIndex: 'email',
            }, {
                title: '电话',
                dataIndex: 'phone',
            },  {           
                title: '注册时间',
                dataIndex: 'create_time',
                render:GetTime,
              },  {           
                title: '所属角色',
                dataIndex: 'role_id',
              render: (role_id)=>this.state.roles.find(role=>role._id===role_id).name  // 每次都要遍历效率低，优化如下
                // render:(value)=>this.roleNames[value]  // 一次获取所有的role_id和对应name，对应显示
              },  {           
                title: '操作',
                render:(user)=>(
                    <span>
                        <LinkButton onClick={()=>this.clickUpdate(user)}>修改</LinkButton>&nbsp;&nbsp;  
                        <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
              }
          ];
    }

    // 初始化列
    UNSAFE_componentWillMount(){
        this.initColumns()
    }
    // 获取用户列表
    componentDidMount(){
        this.getUsers()
    }
    render() {
        const {showAdd,users, roles} = this.state
        const user = this.user || {}

        const title = (
        <Button type="primary" onClick={()=>this.setState({showAdd:true})}>创建用户</Button>
            )
        
        return (
            <Card title={title}>
                <Table
                bordered 
                rowKey='_id' 
                size="default"                
                dataSource={users}  
                columns={this.columns} 
                pagination={{defaultPageSize:PAGE_SIZE}} 
                />

                {/* 添加角色对话框 */}
                <Modal 
                title={user._id ? '修改用户' : '添加用户'}
                visible={showAdd}
                onOk={this.addOrUpdateUser}
                onCancel={()=>this.setState({showAdd:false})}
                >
                    <AddOrUpdateUser
                    user={user}
                    roles={roles}  // 传递旧用户数据
                    getUserInfo={(userInfo)=>this.userInfo = userInfo}  // 获取新用户信息
                    />            
                </Modal>
            </Card>
        );
    }
}

export default User;