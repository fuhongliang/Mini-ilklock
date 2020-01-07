const app = getApp()
Page({
    data: {
        motto: 'Hello World',
        auditors: "",
        selected_auditor_id: "",
        selected_auditor_name: "",
        openerPageData: "",
        eventChannel: ""
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
        const eventChannel = this.getOpenerEventChannel()
        if (Object.keys(eventChannel).length > 0) {
            // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
            eventChannel.on('acceptDataFromOpenerPage', function(data) {
                app.page.currentPage.setData({
                    openerPageData:data,
                    eventChannel: eventChannel
                })
            })

        }
        this.getAuditor()
    },

    getAuditor: function() {
        app.api.auditor.getAuditorList({type:'ol'})
            .then(data => {
                if (data.code === 0) {
                    app.page.currentPage.setData({
                        auditors: data.data.list
                    })
                } else{
                    return void app.message.warning(data.msg)
                }
            });
    },

    selectAuditor: function (e) {
        let auditor_id = e.currentTarget.dataset.id
        let auditor_name = e.currentTarget.dataset.name
        let auditors = this.data.auditors;
        let tmp = auditors;
        for(let index in auditors) {
            let item = auditors[index]
            if (item.audit_id === auditor_id) {
                if (!item.selected) {
                    item.selected = true;
                }
            } else {
                item.selected = false;
            }
            tmp[index] = item;
        };
        this.setData({
            selected_auditor_name: auditor_name,
            selected_auditor_id: auditor_id,
            auditors: tmp
        })
    },

    confirmSelect: function() {
        let openerPageData = this.data.openerPageData;
        openerPageData.auditor_id = this.data.selected_auditor_id
        openerPageData.auditor_name = this.data.selected_auditor_name

        //把数据传回申请页面
        this.data.eventChannel.emit('acceptDataFromAuditorPage', openerPageData);
        wx.navigateBack({});
    }


});
