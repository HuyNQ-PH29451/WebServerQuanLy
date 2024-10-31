var express = require('express');
var router = express.Router();
var StaffCtrl = require('../../controller/staff.controller');
var middleware = require('../../middleware/checklogin');


router.get('/',middleware.yeu_cau_login,StaffCtrl.listStaffs);

router.post('/delete/:id',StaffCtrl.delete);

router.post('/edit/:id',StaffCtrl.put);
module.exports = router;