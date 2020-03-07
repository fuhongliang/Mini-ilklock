// pages/device-select/device-select.js

import connector from '../../utils/ble-connector';
// const LockSdk = require('../../utils/locksdk');
// const { services, characteristics } = LockSdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devices: [{"deviceId":"test-key","localName":"test-key","name":"测试钥匙","advertisData":{},"RSSI":-77,signal:77}],
    messages: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    connector.off('found');
    connector.on('found', (devices) => {
      this.setData({
        devices,
      });
    });

    // this.setData({
    //   devices: [],
    // });

    // connector.open();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  backToIndex() {
    wx.hideLoading();
    wx.redirectTo({
      url: '/pages/index/index',
    });
  },

  onConnectTo(e) {
    const ds = e.currentTarget.dataset;
    wx.showLoading({ title: '连接中...', mask: true, });

    connector.status.current = 'connected';
    connector.status.connected = true;
    connector.device = {...this.data.devices[0]};
    connector.device.name = connector.device.name || connector.device.localName;
    connector.session = {};

    connector.emit('connected', connector.device);

    this.backToIndex();
    return;
    
    connector.connectTo(ds.deviceId).then(async () => {
      await this.handleHandshake();
    }).catch(e => {
      this.errorResult(e, '连接失败');
    });
  },

  errorResult(msg, title) {
    msg = msg || '连接失败';
    connector.close();
    wx.hideLoading();
    wx.showModal({
      title: title,
      content: typeof msg === 'string' ? msg : msg.message,
      showCancel: false,
    });

    connector.open();
  },

  async handleHandshake() {
    wx.showLoading({ title: '握手中...', mask: true, });

    const handshakeTimeout = setTimeout(() => {
      if (!connector.status.connected || connector.status.handshake) return;

      this.errorResult('握手超时');
    }, 15000);

    connector.off('data');
    connector.on('data', (res) => {
      if (res.uuid !== characteristics.key2sdk) return;

      console.log('device-select, ', res);
      
      let dis;
      try {
        dis = connector.sdk.distribute(res.value, connector.session);
      } catch(e) {
        console.log(e);

        clearTimeout(handshakeTimeout);
        this.errorResult('握手失败');
        return;
      }
      
      if (dis.cmd === 0x03) {
        clearTimeout(handshakeTimeout);
        this.setData({
          messages: [{
            title: '握手成功',
          }, ...this.data.messages]
        });
      } else if (dis.cmd === 0x01 || dis.cmd === 0x02) {
        connector.write(dis.bin, services.key, characteristics.sdk2key).catch(() => this.errorResult('握手失败'));;
      } else {
        this.setData({
          messages: [{
            title: '握手失败',
          }, ...this.data.messages]
        });
      }
    });

    connector.sdk.password = null;
    const hello = connector.sdk.sdkStartHandshake();
    connector.session = hello.store;
    connector.write(hello.bin, services.key, characteristics.sdk2key).catch(() => this.errorResult('握手失败'));
  }
})