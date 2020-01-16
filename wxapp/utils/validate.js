let validate ={

    mobile:function (value) {
        return /^1[34578]\d{9}$/.test(value)
    },
    validCode:function (code) {
        return /^\d{6}$/.test(code)
    },
    required:function(value) {
        console.log(typeof value)
        if (typeof value === 'string' ) {
            return !(value.replace(/\s+/g, "").length===0);
        } else if (typeof value === 'object') {
            return !(Object.keys(value).length === 0);
        } else {
            return !(value.length === 0)
        }
    },
    isInt:function(value) {
        return /^\+?[1-9][0-9]*$/.test(value);
    }

}
export default validate;
