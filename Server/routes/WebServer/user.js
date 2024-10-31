var express = require('express');
var router = express.Router();
var UserCtrl = require('../../controller/userController');
var middleware = require('../../middleware/checklogin');
router.get('/',middleware.yeu_cau_login,UserCtrl.listUsers);
router.post('/delete', UserCtrl.delete);

module.exports = router;
