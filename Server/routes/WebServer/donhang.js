var express = require('express');
var router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');

//Đường dẫn tới donhang.controller.js 
const donhangCtrl = require('../../controller/donhang.controller');
var middleware = require('../../middleware/checklogin');
router.get('/',middleware.yeu_cau_login,donhangCtrl.OrderDanhSach);
//xóa
router.post('/delete/:id',donhangCtrl.delete);
//update
router.post('/update/:id',donhangCtrl.put);
//Xuất router
module.exports = router;
