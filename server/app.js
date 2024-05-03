const express = require('express')
const multer = require('multer')  //multer上传文件,sqlite3数据库，方便服务端的移植,uuid唯一标识

const path = require("path")
const app = express()
const {db, genId} = require('./db/DbUtils')

const port = 8080

//升级跨域请求
app.use(function(req, res, next){
    //设置允许跨域的域名， *代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", '*')
    //允许的header类型
    res.header('Access-Control-Allow-Headers', '*')
    //跨域允许的请求方式
    res.header('Access-Control-Allow-Methods','DELETE, PUT, POST, GET, OPTIONS')

    if(req.method == 'OPTIONS')res.sendStatus(200)
    else next()
})


//注册中间件
app.use(express.json())
const update = multer({
    dest:'./public/upload/temp'   //上传的文件地址
})
app.use(update.any())  //允许所有文件上传

// 静态资源托管
// 如果用户想在浏览器上直接访问图片或者html页面，需要做一个静态服务器
app.use(express.static(path.join(__dirname, "public")))

//
// const ADMIN_TOKEN_PATH = "/_token"
// app.all('*', async(req, res, next) => {
//     if(req.path.indexOf(ADMIN_TOKEN_PATH) > -1){
//           //token验证
//         let { token } = req.headers

//         let admin_token_sql = "SELECT * FROM admin WHERE token = ?"
//         let adminResult = await db.async.all(admin_token_sql,[token])
//         if(adminResult.err != null || adminResult.rows.length == 0){
//             res.send({
//                 code:403,
//                 msg:"请先登录"
//             })
//             return 
//         }else{
//             next()
//         }
//     }else{
//         next()
//     }
// })
//注册router
app.use('/test', require('./routers/TestRouter.js'))
app.use('/admin', require('./routers/AdminRouter.js'))
app.use('/category', require('./routers/CategoryRouter.js'))
app.use('/blog', require('./routers/BlogRouter.js'))
app.use('/upload', require('./routers/UploadRouter.js'))
app.use('/user', require('./routers/UserLogin.js'))
app.use('/product', require('./routers/ProductRouter.js'))


app.get('/',(req, res) => {
    res.send('Welcome to blog for everyone!')
})

app.listen(port, ()=>{
    console.log(`启动成功: http://localhost:${port}`)
})

