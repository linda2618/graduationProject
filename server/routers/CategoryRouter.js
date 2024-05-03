const express = require('express')
const router = express.Router()
const {db, genId} = require('../db/DbUtils')

//列表接口
router.get('/getList', async(req, res) => {
    let search_sql = "SELECT * FROM category"

    let {err, rows} =  await db.async.all(search_sql, [])
    if(err == null){
        res.send({
            code:200, 
            msg:'查询成功',
            rows
        })
    }else{
        res.send({
            code: 500,
            msg:'查询失败'
        })
    }
})

//添加接口
router.post('/add', async(req, res) => {
    let {title} = req.body

    let {err, rows} =  await db.async.run("INSERT INTO category(id, title) VALUES (?, ?)", [genId.NextId(), title])
    if(err == null){
        res.send({
            code:200, 
            msg:'添加成功'
        })
    }else{
        res.send({
            code: 500,
            msg:'添加失败'
        })
    }
})

//修改接口
router.put('/update', async(req, res) => {
    let {id, title} = req.body
    // console.log(req.path) // /update

    let update_sql = "UPDATE category SET title = ? where id = ?"

    let {err, rows} =  await db.async.run(update_sql, [title, id])
    if(err == null){
        res.send({
            code:200, 
            msg:'修改成功'
        })
    }else{
        res.send({
            code: 500,
            msg:'修改失败'
        })
    }
})

//删除接口 /category/delete?id=xxx
router.delete('/delete', async(req, res) => {
    let id = req.query.id
    let delete_sql = "DELETE FROM category where id = ?"

    let {err, rows} =  await db.async.run(delete_sql, [id])
    if(err == null){
        res.send({
            code:200, 
            msg:'删除成功'
        })
    }else{
        res.send({
            code: 500,
            msg:'删除失败'
        })
    }
})


module.exports = router