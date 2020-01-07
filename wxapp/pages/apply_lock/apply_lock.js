const app = getApp()
Page({
    data: {
        locks_id: "",
        auditor_id: "",
        auditor_name: "",
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
    },

    selectLock: function () {
        let that = this;
        wx.navigateTo({
            url: '/pages/lock_list/lock_list',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromLockListPage: function(data) {
                    that.setData(data)
                },
                acceptDataFromAuditorPage: function(data) {
                    console.log('auditor---', data)
                    that.setData(data)
                }
            },
            success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', that.data)
            }
        })
    },

    selectAuditor: function() {
        let that = this;
        wx.navigateTo({
            url: '/pages/auditor/auditor',
            events: {
                acceptDataFromAuditorPage: function(data) {
                    that.setData(data)
                }
            },
            success: function(res) {
                res.eventChannel.emit('acceptDataFromOpenerPage', that.data)
            }
        })
    }



});
