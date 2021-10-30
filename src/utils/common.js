/*eslint-disable*/
import state from '@/store/modules/settings.js';

function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + "";
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str)
            );
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ("00" + str).substr(str.length);
}

//获取日期时间数字序列（可用于一些并发可能性很小，但要作主键的栏位，避免了使用不太友好的guid roy)
function getDigitSerial() {
    let randomstr = Math.floor(Math.random() * 100).toString().padStart(2, '0');//两位随机数
    let timestr = formatDate(new Date(), 'yyyyMMddhhmmss');
    return timestr.slice(2) + randomstr;
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//True 没有全角，False有全角
function No2bytechar(str)
{
    for (var i = 0; i < str.length; i++) {
        strCode = str.charCodeAt(i);
        if ((strCode > 65248) || (strCode == 12288)) {
            return false;
        }
    }
    return true;
}

//服务器地址（主要用于服务器图片存储，切换正式或测试环境时在store中修改，这里暂时不作请求地址)
function getBaseURL() {
    const MallLiveUrl = "http://127.0.0.1:8088"; //正式的商城地址
    const MallUatUrl = "https://app.shengtianstore.com";     //测试的商城地址  （用作了正式的云服务器地址)
    // const MallUatUrl ="http://127.0.0.1:8031"    //测试的商城地址  （用作了正式的云服务器地址)
    return state.state.system_env == "LIVE" ? MallLiveUrl : MallUatUrl;
}

//报表服务器
// const REPORT_URL = "http://print.shengtianstore.com/";  //报表云服务器地址
const REPORT_URL="http://127.0.0.1:8089/";//报表本地服务器地址



export default {
    formatDate,
    getBaseURL,
    getDigitSerial,
    guid,
    REPORT_URL,
    No2bytechar
}
