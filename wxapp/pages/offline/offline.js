const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        lockList: [],
        selectAll:false,
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
        //todo 换成获取所有锁接口
        app.api.lock.getAuthKeys()
            .then(data => {
                if (data.code === 0) {
                    app.page.currentPage.setData({
                        lockList: data.data.list
                    })
                }
            });
    },

    selectAll:function() {
        let lockList = this.data.lockList;
        let tmp = lockList;
        let status = this.data.selectAll === false;
        for(let index in lockList) {
            let locks = lockList[index]
            locks.selected = status
            tmp[index] = locks
        };
        this.setData({
            selectAll: status,
            lockList: tmp
        })
    },
    selectLock:function(e) {
        let lock_no = e.currentTarget.dataset.id
        let lockList = this.data.lockList;
        let tmp = lockList;
        for(let index in lockList) {
            let locks = lockList[index]
            if (locks.lock_no === lock_no) {
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
