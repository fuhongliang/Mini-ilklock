const app = getApp()

Page({
    data: {
        type: 0,
        recordList: [],
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
        this.reviewList(0,1);
    },
    onReachBottom: function() {

    },
    clickType: function(e) {
        let type = e.currentTarget.dataset.type
        if (parseInt(type) === this.data.type) {return;}
        this.setData({type: parseInt(type)});
        let currentPage = this.data.recordList[type] === undefined ? 1 : this.data.recordList[type].page;
        this.reviewList(type, currentPage)
    },
    //0: 待处理, 1:已处理, 2:已提交 3:已批准 4:未完成
    reviewList: function(type,page) {
        let reviewType = type;
        let currentPage = this.data.recordList[reviewType] === undefined ? 1 : this.data.recordList[reviewType].page;
        let currentSize = this.data.recordList[reviewType] === undefined ? 10 : this.data.recordList[reviewType].page_size;
        //是否需要获取数据
        if (this.data.recordList[reviewType] !== undefined) {
            if (currentPage === page) {
                return;
            }
        }
        wx.showLoading({
            title: '加载中',
        });
        app.api.lock.applyList({type:parseInt(reviewType), page:currentPage, page_size:currentSize})
            .then(data => {
                if (data.code === 0) {
                    wx.hideLoading({})
                    let record = data.data.records;
                    let all = app.page.currentPage.data.recordList;
                    let originData = all[reviewType];
                    let tmpRecord = originData !== undefined ? originData.record.concat(record) : record;
                    let tmpObj = {page:currentPage, page_size: currentSize, record: tmpRecord}
                    all[reviewType] = tmpObj
                    app.page.currentPage.setData({
                        recordList: all
                    })
                } else {
                    wx.hideLoading({})
                    return void app.message.warning(data.msg)
                }
            });
    },
    clickCreate:function() {
        wx.navigateTo({
            url: '/pages/apply_lock/apply_lock',
        })
    }



});
