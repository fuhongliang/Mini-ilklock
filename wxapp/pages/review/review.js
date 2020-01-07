const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        status: 6,
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
    },

    clickCreate:function() {
        wx.navigateTo({
            url: '/pages/apply_lock/apply_lock',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function(data) {
                    console.log(data)
                },
                someEvent: function(data) {
                    console.log(data)
                }
            },
            success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: app.page.currentPage.data })
            }
        })
    }

});
