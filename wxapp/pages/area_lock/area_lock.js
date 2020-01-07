const app = getApp()

Page({
    data: {
        firstArea: [],
        secondArea: [],
        lockList: [],
        showList: [],
        active_id: "",
        motto: 'Hello World',
        single: false,
        cancelBtn: "取消",
        confirmBtn: "保存",
        showEditModal: false,
        lock_name: "",
        edit_id: "",
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
        this.firstArea()
        this.test()
    },
    clickLockName:function(e) {
        let lock_id = e.currentTarget.dataset.id
        let lock_name = e.currentTarget.dataset.name
        this.setData({
            edit_id:lock_id,
            showEditModal: true,
            lock_name: lock_name
        })
    },
    keyLockName:function(e) {
        this.setData({
            lock_name: e.detail.value
        });
    },
    cancelEditModal:function() {
        this.setData({
            showEditModal:false
        })
    },
    confirmEditModal:function() {
        if (app.validate.required(this.data.lock_name) === false) {
            return void app.message.warning('请输入锁名称')
        }
        this.setData({
            showEditModal:false
        })
        wx.showLoading({
            title: '加载中',
        });
        app.api.lock.updateLockName({id: this.data.edit_id, name:this.data.lock_name})
            .then(data => {
                if (data.code === 0) {
                    wx.redirectTo({
                        url: '/pages/area_lock/area_lock'
                    })
                } else {
                    wx.hideLoading({})
                    return void app.message.warning(data.msg)
                }
            });
    },
    test:()=>{
        app.api.lock.getLogs()
            .then(data => {
                if (data.code === 0) {
                    console.log('logs------', data)
                }
            });
    },
    clickFirst:function(e){
        let area_id = e.currentTarget.dataset.id
        this.getSecondArea(area_id)
    },
    firstArea: ()=> {
        app.api.area.getArea({id: 0})
            .then(data => {
                if (data.code === 0) {
                    app.page.currentPage.setData({firstArea: data.data.list})
                }
            }).then(() => {
            app.page.currentPage.getSecondArea(app.page.currentPage.data.firstArea[0]['id'])
        });
    },
    getSecondArea:(id)=> {
        app.api.area.getArea({id:id})
            .then(data => {
                if (data.code === 0) {
                    app.page.currentPage.setData({
                        active_id: id,
                        secondArea: data.data.list
                    })
                }
            });
    },
    getLocks:(e)=> {
        let area_id = e.currentTarget.dataset.id
        //判断是否已经获取过
        console.log('show---', app.page.currentPage.data.showList[area_id])
        if (app.page.currentPage.data.showList[area_id] === true
            || app.page.currentPage.data.showList[area_id] === false
        ) {
            console.log('show---', 'in')
            let tmp = app.page.currentPage.data.showList;
            tmp[area_id] = tmp[area_id] !== true;
            app.page.currentPage.setData({
                showList: tmp
            })
            return;
        }
        app.api.lock.getLockByArea({id:area_id})
            .then(data => {
                if (data.code === 0) {
                    let tmpLocks = app.page.currentPage.data.lockList;
                    tmpLocks[area_id] = data.data.list;
                    let tmpShow = app.page.currentPage.data.showList;
                    tmpShow[area_id] = true;
                   app.page.currentPage.setData({
                       lockList: tmpLocks,
                       showList:tmpShow
                   })
                }
            }).then(()=>{console.log('test----', app.page.currentPage.data)});
    },


});
