const http = require("http")
const { host, port } = require("../config")
const { readFile } = require("./utils")

const serve = http.createServer(async(req, res) => {
    const url = req.url
    console.log(url)
    let resData = null

    switch (url) {
        case '/':
            res.setHeader('content-type', 'text/html')
            resData = await readFile('index.html',req, res)
            break;
        case '/index.css':
            res.setHeader('Content-type', 'text/css')
            await readFile('index.css',req.headers, res, 'Expires')
            break;
        case '/img.jpg':
            res.setHeader('Content-type', 'image/jpg')
            resData = await readFile('img.jpg',req, res, 'max-age')
            break;
            case '/img1.jpg':
            res.setHeader('Cache-Control', 'no-store')
            resData = await readFile('img1.jpg',req, res)
            break;
        case '/img2.jpg':
            resData = await readFile('img2.jpg',req, res, 'last-modified')
        //     break;
        case '/img3.jpg':
            resData = await readFile('img3.jpg',req, res, 'etag')
            break;
        case '/img4.jpg':
            resData = await readFile('img4.jpg',req, res)
            break;
        case '/logo.png': 
            resData = await readFile('logo.png',req, res);
        default:
            break;
    }
    res.end(resData?.data)
})
serve.listen(port, host, () => {
    console.log(`Serve is runing at ${host}:${port}`)
})