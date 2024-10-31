var express = require('express');
var router = express.Router();
var Statistics = require('../../controller/statisticsController');
var middleware = require('../../middleware/checklogin');


router.get('/',middleware.yeu_cau_login,Statistics.Home);

// router.post('/delete/:id',StaffCtrl.delete);
//
// router.post('/edit/:id',StaffCtrl.put);
module.exports = router;