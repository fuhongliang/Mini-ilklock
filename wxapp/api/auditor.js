import { http } from '../utils/http'

let url = {
    getAudits: "get_audits",
}

module.exports = {
    getAuditorList(params) {
        return http({
            url: url.getAudits,
            data: params,
            method: "POST"
        })
    },
}
