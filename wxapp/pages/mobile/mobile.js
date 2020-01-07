const app = getApp()
Page({
  data: {
    mobile: '',
    code: '',
    count:60,
    get_code_text:'获取验证码',
  },
  onLoad: function (options) {
    app.page.onLoad(this, options);
  },

  getCode: function(e){
    if (app.validate.mobile(this.data.mobile) === false) {
       return void app.message.warning('请输入正确电话号')
    }
    if(app.page.currentPage.data.get_code_text !== '获取验证码'){
      return void app.message.warning('请等待')
    }
    const countDown = setInterval(() => {
      if(app.page.currentPage.data.count <= 0){
        app.page.currentPage.setData({
          count:60,
          get_code_text:'获取验证码'
        })
        clearInterval(countDown)
        return
      }
      app.page.currentPage.data.count --
      app.page.currentPage.setData({
        count: app.page.currentPage.data.count,
        get_code_text: app.page.currentPage.data.count < 10 ? `请等待0${app.page.currentPage.data.count}s` : `请等待${app.page.currentPage.data.count}s`
      })
    },1000);

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
    wx.showLoading({
      title: '加载中',
    });
    app.api.user.bindMobile({phone:this.data.mobile,code:this.data.code})
        .then(data => {
          if (data.code === 0) {
            wx.setStorageSync('avatar', data.data.avatar)
            wx.setStorageSync('nickname', data.data.nickname)
            wx.setStorageSync('user', data.data.user)
            wx.redirectTo({
              url: '/pages/index/index'
            })
          } else {
            wx.hideLoading({})
            return void app.message.warning(data.msg)
          }
        });
  }


})
