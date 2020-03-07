const app = getApp()

Page({
    data: {
        motto: 'Hello World',
    },
    onLoad: function (options) {
        app.page.onLoad(this, options);
    },

    handleImportWork() {
        wx.showLoading({
            title: '作业导入中',
            icon: 'none',
            mask: true,
        });

        setTimeout(() => {
            wx.hideLoading();
            wx.showToast({ title: '导入完成', icon: 'success' });
        }, 3500);
    }

});
