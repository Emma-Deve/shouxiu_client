
// 富文本编辑器 - wysiwyg

/* 安装组件：npm i --save draft-js react-draft-wysiwyg
    功能包括：初始化加载需要编辑的文件到文本框（通过html文本格式）
              初始化空文本编辑框
              点击获取编辑框的html文本
              动态获取编辑框html文本
              收集所有html文本传递给父组件
              图片功能：上传并引入
         
 其他用法详见github上文档 */

import React, { Component } from 'react';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

class RichTextEditor extends Component {
    static propTypes = {
        updateDetail: PropTypes.string  // 非必须
      }

    // 默认加载需要更新详情信息
    constructor(props) {
        super(props)  
        const html = props.updateDetail  // 从父组件获取需要更新的detail信息（HTML格式）
         // detail存在时：加载detail到编辑框
        if (html){  
            const contentBlock = htmlToDraft(html)
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              const editorState = EditorState.createWithContent(contentState);
              this.state = {
                editorState,
              } 
            } 
         // detail不存在时：编辑框为空
        } else {
            this.state = {
                editorState: EditorState.createEmpty(),  //创建一个空的编辑状态 
            }     
        }
        
      }
  
     // 编辑区输入文本是状态值改变——受控组件
    onEditorStateChange = (editorState) => {
        this.setState({
        editorState,
        });
    };
    
    // 调用函数时获取：文本html格式内容
    getDetail = ()=>{
        const { editorState } = this.state;      
        return draftToHtml(convertToRaw(editorState.getCurrentContent())) 
    }

    // 上传引入图片
    uploadImageCallBack = (file) => {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', '/manage/img/upload')
            // xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
            const data = new FormData()
            data.append('image', file)  // 这里的image是参数名，要与接口文档一致
            xhr.send(data);
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText)
              const url = response.data.url
              resolve({data:{link:url}}) 
            })
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText)
              reject(error)
            })
          }
        )
      }

    render() {
        const { editorState } = this.state;
        return (
        <div>
            <Editor  // 受控组件，双向控制
            editorState={editorState}  
                /*修改编辑器部分样式，可以用style也可以样式文件，详见github文档*/
            editorStyle={{border:'1px solid', height:'200px', padding:'10px'}}  
            onEditorStateChange={this.onEditorStateChange}  
                /*上传引入图片*/
            toolbar={{            
                image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },  
            }}
            />

            {/* 实时获取：里面储存的是编辑内容的html代码，可用于后台数据收集，不一般不显示 */}
            {/* <textarea  
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}  // 获取文本html格式内容
            /> */}
        </div>
        );
    }
}
export default RichTextEditor;