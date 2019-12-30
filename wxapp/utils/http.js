import siteInfo from '../siteinfo'
import {md5} from './util'

/**
 * 访问接口需要额外四个参数
 1.app_key
 2.nonce_str      随机字符串
 3.access_time    当前时间戳
 4.access_sign    签名
 签名生成规则: .为字符串拼接
 md5(md5(nonce_str.app_secret).access_time)
 * @type {string}
 */
const apiUrl =  siteInfo.apiRoot; //服务器api地址
let app_key = siteInfo.app_key;
let nonce_str = Math.random().toString(36).substr(2);
let access_time = Date.parse(new Date())/1000;
let app_secret = siteInfo.app_secret;
let access_sign = md5(md5(nonce_str+app_secret)+access_time);

const http = (params) => {
  //添加签名
  params.data.app_key = app_key;
  params.data.nonce_str = nonce_str;
  params.data.access_time = access_time;
  params.data.access_sign = access_sign;
  let access_token = wx.getStorageSync('access_token')
  if (access_token) {
    params.data.access_token = access_token
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl + params.url,//服务器url+参数中携带的接口具体地址
      data: params.data,//请求参数
      header: params.header || {
        "Content-Type": "application/json" //设置后端需要的常用的格式就好，特殊情况调用的时候单独设置
      },
      method: params.method || 'POST',//默认为GET,可以不写，如常用请求格式为POST，可以设置POST为默认请求方式
      dataType: params.dataType,//返回的数据格式,默认为JSON，特殊格式可以在调用的时候传入参数
      responseType: params.responseType,//响应的数据类型
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          console.log(res.data)
        }
      },
      fail: function(e) {
        reject(e)
      }
    })
  })
}

module.exports = {
  http: http
}
