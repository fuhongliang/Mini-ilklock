/***
 * promisfy BLE 
 * @author steephenliu
 * @date 2019-09-02
**/

export default class BLE {
  constructor() {}
  static openBluetoothAdapter(options = {}) {
    return new Promise((resolve, reject) => {
      wx.openBluetoothAdapter({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static startBluetoothDevicesDiscovery(options = {}) {
    return new Promise((resolve, reject) => {
      wx.startBluetoothDevicesDiscovery({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static stopBluetoothDevicesDiscovery(options = {}) {
    return new Promise((resolve, reject) => {
      wx.stopBluetoothDevicesDiscovery({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static getConnectedBluetoothDevices(options = {}) {
    return new Promise((resolve, reject) => {
      wx.getConnectedBluetoothDevices({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static getBluetoothDevices(options = {}) {
    return new Promise((resolve, reject) => {
      wx.getBluetoothDevices({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static getBluetoothAdapterState(options = {}) {
    return new Promise((resolve, reject) => {
      wx.getBluetoothAdapterState({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static closeBluetoothAdapter(options = {}) {
    return new Promise((resolve, reject) => {
      wx.closeBluetoothAdapter({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static writeBLECharacteristicValue(options = {}) {
    return new Promise((resolve, reject) => {
      wx.writeBLECharacteristicValue({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static readBLECharacteristicValue(options = {}) {
    return new Promise((resolve, reject) => {
      wx.readBLECharacteristicValue({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static notifyBLECharacteristicValueChange(options = {}) {
    return new Promise((resolve, reject) => {
      wx.notifyBLECharacteristicValueChange({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static getBLEDeviceServices(options = {}) {
    return new Promise((resolve, reject) => {
      wx.getBLEDeviceServices({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static getBLEDeviceCharacteristics(options = {}) {
    return new Promise((resolve, reject) => {
      wx.getBLEDeviceCharacteristics({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static createBLEConnection(options = {}) {
    return new Promise((resolve, reject) => {
      wx.createBLEConnection({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static closeBLEConnection(options = {}) {
    return new Promise((resolve, reject) => {
      wx.closeBLEConnection({
        ...options,
        success(...args) { resolve(args.length > 1 ? args : args[0]) },
        fail: reject,
      });
    });
  }
  static onBLEConnectionStateChange(cb) {
    wx.onBLEConnectionStateChange(cb);
  }
  static onBLECharacteristicValueChange(cb) {
    console.log('...bind onBLECharacteristicValueChange...');
    wx.onBLECharacteristicValueChange(cb);
  }
  static onBluetoothDeviceFound(cb) {
    wx.onBluetoothDeviceFound(cb);
  }
  static onBluetoothAdapterStateChange(cb) {
    wx.onBluetoothAdapterStateChange(cb);
  }

  static ERROR_MESSAFES = {
    10000: 'not init	未初始化蓝牙适配器',
    10001: 'not available	当前蓝牙适配器不可用',
    10002: 'no device	没有找到指定设备',
    10003: 'connection fail	连接失败',
    10004: 'no service	没有找到指定服务',
    10005: 'no characteristic	没有找到指定特征值',
    10006: 'no connection	当前连接已断开',
    10007: 'property not support	当前特征值不支持此操作',
    10008: 'system error	其余所有系统上报的异常',
    10009: 'system not support	Android 系统特有，系统版本低于 4.3 不支持BLE'
  };
}