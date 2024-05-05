const express = require("express");
const router = express.Router();
const {db, genId} = require('../db/DbUtils')


router.post('/add', async (req, res) => {
    let {product_id, img_src} = req.body

    console.log(img_src, 'img_src')
    let insert_sql = "UPDATE product SET img_src = ? WHERE product_id = ?";


   let {err, rows} = await db.async.run(insert_sql, [img_src, product_id])

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

module.exports = router;
