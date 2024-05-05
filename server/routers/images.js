const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const {db, genId} = require('../db/DbUtils')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/add", upload.array("file", 1), function (req, res, next) {
    try {
      let {product_id} = req.body
        if (!req.files || req.files.length === 0) {
        return res.status(400).send({
            code: 400,
            msg: "No files were uploaded.",
        });
        }

        const file = req.files[0];
        const newFileName = Date.now() + "_" + file.originalname;
        const newPath = "public/images/" + newFileName;

        fs.renameSync(file.path, newPath);

        const fileInfo = {
        type: file.mimetype,
        name: file.originalname,
        size: file.size,
        path: newPath,
        };

        const sql = "UPDATE product SET img_src = ? WHERE product_id = ?";
        db.query(sql, [newPath, product_id], (error, results) => {
        if (error) {
            return res.status(500).json({
            code: 500,
            msg: "服务器内部错误",
            error: error.message,
            });
        }

        // Sending response with the fileInfo
        res.status(200).json({
            code: 200,
            msg: "上传图片成功",
            product_id: product_id,
            data: fileInfo,
        });
        });
    } catch (error) {
        console.error("上传图片失败：", error);
        res.status(500).json({
        code: 500,
        msg: "服务器内部错误",
        error: error.message,
        });
    }
});

module.exports = router;
