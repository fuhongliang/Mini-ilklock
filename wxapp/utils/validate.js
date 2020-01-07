let validate ={

    mobile:function (value) {
        return /^1[34578]\d{9}$/.test(value)
    },
    validCode:function (code) {
        return /^\d{6}$/.test(code)
    },
    required:function(value) {
        return !(value.replace(/\s+/g, "").length===0);
    },
    isInt:function(value) {
        return /^\+?[1-9][0-9]*$/.test(value);
    }

}
export default validate;
