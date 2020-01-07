const app = getApp()

Page({
    data: {
        firstArea: [],
        secondArea: [],
        lockList: [],
        showList: [],
        active_id: "",
        motto: 'Hello World',
        openerPageData: "",
        eventChannel: ""
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
        const eventChannel = this.getOpenerEventChannel()
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        if (Object.keys(eventChannel).length > 0) {
            eventChannel.on('acceptDataFromOpenerPage', function(data) {
                app.page.currentPage.setData({
                    openerPageData:data,
                    eventChannel: eventChannel
                })
            })
        }
        this.firstArea()
        this.test()
    },
    clickLockName:function(e) {
        let lock_id = e.currentTarget.dataset.id
        let lock_name = e.currentTarget.dataset.name
        let lockList = this.data.lockList;
        let tmp = lockList;
        for(let index in lockList) {
            let area_id = index;
            let locks = lockList[index]
            for (let i in locks) {
                let item = locks[i];
                if (item.id === lock_id) {
                    if (!item.selected) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                }
                tmp[area_id][i] = item;
            }
        };
        this.setData({
            lockList: tmp,
            edit_id:lock_id,
            showEditModal: true,
            lock_name: lock_name
        })
    },
    test:()=>{
        app.api.lock.getLogs()
            .then(data => {
                if (data.code === 0) {
                    console.log('logs------', data)
                }
            });
    },
    confirmSelect: function() {
        let lockList = this.data.lockList;
        let selectedData = [];
        for(let index in lockList) {
            let locks = lockList[index]
            for (let i in locks) {
                let item = locks[i];
                if (item.selected === true) {
                    selectedData.push(item.id);
                }
            }
        };
        this.data.openerPageData.locks_id = selectedData
        //把数据传回申请页面
        this.data.eventChannel.emit('acceptDataFromLockListPage', this.data.openerPageData);
        wx.navigateBack({});
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
