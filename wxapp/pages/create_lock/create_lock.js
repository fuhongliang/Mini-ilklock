const app = getApp()
Page({
    data: {
        firstArea: [],
        secondArea: [],
        multiArray: [],
        multiIndex: [],
        region_id: "",
        lock_name: "",
        lock_no: Math.random().toString(32).substr(2),
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
        this.getFirstArea()
    },
    onShow:function() {
    },
    getFirstArea: ()=> {
        app.api.area.getArea({id: 0})
            .then(data => {
                if (data.code === 0) {
                   app.page.currentPage.setData({firstArea: data.data.list})
                }
            }).then(() => {
            app.page.currentPage.initGetSecondArea(app.page.currentPage.data.firstArea[0]['id'])
        });
    },
    initGetSecondArea:(id)=> {
        app.api.area.getArea({id:id})
            .then(data => {
                if (data.code === 0) {
                    app.page.currentPage.setData({secondArea: data.data.list})
                }
            }).then(()=> {
            let multiArray = [app.page.currentPage.data.firstArea, app.page.currentPage.data.secondArea];
            app.page.currentPage.setData({multiArray:multiArray});
        });
    },

    bindMultiPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        console.log('第二区', this.data.multiArray[1][e.detail.value[1]]['id'])
        let region_id = this.data.multiArray[1][e.detail.value[1]]['id']
        this.setData({
            multiIndex: e.detail.value,
            region_id: region_id
        })
    },

    bindMultiPickerColumnChange: function (e) {
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value, this.data.multiArray);
        let tmp = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        tmp.multiIndex[e.detail.column] = e.detail.value;
        if (e.detail.column === 0) {
            let parent_id = tmp.multiArray[0][tmp.multiIndex[0]]['id']
            app.api.area.getArea({id:parent_id})
                .then(data => {
                    if (data.code === 0) {
                        tmp.multiArray[1] = data.data.list
                    }
                }).then(()=>{
                app.page.currentPage.setData(tmp)
            });
        }
    },
    keyLockName: function (e) {
        this.setData({
            lock_name: e.detail.value
        });
    },

    createLock:function(e) {
        if (app.validate.required(this.data.lock_name) === false) {
            return void app.message.warning('请输入锁名称')
        }
        if (app.validate.isInt(this.data.region_id) === false) {
            return void app.message.warning('请选择区域')
        }
        if (app.validate.required(this.data.lock_no) === false) {
            return void app.message.warning('锁编号不能为空')
        }
        app.api.lock.addLock({
            lock_name:this.data.lock_name,
            lock_no:this.data.lock_no,
            region_id:this.data.region_id
        }).then(data => {
                if (data.code === 0) {
                    wx.redirectTo({
                        url: '/pages/index/index'
                    })
                } else {
                    return void app.message.warning(data.msg)
                }
            });
    }

});
