let validate ={

    mobile:function (value) {
        return /^1[34578]\d{9}$/.test(value)
    },
    validCode:function (code) {
        return /^\d{6}$/.test(code)
    }

}
export default validate;
