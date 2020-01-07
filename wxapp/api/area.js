import { http } from '../utils/http'

let url = {
    getArea: "get_area",
}

module.exports = {
    getArea(params) {
        return http({
            url: url.getArea,
            data: params,
            method: "POST"
        })
    },

}
