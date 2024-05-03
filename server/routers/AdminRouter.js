const express = require('express')
const router = express.Router()
const {v4: uuidv4} = require('uuid')   // 生成uid(唯一标识符)生成验证登录成功的token, 
// 版本 4：基于随机数的 UUID

const {db, genId} = require('../db/DbUtils')

router.post('/login', async(req, res) => {
    let {account, password} = req.body //请求参数
    let {err, rows} = await db.async.all("select * from `admin` where `account` = ? AND `password` = ?", [account, password])
    
    if(err == null && rows.length > 0){
        let login_token = uuidv4()
        let update_token_sql = "UPDATE `admin` SET `token` = ? where `id` = ?"

        await db.async.run(update_token_sql, [login_token, rows[0].id]) //更新admin表

        let admin_info = rows[0]
        admin_info.token = login_token
        admin_info.password =""  //密码置空不返回
        // console.log(admin_info)

        res.send({
            code:200,
            msg:'登录成功',
            data: admin_info  //返回给前端
        })

    }else{
        res.send({
            code: 500,
            msg:'登录失败'
        })
    }
})

module.exports = router