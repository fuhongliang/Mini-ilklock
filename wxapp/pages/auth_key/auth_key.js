const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        lockList: [
            {'lock_name':"有权限锁名称","lock_id":1,'lock_key':""},
            {'lock_name':"有权限锁名称","lock_id":2,'lock_key':""},
            {'lock_name':"有权限锁名称","lock_id":3,'lock_key':""},
            {'lock_name':"有权限锁名称","lock_id":4,'lock_key':""},
            {'lock_name':"有权限锁名称","lock_id":5,'lock_key':""},
            {'lock_name':"有权限锁名称","lock_id":6,'lock_key':""},
        ],
        selectAll:false,
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
    },

    selectAll:function() {
        let lockList = this.data.lockList;
        let tmp = lockList;
        for(let index in lockList) {
            let locks = lockList[index]
            locks.selected = true;
            tmp[index] = locks
        };
        this.setData({
            selectAll: true,
            lockList: tmp
        })
    },
    selectLock:function(e) {
        let lock_id = e.currentTarget.dataset.id
        let lockList = this.data.lockList;
        let tmp = lockList;
        for(let index in lockList) {
            let locks = lockList[index]
            if (locks.lock_id === lock_id) {
                if (!locks.selected) {
                    locks.selected = true;
                } else {
                    locks.selected = false;
                }
            }
            tmp[index] = locks
        };
        let selectAll = true;
        for (let i in tmp) {
            if (tmp[i].selected === undefined || tmp[i].selected === false) {
                selectAll = false;
            }
        }
        this.setData({
            selectAll: selectAll,
            lockList: tmp
        })
    },

    confirmImport: function () {
        wx.redirectTo({
            url: '/pages/index/index'
        })
    }

});
