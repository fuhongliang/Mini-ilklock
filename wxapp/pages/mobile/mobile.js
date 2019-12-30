const app = getApp()
Page({
  data: {
    mobile: '',
    code: ''
  },
  onLoad: function (options) {
    app.page.onLoad(this, options);
  },

  getCode: function(e){
    if (app.validate.mobile(this.data.mobile) === false) {
       return void app.message.warning('请输入正确电话号')
    }
    app.api.user.getValidCode({phone:this.data.mobile})
        .then(data => {
          if (data.code === 0) {
            return void app.message.success(data.msg)
          }
        });
  },

  keyMobile: function(e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  keyCode: function (e) {
    this.setData({
      code: e.detail.value
    });
  },

  bindMobile: function() {
    if (app.validate.mobile(this.data.mobile) === false) {
      return void app.message.warning('请输入正确电话号')
    }
    if (app.validate.validCode(this.data.code) === false) {
      return void app.message.warning('请输入正确验证码')
    }
    app.api.user.bindMobile({phone:this.data.mobile,code:this.data.code})
        .then(data => {
          if (data.code === 0) {
            wx.setStorageSync('avatar', data.data.avatar)
            wx.setStorageSync('nickname', data.data.nickname)
            wx.setStorageSync('user', data.data.user)
            wx.redirectTo({
              url: 'pages/index/index'
            })
          } else {
            return void app.message.warning(data.msg)
          }
        });
  }


})
