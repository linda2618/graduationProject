const express = require('express')
const router = express.Router()
const fs = require('fs')
const {db, genId} = require('../db/DbUtils')

router.post('/rich_editor_upload', async(req, res) => {
    if(!req.files){
        res.send({
            "errno": 1, // 只要不等于 0 就行
            "message": "失败信息"
        })
        return;
    }
    // console.log(req.files)
    //  [
    //     {
    //       fieldname: 'file',
    //       originalname: '20151231030245752.jpg',
    //       encoding: '7bit',
    //       mimetype: 'image/jpeg',
    //       destination: './public/upload/temp',
    //       filename: 'ec14d2c2c8eadc244a9461564ea538c6',
    //       path: 'public\\upload\\temp\\ec14d2c2c8eadc244a9461564ea538c6',
    //       size: 179230
    //     }
    //   ]

    let files = req.files
    let ret_files = [] //存储文件

    for(let file of files){
        //获取文件名字后缀
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
        //随机文件名字
        let file_name = genId.NextId() + '.' + file_ext
        // console.log(file_name, file.filename)

/* process.cwd() 是当前Node.js进程执行时的文件夹地址——工作目录，保证了文件在不同的目录下执行时，路径始终不变(简单说就是执行命令=== node 文件地址（命令行)
 __dirname 是被执行的js 文件的地址 ——文件所在目录
 */

        //修改名字 + 移动文件   renameSync:同步版本       
        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + file.filename, 
            process.cwd() + "/public/upload" + file_name
        )

        ret_files.push("/upload" + file_name)
    }

    res.send({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url": ret_files[0], // 图片 src 
        }
    })

   
})

module.exports = router