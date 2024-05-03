const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const GenId = require('../utils/SnowFlake')

var db = new sqlite3.Database(path.join(__dirname, 'graduMall.sqlite3'))
const genId = new GenId({WorkerId: 1})

db.async = {}  //定义一个异步的

//进行sql, 和params还有回调的一个封装
db.async.all = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            resolve({err, rows})
        })
    })
}

//新增和修改在run里面执行
db.async.run = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params,  (err, rows) => {
            resolve({err, rows})
        })
    })
}

module.exports = {db, genId}