var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const multer = require('multer');

//Đường dẫn tới products.controller.js 
var productCtrl = require('../../controller/productController');
var middleware = require('../../middleware/checklogin');

//Vào trang product theo địa chỉ '/products/'
router.get('/' ,middleware.yeu_cau_login,productCtrl.listProducts);
//Chi tiết
// router.get('/view/:id_p',productCtrl.viewProducts);
// //Thêm
router.post('/add',productCtrl.addProduct);
// //Sửa
router.post('/edit/:id',productCtrl.put);
// //Xóa
router.post('/delete/:id',productCtrl.delete);
// router.delete('/delete/:id',productCtrl.delete)
module.exports = router;
