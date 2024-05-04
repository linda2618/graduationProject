const express = require('express')
const router = express.Router()
const {db, genId} = require('../db/DbUtils')

//查询全部商品
router.get('/info', async(req, res) => {
    let detail_sql = "SELECT * FROM product"
    let {err, rows} = await db.async.all(detail_sql)
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

//查询商品detail
router.get('/detail', async(req, res) => {
    let {product_id} = req.query
    let detail_sql = "SELECT * FROM product WHERE product_id = ?"
    let { err, rows } = await db.async.all(detail_sql, [product_id])

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

//search--查询商品(模糊查询)
router.get('/search', async(req, res) => {
    /*
    *keyword 关键字
    *category_id 分类编号
    */
   let {keyword, category_id} = req.query
    category_id = category_id == null ? 0 : category_id
    keyword = keyword == null ? "" : keyword

    let params = []
    let whereSqls = []
    if(category_id != 0){
        whereSqls.push("category_id = ? ")
        params.push(category_id)
    }
    if(keyword != ""){
        whereSqls.push("(tilte LIKE ? OR content LIKE ? OR shop LIKE ?) ")
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")
    }

    let whereSqlStr = ""
    if(whereSqls.length > 0){
        whereSqlStr = "WHERE " + whereSqls.join(" AND ")
    }

    //查询内容
    let searchSql = "SELECT * FROM product " + whereSqlStr + "ORDER BY create_time "
    let searchSqlParams = params
    //查询数据总数
    let searchCountSql = "SELECT count(*) AS count FROM product " + whereSqlStr
    let searchCountParams = params

    let searchResult = await db.async.all(searchSql, searchSqlParams)
    let countResult = await db.async.all(searchCountSql, searchCountParams)

    if(searchResult.err == null && countResult.err == null){
        res.send({
            code:200,
            msg:"查询成功",
            data:{
                keyword,
                category_id,
                rows:searchResult.rows,
                count: countResult.rows[0].count
            }
        })
    }else{
        res.send({
            code:'500',
            msg:"查询失败"
        })
    }
   

})

//添加商品
router.post('/add', async(req, res) => {
    let {category_id, tilte, content,  price, is_car, checked, num, shop, img_src,} = req.body

    let create_time = new Date().getTime()
    console.log(create_time)
    
    let insert_sql = "INSERT INTO product(product_id, category_id, shop, img_src, price, tilte, content, create_time, checked, is_car, num) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

   let {err, rows} = await db.async.run(insert_sql, [genId.NextId(), category_id, shop, img_src, price, tilte, content, create_time, checked, is_car, num])

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

// 商品加入购物车
router.put('/car', async(req, res) => {
    let { product_id, is_car } = req.body

    let update_sql = "UPDATE product SET is_car = ? WHERE product_id = ?"
    let { err, rows } = await db.async.run(update_sql, [is_car, product_id])
    
   if(err == null){
    res.send({
        code:200, 
        msg: '加入购物车成功'
    })
    }else{
        res.send({
            code: 500,
            msg:'加入购物车失败'
        })
    }
})

//修改商品checked信息
router.put('/checked', async(req, res) => {
    let { product_id, checked } = req.body

    let update_sql = "UPDATE product SET checked = ? WHERE product_id = ?"
    let params = [checked, product_id]
    let { err, rows } = await db.async.run(update_sql, params)
    
   if(err == null){
    res.send({
        code: 200, 
        product_id: product_id,
        checked: checked,
        msg:'修改成功'
    })
    }else{
        res.send({
            code: 500,
            msg:'修改失败'
        })
    }
})

//修改商品信息
router.put('/update', async(req, res) => {
    let{product_id, category_id, shop, img_src, price, tilte, content, num, checked} = req.body

    let update_time = new Date().getTime()
    console.log(update_time)
    let update_sql = "UPDATE product SET category_id = ?, shop = ?, img_src = ?, price = ?, tilte = ?, content = ?, update_time = ?, num = ?, checked = ? WHERE product_id = ?"
    let params = [category_id, shop, img_src, price, tilte, content, update_time, num, checked, product_id]
    let { err, rows } = await db.async.run(update_sql, params)
    
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

//删除商品信息
router.delete('/delete', async(req, res) => {
    let product_id = req.query.product_id
    let delete_sql = "DELETE FROM product WHERE product_id = ?"
    let {err, rows} = await db.async.run(delete_sql, [product_id])

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