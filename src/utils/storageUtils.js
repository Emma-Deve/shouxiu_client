/* 永久化工作，关闭浏览器关机不会消失，配合依赖包store一起用 */
import store from 'store'

const USER_KEY = 'user_key'

export default{
    // 储存用户信息
    saveUser(user){store.set(USER_KEY,user)},  // 内部会自动转换成json再保存
    // 获取用户信息
    getUser(){return store.get(USER_KEY)||{}},  // 获取用户
    // 删除用户信息
    removeUser(){store.remove(USER_KEY)},  // 移除用户
}