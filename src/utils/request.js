import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance 
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      //Authorization
      config.headers["Authorization"] = "Bearer " + getToken();
      // config.headers["X-Token"] = "Bearer " + getToken();
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // 此处统一弹出错误框，各模块调用时catch就可以不用Message弹框了(roy注)
      if (res.msg.includes('GetUserInfoByToken')) {
        Message({
          message: 'access_token过期，请重新登录',
          type: 'info',
          duration: 20 * 1000
        })
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 20 * 1000
        })
      }



      // if (res.code == 400) {
      //   console.log("400", JSON.stringify(res));
      // }
      if (res.code == 401) {
        console.log("重新登录吧401")
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('您已注销，可以取消以停留在此页面，或重新登录', '确认登出', {
          confirmButtonText: '重新登录0',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    if (error.response) {
      switch (error.response.status) {
        case 401:
          MessageBox.confirm('您已注销，可以取消以停留在此页面，或重新登录', '确认登出', {
            confirmButtonText: '重新登录1',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
      }
    }
    return Promise.reject(error)
  }
)

export default service
