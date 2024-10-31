var express = require('express');
var router = express.Router();

const orderdetail = require('../../controller/chitietdonhang.controller');
var middleware = require('../../middleware/checklogin');
router.get('/',middleware.yeu_cau_login,orderdetail.getOrderDetailList);
//xóa
router.post('/newbill',orderdetail.newbill);
router.post('/delete/:id',orderdetail.delete);
//update
router.post('/update/:id',orderdetail.put);
router.post('/tinhTongTien', orderdetail.tinhtongtien);
//Xuất router
module.exports = router;