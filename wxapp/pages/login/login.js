const app = getApp();

Page({
  data: {
    motto: 'Hello World',
  },
  onLoad: function (options) {
    app.page.onLoad(this, options);
  },
  login: () => {
    //请求用户授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success () {
              //授权成功
              app.page.currentPage.unionLogin()
            },
            fail (e) {
              console.log('auth fail', e)
            }
          })
        } else {
          app.page.currentPage.unionLogin()
        }
      }
    })
  },

  unionLogin:(e)=> {
    wx.showLoading({
      title: '加载中',
    });
    //先拿到code
    wx.login({
          success: res => {
            wx.getUserInfo({
              success: function (getUserInfoRes) {
                app.api.user.login({
                  code: res.code,
                  rawData: getUserInfoRes.rawData,
                  encryptedData: getUserInfoRes.encryptedData,
                  iv: getUserInfoRes.iv,
                  signature: getUserInfoRes.signature
                }).then(data => {
                  console.log('data', data)
                  console.log('data.code', data.code)
                  if (data.code === 1) {
                    //保存access_token 跳转到绑定手机
                    wx.setStorageSync('access_token', data.data.access_token)
                    console.log('redirectTo', data.code)
                    wx.redirectTo({
                      url: '/pages/mobile/mobile'
                    })
                  }
                  if (data.code === 0) {
                    wx.setStorageSync('access_token', data.data.access_token)
                    wx.setStorageSync('avatar', data.data.avatar)
                    wx.setStorageSync('nickname', data.data.nickname)
                    wx.setStorageSync('user', data.data.user)
                    wx.redirectTo({
                      url: 'pages/index/index'
                    })
                  }
                })
              },
              fail: e => {
                console.log('getUserInfo fail', e)
              },
            })
          },
          fail: e => {
            console.log('login fail', e)
          },
          complete: () => {
            wx.hideLoading({})
          }
        }
    );
  }




});
