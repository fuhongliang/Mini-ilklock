import config from '../core/config'
module.exports = {
  currentPage: null,
  currentPageOptions: {},
  navbarPages: [ "pages/index/index",],
  app: getApp(),

  onLoad: function(that, options) {
    console.log("--------pageOnLoad----------"); this.currentPage = that;
    this.currentPage = that; this.currentPageOptions = options;
    this.setDeviceInfo();
    this.setPageNavbar();
  },
  onReady: function(that) {
    console.log("--------pageOnReady----------"), this.currentPage = that;
  },
  onShow: function(that) {
    console.log("--------pageOnShow----------"), this.currentPage = that;
  },
  onHide: function(that) {
    console.log("--------pageOnHide----------"), this.currentPage = that;
  },
  onUnload: function(that) {
    console.log("--------pageOnUnload----------"), this.currentPage = that;
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
    for (let n in navs) navs[n].url === "/" + currentRoute ? (navs[n].active = !0) : navs[n].active = !1;
    this.currentPage.setData({
      iLockNavbar:navs
    })
  },





};
