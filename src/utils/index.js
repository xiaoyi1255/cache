const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
/**
 * 
 * @param  {...any} arg 文件名
 * @returns Buffer
 */
const readFile = (path1, {headers={}}, res={}, type='') => {
  try {
    const now = +new Date()
    let url = path.join(__dirname, '../../public', path1)
    return new Promise((resolve, reject) => {
      
      switch (type) {
        case 'Expires': // 强制缓存
          res.setHeader('Expires', new Date(now + 5 * 60 * 1000).toUTCString())
          break;
        case 'max-age': // 强制缓存
          res.setHeader('Cache-Control', 'max-age=120' )
          break;
        case 'last-modified': // 协商缓存
          const fileModifyTime = fs.statSync(url).ctime.toUTCString() // 拿到系统文件修改时间
          if (headers?.['if-modified-since']) {
            if (+new Date(headers?.['if-modified-since']) === +new Date(fileModifyTime)) {
              res.statusCode = 304;
              resolve({data:''})
            }
          }
          res.setHeader('Cache-Control', 'no-cache')
          res.setHeader('last-modified', fileModifyTime)
          break;
        case 'etag':
          const hash = crypto.createHash('md5')
          const etag = hash.update(fs.readFileSync(url)).digest('hex')
          if (headers?.['if-none-match'] ) {
            if (headers?.['if-none-match'] == etag) {
              res.statusCode = 304
              resolve({data:''})
            }
          }
          res.setHeader('Cache-Control', 'max-age=120')
          res.setHeader('etag', etag);
          break
        case 'etag && last-modified':

        default:
          break;
        }
        resolve({data: fs.readFileSync(url)})
    })
  } catch (error) {
    console.log(error, 9999);
  }
}

/**
 * 
 * @returns 本机ip
 */
const getIpAddress = () => {
    const os = require("os");
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (
          alias.family === "IPv4" &&
          alias.address !== "127.0.0.1" &&
          !alias.internal
        ) {
          return alias.address;
        }
      }
    }
}



module.exports = {
    getIpAddress,
    readFile,
}