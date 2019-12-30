let def = {
    duration: 2000,
    title: '',
    icon: 'none',
}
let message ={
    success:function (params){
        return new Promise((resolve, reject) => {
            this.opera('success', params);
        })
    },
    error:function(params){
        return new Promise((resolve, reject) => {
            this.opera('error', params);
        })
    },
    warning: function (params){
        return new Promise((resolve, reject) => {
            this.opera('warning', params);
        })
    },
    loading: function (params){
        return new Promise((resolve, reject) => {
            this.opera('loading', params);
        })
    },
    opera:function(type,params){
        let toastParams = def
        toastParams.title = params
        if (type === 'success') {
        } else if (type === 'error') {
        } else if (type === 'warning') {
        } else if (type === 'loading') {
        }
        wx.showToast(toastParams)
    }
}
export default message;
