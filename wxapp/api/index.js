import { http } from '../utils/http'

let url = {
  index: "default/index",
  getUserPhone: "/user/phone",
}

module.exports = {
  index() {
    return http({
      url: url.index,
      data: { code: 11},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },
  getUserPhone(params) {
    return http({
      url: url.getUserPhone,
      data: params
    })
  },
}
