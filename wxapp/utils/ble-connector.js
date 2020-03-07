/***
 * BleConnector
 * @author steephenliu
 * @date 2019-09-02
**/

import EventEmitter from './event-emitter';
// import KeySdk from './locksdk';
import BleApi from './ble-api';
import base64 from './base64';

class BleConnector extends EventEmitter {
  status = {
    current: null,
    handshake: false,
    discovery: false,
    connected: false,
    receiveTimeout: 0,
    
    readCache: [],
    totalLength: 0,
  };
  device = {};
  foundDevices = [];
  options = {
    debug: true,
    name: null,
    characteristics: [],
    services: [],
  };
  // sdk = new KeySdk();
  session = {};

  constructor() {
    super()
    this.initEvent();
  }

  initEvent() {
    function throttle(fn, gapTime) {
      let _lastTime = null;
    
      return function (...args) {
        let _nowTime = + new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
          fn(...args);
          _lastTime = _nowTime
        }
      }
    }
    // 
    BleApi.onBluetoothAdapterStateChange((res) => {
      this.log('onBluetoothAdapterStateChange', res)
      
      if (res.available && this.status.current === 'open') {
        this.open()
      }
    });

    //
    const throttleHandleDeviceFound = throttle((res) => {
      this.handleDeviceFound(res)
    }, 500);
    BleApi.onBluetoothDeviceFound((res) => {
      throttleHandleDeviceFound(res);
    });

    //
    BleApi.onBLEConnectionStateChange((res) => {
      if (!this.status.connected) return;
      if (res.deviceId !== this.device.deviceId) return;

      if (!res.connected) {
        this.close();
      }
    });

