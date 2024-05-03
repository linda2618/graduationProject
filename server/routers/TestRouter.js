const express = require('express')
const router = express.Router()
const {db, genId} = require('../db/DbUtils')

router.get('/test', async(req, res) => {
   let out = await db.async.all('select * from admin', [])
    res.send({
        id: genId.NextId(),
        out
    })
})

module.exports = router


// 直接写sql语句，容易形成回调地狱，所以要用promise封装请求。
// router.get('/test', (req, res) => {
//     db.all('select * from admin', [], (err, rows) => {
//         console.log(rows)
//         // db.all('select * from admin', [], (err, rows) => {
//         //     console.log(rows)
//         //     db.all('select * from admin', [], (err, rows) => {
//         //         console.log(rows)
//         //     })
//         // })
//     })

//     res.send({
//         id: genId.NextId()
//     })
// })
