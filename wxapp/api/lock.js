import { http } from '../utils/http'

let url = {
    addLock: "add_lock",
    getLockByArea: "get_area_locks",
    logs: "locks_log",
    updateLockName: "modify_lock_name",
}

module.exports = {
    addLock(params) {
        return http({
            url: url.addLock,
            data: params,
            method: "POST"
        })
    },
    getLockByArea(params) {
        return http({
            url: url.getLockByArea,
            data: params,
            method: "POST"
        })
    },
    updateLockName(params) {
        return http({
            url: url.updateLockName,
            data: params,
            method: "POST"
        })
    },
    getLogs(params) {
        return http({
            url: url.logs,
            data: params,
            method: "POST"
        })
    }
}
