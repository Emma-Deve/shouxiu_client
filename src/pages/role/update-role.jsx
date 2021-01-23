import React, { Component } from 'react';
import PropTypes from 'prop-types'

import { Tree  } from 'antd';
import menuList from '../../config/menuConfig' 

class UpdateRole extends Component {

    static propTypes={
        role: PropTypes.object,
        updateRole:PropTypes.func,
    }

    // 将接收到的props值放在state中，以便state改变重新渲染
    state={
        checkedKeys:this.props.role.menus 
    }

    onCheck = (checkedKeys) => {
        this.setState({checkedKeys})
        this.props.updateRole(checkedKeys)
    }

    // 接收新的props时，重新渲染
    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({checkedKeys:nextProps.role.menus})
    }
    
    render() {
        const {name}=this.props.role
        const {checkedKeys} =  this.state
        return (
            <div>
                <span>
                    角色名称：
                    <input placeholder={name} disabled />
                </span>
                <Tree
                    defaultExpandAll  // 默认展开所有项
                    checkable  // 可选择
                    checkedKeys={checkedKeys}  // checkedKeys受控选中项：根据状态不同发生改变；defaultCheckedKeys不受控
                    onCheck={this.onCheck}
                    treeData={menuList}  //  Tree列表
                />
            </div>
        );
    }
}



export default UpdateRole;