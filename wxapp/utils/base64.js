
module.exports.b64ToBuf = function b64ToBuf(b64Str) {
  return wx.base64ToArrayBuffer(b64Str)
}

module.exports.bufToB64 = function bufToB64(buf) {
  return wx.arrayBufferToBase64(buf)
}

module.exports.bufToHex = function bufToHex(buf) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buf),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

module.exports.hexToBuf = function hexToBuf(str) {
  if (!str) {
    return new ArrayBuffer(0);
  }
  str = str.replace(/[^0-9a-f]/ig, '');

  var buffer = new ArrayBuffer(str.length / 2);
  let dataView = new DataView(buffer)

  let pos = 0;
  for (var i = 0, len = str.length; i < len; i += 2) {
    let code = parseInt(str.substr(i, 2), 16)
    dataView.setUint8(pos, code)
    pos++
  }

  return buffer;

  // hex = hex.replace(/ /g, '')
  //          .split('')
  //          .map((b4, i) => i % 2 === 1 ? b4 + ' ' : b4)
  //          .join('').split(' ').filter(i => i.length > 0)
  //          .map(b8 => parseInt(b8, 16));
  // console.log(hex);
  // return new ArrayBuffer(new Uint8Array(hex));
}
