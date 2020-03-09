import connector from "../../utils/ble-connector";

const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        logs:{},
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
        app.api.lock.getLogs()
            .then(data => {
                console.log(data)
                if (data.code === 0) {
                    app.page.currentPage.setData({
                        logs: data.data.list
                    })
                }
            });
    },

});
