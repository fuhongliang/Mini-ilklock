import page from './core/page'
import api from './api/api'
import config from './core/config'
import message from './utils/message'
import validate from './utils/validate'


let args = {
  api,
  page,
  config,
  message,
  validate,
  query: null,
  onLaunch: function () {},
  onShow: function(e) {
    console.log("--------app onShow----------", e)
    e.scene && (this.onShowData = e), e && e.query && (this.query = e.query);
  },
  globalData: {
    userInfo: null
  }
}

App(args);
