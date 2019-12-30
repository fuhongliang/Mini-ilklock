import { http } from '../utils/http'

let url = {
    login: "login",
    getValidCode: "get_valid_code",
    bindMobile: "binding"
}

module.exports = {
    login(params) {
        return http({
            url: url.login,
            data: params,
            method: "POST"
        })
    },
    getValidCode(params) {
        return http({
            url: url.getValidCode,
            data: params,
            method: "POST"
        })
    },
    bindMobile(params) {
        return http({
            url: url.bindMobile,
            data: params,
            method: "POST"
        })
    }

}
