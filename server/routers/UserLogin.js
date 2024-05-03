const express = require('express')
const router = express.Router()
const {v4: uuidv4} = require('uuid')   // 生成uid(唯一标识符)生成验证登录成功的token, 
// 版本 4：基于随机数的 UUID

const {db, genId} = require('../db/DbUtils')

router.post('/login', async(req, res) => {
    let {account, password} = req.body //请求参数
    let {err, rows} = await db.async.all("select * from `user` where `account` = ? AND `password` = ?", [account, password])
    
    if(err == null && rows.length > 0){
        let login_token = uuidv4()
        let update_token_sql = "UPDATE `user` SET `token` = ? where `id` = ?"

        await db.async.run(update_token_sql, [login_token, rows[0].id]) 

        let user_info = rows[0]
        user_info.token = login_token
        user_info.password =""  //密码置空不返回
        // console.log(user_info)

        res.send({
            code:200,
            msg:'登录成功',
            data: user_info  //返回给前端
        })

    }else{
        res.send({
            code: 500,
            msg:'登录失败,账号或密码错误'
        })
    }
})

router.post('/update', async(req, res) => {
    let { account, password, englishName, name, avatar, address } = req.body; // 请求参数
    let { err, rows } = await db.async.all("SELECT * FROM `user` WHERE `account` = ? AND `password` = ?", [account, password]);
    
    if (err == null && rows.length > 0) {
        let update_info_sql = "UPDATE `user` SET `englishName` = ?, `name` = ?, `avatar` = ?, `address` = ? WHERE `account` = ?";
        
        await db.async.run(update_info_sql, [englishName, name, avatar, account, address]);

        let user_info = rows[0];
        user_info.englishName = englishName;
        user_info.name = name;
        user_info.avatar = avatar;
        user_info.address = address;

        res.send({
            code: 200,
            msg: '更新成功',
            data: user_info  // 返回给前端
        });
    } else {
        res.send({
            code: 500,
            msg: '更新失败'
        });
    }
});

router.post('/register', async (req, res) => {
    let { account, password } = req.body; // 请求参数
    let selectUserQuery = "SELECT * FROM `user` WHERE `account` = ?";
    let insertUserQuery = "INSERT INTO `user` (`account`, `password`, `token`) VALUES (?, ?, ?)";
    
    try {
        // 查询数据库是否存在相同账号
        let { err, rows } = await db.async.all(selectUserQuery, [account]);
        
        if (err) {
            throw err; // 查询失败，抛出异常
        }

        if (rows.length > 0) {
            // 数据库中已存在相同账号，返回注册失败消息
            res.status(400).json({
                code: 400,
                msg: '账号已存在'
            });
        } else {
            // 数据库中不存在相同账号，可以注册
            let loginToken = uuidv4(); // 生成 UUID 作为登录令牌

            // 执行数据库插入操作
            await db.async.run(insertUserQuery, [account, password, loginToken]);

            // 构造返回数据
            let userInfo = {
                account: account,
                token: loginToken
            };

            res.status(200).json({
                code: 200,
                msg: '注册成功',
                data: userInfo
            });
        }
    } catch (err) {
        console.error("注册失败:", err);
        res.status(500).json({
            code: 500,
            msg: '注册失败'
        });
    }
});


module.exports = router