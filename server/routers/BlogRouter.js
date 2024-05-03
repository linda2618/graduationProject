const express = require('express')
const router = express.Router()
const {db, genId} = require('../db/DbUtils')

//查询单篇 博客文章
router.get('/detail', async(req, res) => {
    let {id} = req.query
    let detail_sql = "SELECT * FROM blog WHERE id = ?"
    let {err, rows} = await db.async.all(detail_sql, [id])
    if(err == null){
        res.send({
            code:200, 
            msg:'获取成功',
            rows
        })
        }else{
            res.send({
                code: 500,
                msg:'获取失败'
            })
        }
})


//查询博客
router.get('/search', async(req, res) => {
    /*
    *keyword 关键字
    *category_id 分类编号
    * 
    * 分页：
    * page 页码
    * pageSize 分页大小
    */
   let {keyword, category_id, page, pageSize} = req.query
    page = page == null ? 1 : page
    pageSize = pageSize == null ? 10 : pageSize
    category_id = category_id == null ? 0 : category_id
    keyword = keyword == null ? "" : keyword

    let params = []
    let whereSqls = []
    if(category_id != 0){
        whereSqls.push("category_id = ? ")
        params.push(category_id)
    }
    if(keyword != ""){
        whereSqls.push("(title LIKE ? OR content LIKE ?) ")
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")
    }

    let whereSqlStr = ""
    if(whereSqls.length > 0){
        whereSqlStr = "WHERE " + whereSqls.join(" AND ")
    }

    //查询分页内容
    let searchSql = "SELECT id, category_id, title, substr(content, 0, 88) AS content, create_time FROM blog " + whereSqlStr + "ORDER BY create_time DESC LIMIT ?,? "
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    //查询数据总数
    let searchCountSql = "SELECT count(*) AS count FROM blog " + whereSqlStr
    let searchCountParams = params

    let searchResult = await db.async.all(searchSql, searchSqlParams)
    let countResult = await db.async.all(searchCountSql, searchCountParams)

    // console.log("查询blog数据...")
    if(searchResult.err == null && countResult.err == null){
        res.send({
            code:200,
            msg:"查询成功",
            data:{
                keyword,
                category_id,
                page,
                pageSize,
                rows:searchResult.rows,
                count: countResult.rows[0].count
                // count: countResult.rows[0]['count(*)']
            }
        })
    }else{
        res.send({
            code:'500',
            msg:"查询失败"
        })
    }
   

})

//添加博客
router.post('/add', async(req, res) => {
    let {category_id, title, content} = req.body

    let create_time =  new Date().getTime()

    let insert_sql = "INSERT INTO blog(id, category_id, title, content, create_time) VALUES (?, ?, ?, ?, ?)"

   let {err, rows} = await db.async.run(insert_sql, [genId.NextId(), category_id, title, content, create_time])
//    console.log("添加blog数据...")
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
//修改博客
router.put('/update', async(req, res) => {
    let{id, category_id, title, content} = req.body

    let create_time =  new Date().getTime()
    let update_sql = "UPDATE blog SET category_id = ?,  title  = ?, content = ?, create_time = ? WHERE id = ?"
    let params = [category_id, title, content, create_time, id]

   let {err, rows} = await db.async.run(update_sql, params)
//    console.log("修改blog数据...")
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
//删除博客
router.delete('/delete', async(req, res) => {
    let id = req.query.id
    let delete_sql = "DELETE FROM blog WHERE id = ?"

   let {err, rows} = await db.async.run(delete_sql, [id])
//    console.log("删除blog数据...")
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