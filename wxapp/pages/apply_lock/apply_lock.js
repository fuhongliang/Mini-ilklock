const app = getApp()
Page({
    data: {
        locks_id: "",
        auditor_id: "",
        auditor_name: "",
        start_date: "",
        end_date: "",

        selectedStartDate: "",
        selectedEndDate: "",
        startShow: false,
        endShow: false,
        minHour: 10,
        maxHour: 20,
        minDate: new Date().getTime(),
        maxDate: new Date(2022, 1, 1).getTime(),
        currentDate: new Date().getTime(),
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`;
            } else if (type === 'day') {
                return `${value}日`
            } else if (type === 'hour') {
                return `${value}时`
            } else if (type === 'minute') {
                return `${value}分`
            }
            return value;
        }
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
    },


    confirmStartDate(event) {
        let year = new Date(this.data.selectedStartDate).getFullYear();
        let month = new Date(this.data.selectedStartDate).getMonth() + 1;
        let date = new Date(this.data.selectedStartDate).getDate();
        let hours = new Date(this.data.selectedStartDate).getHours();
        let minutes = new Date(this.data.selectedStartDate).getMinutes();
        let tmp = `${year}-${month}-${date} ${hours}:${minutes}`
        this.setData({
            startShow: false,
            start_date: tmp
        });
    },

    confirmEndDate(event) {
        let year = new Date(this.data.selectedEndDate).getFullYear();
        let month = new Date(this.data.selectedEndDate).getMonth() + 1;
        let date = new Date(this.data.selectedEndDate).getDate();
        let hours = new Date(this.data.selectedEndDate).getHours();
        let minutes = new Date(this.data.selectedEndDate).getMinutes();
        let tmp = `${year}-${month}-${date} ${hours}:${minutes}`
        this.setData({
            endShow: false,
            end_date: tmp,
        });
    },

    showStartPopup() {
        this.setData({ startShow: true });
    },
    showEndPopup() {
        this.setData({ endShow: true });
    },

    closeStartPopup() {
        this.setData({ startShow: false });
    },
    closeEndPopup() {
        this.setData({ endShow: false });
    },

    startOnInput(event) {
        this.setData({
            selectedStartDate: event.detail
        });
    },
    endOnInput(event) {
        this.setData({
            selectedEndDate: event.detail
        });
    },

    cancelStartDate() {
        this.setData({ startShow: false });
    },
    cancelEndDate() {
        this.setData({ startShow: false });
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
