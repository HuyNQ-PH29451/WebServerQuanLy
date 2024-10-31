var express = require('express');
var router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

//Đường dẫn tới home.controller.js 
var homeCtrl = require('../../controller/home.controller');
const productCtrl = require("../../controller/productController");
var middleware = require('../../middleware/checklogin');
router.post('/add',homeCtrl.addSTAFF)
//Vào trang home theo địa chỉ '/'
router.get('/home',middleware.yeu_cau_login,homeCtrl.home);
router.post('/login',homeCtrl.LOGIN);
router.get('/',productCtrl.loginScreen);
  router.get('/reg',homeCtrl.reg);
router.get('/', async (req, res) => {
    // Fetch documents from Firestore
    const documents = await admin.firestore().collection('Staff').get();
    const data = documents.docs.map(doc => doc.data());
    
    // Render EJS template with fetched data
    res.render('../../views/inc/header.ejs', { documents: data });
  });
router.get('/logout' ,homeCtrl.Logout );

//Xuất router
module.exports = router;
