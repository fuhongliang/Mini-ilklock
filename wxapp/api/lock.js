import { http } from '../utils/http'

let url = {
    addLock: "add_lock",
    getLockByArea: "get_area_locks",
    logs: "locks_log",
    updateLockName: "modify_lock_name",
    applyLock: "apply_open_lock",
    reviewList: "list_apply",
    getKey: "get_keys",
    createLog: "log",
    authOpenLock: "auth_open_lock",
}

module.exports = {
    applyList(params) {return http({url: url.reviewList, data: params, method: "POST"})},
    applyOpenLock(params) {return http({url: url.applyLock, data: params, method: "POST"})},
    addLock(params) {return http({url: url.addLock, data: params, method: "POST"})},
    getLockByArea(params) {return http({url: url.getLockByArea, data: params, method: "POST"})},
    updateLockName(params) {return http({url: url.updateLockName, data: params, method: "POST"})},
    getLogs(params) {return http({url: url.logs, data: params, method: "POST"})},
    getAuthKeys(params) {return http({url: url.getKey, data: params, method: "POST"})},
    createLog(params) {return http({url: url.createLog, data: params, method: "POST"})},
    authOpenLock(params) {return http({url: url.authOpenLock, data: params, method: "POST"})}
}
