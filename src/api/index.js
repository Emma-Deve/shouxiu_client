/* 包含所有 接口请求的函数 的模块：需要：
1. 引入发送请求的ajax.js 函数模块
2. 按照 API 接口文档 写出所有接口函数
3. 命名index.js的原因：引用此文件只需要引用到api文件夹即可，默认引用到的是里面的index.js */


/* ajax请求函数接受的三个参数： ajax(url, data={}, method='GET')
        路径：url，
        数据内容：data ，包含所有接受的参数名和参数值，如果传过来的值为对象，可以不用加{}，如user，
            如果传过来的值为其他类型，一定要加{} 如{_id}。为了以防有些请求没有data内容，定义一个初始值{}，空对象：data={}
        数据请求方式：method，GET是最常用的请求，所以给定初始默认方式GET：method="GET"，接口函数发送的是GET请求时可以不写
        语法不确定时去github上查*/
// ajax函数返回值是promise，调用接口函数时，用await调用才能得到data

// 引入jsonp依赖包
import jsonp from "jsonp";  
// 引入ajax函数模块
import ajax from "./ajax";  

const BASE = '/api'  // 服务器地址更目录地址，这里默认为5000端口
// 01. 注册
export const reqRegister=(user) => ajax(BASE + '/register', {user}, 'POST')  // 通过形参接收user数据:前面一个user是形参，后面的{user}相当于{user:user}，为ES6的简写
// 02. 登陆
export const reqLogin=(username, password) => ajax(BASE + '/login', {username,password}, 'POST')  // 写法一：用2个形参分别接收username,password数据
export const reqUpdateCategory1=({categoryId,categoryName}) => ajax(BASE + '/category/update', {categoryId,categoryName}, 'POST') // 写法二：用对象形参{categoryId,categoryName}接收数据：解构赋值


// 添加/更新用户信息
export const reqAddOrUpdateUser=(user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')
// 获取用户列表
export const reqUsers=() => ajax(BASE + '/manage/user/list')  // GET可以不写
// 删除用户
export const reqDeleteUser=(userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')


// 获取一级/二级分类列表
export const reqCategories=(parentId) => ajax(BASE + '/manage/category/list', {parentId})  // GET可以不写
// 添加分类
export const reqAddCategory=({parentId,categoryName}) => ajax(BASE + '/manage/category/add', {parentId,categoryName}, 'POST') 
// 更新分类
export const reqUpdateCategory=(categoryId,categoryName) => ajax(BASE + '/manage/category/update', {categoryId,categoryName}, 'POST') 

// 根据分类ID 获取分类（读取其中的分类名字等信息）
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info',{categoryId})  // GET类型

// 获取分页数据
export const reqProductsList = (pageNum,pageSize)=> ajax(BASE + '/manage/product/list', {pageNum,pageSize})

// 根据商品 名字/描述 搜索商品：
// searchType：productName/productDesc; searchName:收集用户输入；pageNum/pageSize：同上
export const reqProducts = ({pageNum, pageSize, searchType, searchName}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]:searchName  // 将searchType的值作为属性名，用[searchType]，不用[]表示属性为searchType
})

// 对商品进行上架/下架处理
// 状态status=0，下架；status=1，上架
export const reqUpdateStatus = (productId,status) => ajax(BASE + '/manage/product/updateStatus', {productId,status}, 'POST')

// 删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

// 添加商品
/*product为一个对象，其中包括所有api需要的信息：categoryId/pCategoryId/name/price/desc/detail/imgs   */ 
// export const reqAddProduct = (product) => ajax(BASE +'/manage/product/add', product,'POST')
// 更新商品
/*product为一个对象，其中包括所有api需要的信息：_id/categoryId/pCategoryId/name/price/desc/detail/imgs   */
// export const reqUpdateProduct = (product) => ajax(BASE +'/manage/product/update', product,'POST')

// 添加/更新商品 合并
/*添加商品 和 更新商品 二者接口函数一本一致，只有接口有些差别，可以合并：更新的商品有_id，添加的没有：
  product参数包括：_id/categoryId/pCategoryId/name/price/desc/detail/imgs  
  product本身就是对象，不需要再用{}  */
export const reqAddOrUpdateProduct = (product) => ajax(BASE +'/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST') 


// 获取所有角色列表：不需要传参
export const reqRoles = () => ajax(BASE +'/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax(BASE +'/manage/role/add', {roleName}, 'POST')

// 更新角色
export const reqUpdateRole = (updateRole) => ajax(BASE +'/manage/role/update', updateRole, 'POST')


// 天气 jsonp接口请求函数
/* export  function reqWeather(city){
    const url=`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    let res = {}
        jsonp (url,{param:'callback'},async(error,response)=>{  // jsonp函数3个参数：url，opts，callback函数
            if(!error && response.status==='success'){
                const {dayPictureUrl, weather} = response.results[0].weather_data[0]  // 获取数据中自己需要的值，保存到res常量中
                res = await { dayPictureUrl, weather }
            }  else {
                alert(' 获取天气信息失败')
                }
        })
    return res
} */

export function reqWeather(city) {
    const url =`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        return new Promise((resolve, reject) => {
            jsonp(url, {
                param: 'callback'
                }, (error, response) => {
                    if (!error && response.status === 'success') {
                    const {dayPictureUrl, weather} = response.results[0].weather_data[0]
                    resolve({dayPictureUrl, weather})
                } else {
                alert(' 获取天气信息失败')
                }
            })
        })
    }