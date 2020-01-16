//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showModal: false, // 显示modal弹窗
    single: false, // false 只显示一个按钮，如果想显示两个改为true即可
    cancelBtn: "取消",
    confirmBtn: "开启蓝牙",
    isLinked:false,
    allowLinkBtn: "授权",
    showLinkModal: true,
  },
  onLoad: function (options) {
    app.page.onLoad(this, options);
  },

  authKey() {
    wx.navigateTo({
      url: '/pages/auth_key/auth_key',
    })
  },

  authOffline() {
    wx.navigateTo({
      url: '/pages/auth_key/auth_key',
    })
  },

  clickWork() {
    wx.navigateTo({
      url: '/pages/work/work',
    })
  },

  clickLink() {
    this.setData({
      showLinkModal:true,
    })
  },
  cancelLinkModal(e) {
  },
  confirmLinkModal(e) {
    this.setData({
      isLinked:true,
    })
  },
  // 点击取消按钮的回调函数
  modalCancel(e) {
    // 这里面处理点击取消按钮业务逻辑
    console.log('点击了取消')
  },
  // 点击确定按钮的回调函数
  modalConfirm(e) {
    // 这里面处理点击确定按钮业务逻辑
    console.log('点击了确定')
    this.setData({
      isLinked:true,
    })
  }


})
