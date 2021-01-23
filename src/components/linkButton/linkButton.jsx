// 封装自己的button样式，获取调用组件传递过来的props值

import React from 'react'
import './LinkButton.less'

export default function LinkButton(props){
    return <button className="link-button" {...props}></button>    
}