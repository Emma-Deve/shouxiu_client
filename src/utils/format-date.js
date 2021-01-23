export default function GetTime(time){
    if(!time) return ''
    let date = new Date(time)  // 获取当前时间
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '-' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
} 