    // BleApi.onBLECharacteristicValueChange((res) => {
    //   console.log('...onBLECharacteristicValueChange...');
    //   this.handleCharacteristicValueChange(res);
    // })
  }

  open(options) {
    if (this.status.connected) this.close();

    Object.assign(this.options, options);

    this.status.current = 'open';
    this.status.connected = false;
    this.status.discovery = false;
    this.status.readCache = [];

    BleApi.openBluetoothAdapter().then((res) => {
      this.log('openBluetoothAdapter success', res);
      this.startDiscovery();
    }).catch((res) => {
      if (res.errCode === 10001) {
        wx.showModal({
          title: '蓝牙异常',
          content: '蓝牙已关闭，请手动打开蓝牙开关',
        });
      } else {
        wx.showModal({
          title: '蓝牙异常',
          content: BleApi.ERROR_MESSAFES[res.errCode] || '蓝牙设备初始化异常',
        });
      }
    });
  }
  startDiscovery() {
    if (this.status.connected) return;

    this.status.current = 'discovery';
    this.status.discovery = true

    BleApi.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
    }).then(async () => {
      this.log('startBluetoothDevicesDiscovery success')
    });
  }
  handleDeviceFound(res) {
    res.devices.forEach(device => {
      const deviceName = device.name || device.localName;

      if (!deviceName) return;
      if (typeof this.options.name === 'string' && this.options.name !== deviceName) return;
      if (this.options.name instanceof RegExp && !this.options.name.test(deviceName)) return;

      device.update = Date.now();

      const foundDevices = this.foundDevices;
      const idx = foundDevices.findIndex(d => d.deviceId === device.deviceId);
      if (idx === -1) {
        foundDevices.push(device);
      } else {
        foundDevices[idx] = device;
      }
    })

    this.foundDevices = this.foundDevices.filter(i => {
      i.signal = Math.max(0, i.RSSI + 100);
      if (!i.update) return true;
      if (Date.now() - i.update > 10000) return false;
      
      return true;
    });
    
    this.emit('found', [...this.foundDevices]);
  }

  /**
   * 
   * @param {String} deviceId 
   */
  connectTo(deviceId) {
    if (this.status.connected) return Promise.reject('设备已连接');

    const index = this.foundDevices.findIndex(d => d.deviceId === deviceId);
    if (index === -1) return Promise.reject('设备不存在');

    this.status.current = 'connecting';
    const device = this.foundDevices[index];
    return new Promise(async (resolve, reject) => {
      let rejectFlag = false;
      const connectTimeout = setTimeout(() => {
        reject();
        this.close();
        rejectFlag = true;
      }, 15000);

      try { 
        await BleApi.createBLEConnection({ deviceId });
        const services = await this.getBLEDeviceServices(deviceId);
        for (let i = 0; i < services.length; i++) {
          const serviceId = services[i].uuid;
          await this.getBLEDeviceCharacteristics(deviceId, serviceId);
        }
      } catch (e) {
        this.status.connected = false;
        throw e;
      }
      if (rejectFlag) return Promise.reject('连接超时');
      clearTimeout(connectTimeout);
      
      this.stopDiscovery();
  
      this.status.current = 'connected';
      this.status.connected = true;
      this.device = {...device};
      this.device.name = device.name || device.localName;
      this.session = {};
      
      BleApi.onBLECharacteristicValueChange((res) => {
        console.log('...onBLECharacteristicValueChange...');
        this.handleCharacteristicValueChange(res);
      })
      resolve();
      this.emit('connected', this.device);
    });
  }

  // 
  async getBLEDeviceServices(deviceId) {
    const res = await BleApi.getBLEDeviceServices({ deviceId });

    this.log('found service: %s', res.services.map(i => i.uuid).join(', '));

    if (this.options.services.length > 0) {
      const totalServices = new Set(res.services.map(s => s.uuid));

      if (!this.options.services.every(c => totalServices.has(c))) {
        await BleApi.closeBLEConnection({ deviceId });
        
        throw new Error('指定服务不存在！');
      }
    }

    return res.services;
  }

  // 
  async getBLEDeviceCharacteristics(deviceId, serviceId) {
    const res = await BleApi.getBLEDeviceCharacteristics({ deviceId, serviceId });

    this.log('found characteristics in %s: %s', serviceId, res.characteristics.map(i => i.uuid).join(', '));

    for (let i = 0; i < res.characteristics.length; i++) {
      let item = res.characteristics[i]
      if (item.properties.read) {
        // wx.readBLECharacteristicValue({
        //   deviceId,
        //   serviceId,
        //   characteristicId: item.uuid,
        // })
      }
      if (item.properties.write) {
        // this.setData({
        //   canWrite: true
        // })
        // this._deviceId = deviceId
        // this._serviceId = serviceId
        // this._characteristicId = item.uuid
        // this.writeBLECharacteristicValue()
      }
      if (item.properties.notify || item.properties.indicate) {
        wx.notifyBLECharacteristicValueChange({
          deviceId,
          serviceId,
          characteristicId: item.uuid,
          state: true,
        })
      }
    }
    
    return res.characteristics;
  }

  async subscribe(service, characteristic) {
    if (!this.status.connected) return;

    await BleApi.notifyBLECharacteristicValueChange({
      deviceId: this.device.deviceId,
      serviceId: service,
      characteristicId: characteristic,
      state: true,
    });
  }

  handleCharacteristicValueChange(characteristic) {
    if (!this.status.connected) return;

    console.log('handleCharacteristicValueChange: ');
    console.log(characteristic);
    const hexValue = base64.bufToHex(characteristic.value);
    if (/^dd/.test(hexValue) && this.status.readCache.length === 0) {
      this.status.totalLength = parseInt(hexValue.substr(2, 2), 16);
    }

    this.status.totalLength -= Math.round(hexValue.length / 2);
    this.status.readCache.push(hexValue);
    
    if (this.status.totalLength > 0) return;

    const value = this.status.readCache.join('');
    this.log(`read value, [${characteristic.characteristicId}] ${value}`);

    this.status.readCache = [];

    clearTimeout(this.status.receiveTimeout);
    this.emit('data', {
      uuid: characteristic.characteristicId,
      value: value,
    });

  }

  async write(hex, service, characteristic, source, retry = 3) {
    if (!this.status.connected) throw new Error('蓝牙未连接');
    if (!hex) return;
    if (!source) source = hex;
    
    clearTimeout(this.status.receiveTimeout);

    const send = hex.substr(0, 40);
    const left = hex.substr(40);

    this.log('write value: ', send);

    const buf = base64.hexToBuf(send)

    try { 
      // 向蓝牙设备发送一个0x00的16进制数据
      await BleApi.writeBLECharacteristicValue({
        deviceId: this.device.deviceId,
        serviceId: service,
        characteristicId: characteristic,
        value: buf,
      });
    } catch(e) {
      if (retry === 1) {
        throw new Error('数据发送失败，' + e.message);
      }
      return await this.write(source, service, characteristic, source, retry - 1);
    }
    
    if (left) {
      await this.write(left, service, characteristic, source, retry);
    }

    this.status.receiveTimeout = setTimeout(() => {
      this.emit('timeout', source);
    }, 2500);
  }

  stopDiscovery() {
    this.status.connected = false;
    BleApi.stopBluetoothDevicesDiscovery();
  }
  close() {
    this.status.current = null;
    this.status.connected = false;
    this.status.discovery = false;
    BleApi.closeBluetoothAdapter();
    this.emit('close', this.device.deviceId);
  }

  log(...args) {
    this.options.debug && console.log(...args);
  }
}

export default new BleConnector();