import config from '../core/config'
module.exports = {
  currentPage: null,
  currentPageOptions: {},
  app: getApp(),

  onLoad: function(that, options) {
    this.currentPage = that; this.currentPageOptions = options;
    this.setDeviceInfo();
    this.setPageNavbar();
    this.needToLogin();
  },
  onReady: function(that) {
    this.currentPage = that;
  },
  onShow: function(that) {
    this.currentPage = that;
  },
  onHide: function(that) {
    this.currentPage = that;
  },
  onUnload: function(that) {
    this.currentPage = that;
  },
  onPullDownRefresh: function() {
  },
  onReachBottom: function() {
  },
  onShareAppMessage: function () {
  },
  onPageScroll: function() {
  },
  onResize: function() {
  },
  setDeviceInfo: function () {
    let e = this.currentPage, t = [
      {id: "device_iphone_5", model: "iPhone 5"},
      {id: "device_iphone_x", model: "iPhone X"}], o = wx.getSystemInfoSync();
    if (o.model) {
      for (var n in 0 <= o.model.indexOf("iPhone X") && (o.model = "iPhone X"), t) t[n].model == o.model && e.setData({
        iLockDevice: t[n].id
      });
    }
  },

  setPageNavbar: function() {
    let navs = config.iLockNavbar;
    let currentRoute = this.currentPage.route || null;
    for (let n in navs) navs[n].url === `/${currentRoute}` ? (navs[n].active = !0) : navs[n].active = !1;
    this.currentPage.setData({
      iLockNavbar:navs
    })
  },

  needToLogin: function() {
    // return;
    let currentRoute = this.currentPage.route
    let noNeedLoginPage = ["pages/login/login", "pages/mobile/mobile"];
    let needLogin = true
    for (let index in noNeedLoginPage) {
      if (currentRoute === noNeedLoginPage[index]) {
        needLogin = false
        break;
      }
    }
    if (needLogin === true) {
      let access_token = wx.getStorageSync('access_token')
      let user = wx.getStorageSync('user')
      console.log('access_token', access_token)
      if (!user) {
        if (!access_token) {
          //需要登录
          return void wx.redirectTo({
            url: "/pages/login/login"
          });
        } else {
          //绑定手机号
          wx.redirectTo({
            url: '/pages/mobile/mobile'
          })
        }
      }
    }
  }









};
