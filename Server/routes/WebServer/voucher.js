var express = require('express');
var router = express.Router();

var vouchers = require('../../controller/voucherController');
var middleware = require('../../middleware/checklogin');

router.get('/',middleware.yeu_cau_login,vouchers.listVouchers);
router.post('/delete/:id',vouchers.delete);

router.post('/addVoucher',vouchers.addVoucher);
router.post('/update/:id',vouchers.updateVoucher);
module.exports = router;