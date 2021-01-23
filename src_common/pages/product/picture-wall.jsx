 // 照片墙 - antd
 /* 包括： 初始化加载已上传图片
           点击预览图片（能看到图片名）
           修改显示图片名与服务器中图片名一致（默认自动生成图片名）
           收集所有图片名传递给父组件
           设置图片上传的路径/格式/数量/图片名/显示样式

 */



import React from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import {reqDeleteImg} from '../../api/index'
import {BASE_IMG_PATH} from '../../utils/constants'



class PicturesWall extends React.Component {

        constructor(props){
            super(props)  // 从父组件接收imgs的值
            // 摸人家在上传图片的fileList
            let fileList=[];
            if(props.imgs && props.imgs.length>0){
                fileList = props.imgs.map((item,index)=>({
                uid: -index,  // 图片id，如果自定义建议用负数
                name: item,  // 图片文件名
                status: 'done',  // 有uploading done error removed
                url: BASE_IMG_PATH + item,
            }))
            } 
            this.state={
                previewVisible: false,  // 显示图片
                previewImage: [],  // 照片url
                previewTitle: '',  // 照片名字
                fileList,  // 所有已上传图片的数组
            }

        
        }


  // 获取所有图片名数组：传递给父组件收集数据
  getImgs=()=>{
      return this.state.fileList.map(item=>item.name)
  }

  // 点击取消：隐藏对话框
  handleCancel = () => this.setState({ previewVisible: false });

  // 点击预览查看大图：获取图片url，显示图片
  handlePreview = async file => {
    this.setState({
      previewImage: file.url || file.preview,  // 用url显示图片|| 如果没有url用默认显示
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  // 操作图片文件：上传/删除
  /* 上传的图片会自动生成默认的名字和id，自己设置的名字和id/url在请求结果的response中 */
  handleChange = async ({ file, fileList }) => {  // fileList为所有文件数组，file为当前文件信息，对应fileList最后一个元素

      // 上传
      /* 成功：修改fileList中的图片name/url 与 服务器中一致；失败：提示错误信息 */
      /* 对图片显示名字没有要求的 可以不需要设置 */
      if(file.status==='done'){
        const severInfo = file.response // 服务器信息存在file的response里面
        if(severInfo.status===0){
            message.success('上传成功')
            // const fileListInfo = fileList[fileList.length-1]  // 仅修改fileList信息
            file = fileList[fileList.length-1]  // 可以同时修改file 和 fileList 信息：只需要fileList信息
            file.name = severInfo.data.name
            file.url = severInfo.data.url
        } else {
            message.error('上传失败')
        }
      } else if (file.status==='removed'){
        const res = await reqDeleteImg(file.name)
        if(res.status ===0){
            message.success('删除图片成功')
        } else {
            message.error('删除图片失败')
        }
      }
      this.setState({ fileList })  // 更新fileList状态才能重新渲染显示
      console.log(fileList)
    }

  // 渲染组件
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;

    // 上传按钮
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )

    return (
      <div>
        <Upload
          action="/manage/img/upload"  // 图片上传的地址
          accept="image/*"   //接受上传的文件类型，包括：image/*  video/*  audio/*
          name="image"  // 文件名:对应api中的参数（用来存放image的文件夹名）
          listType="picture-card"  // 上传列表的显示样式：text/picture/picture-card
          fileList={fileList}  // 已上传文件的列表
          onPreview={this.handlePreview}  // 预览图片
          onChange={this.handleChange}  // 处理上传的变化
        >
          {fileList.length >= 8 ? null : uploadButton}  {/* 设置最多上传数量 */}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;