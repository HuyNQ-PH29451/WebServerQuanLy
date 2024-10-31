const session = require('express-session');
const admin = require('firebase-admin');
const serviceAccount = require('../model/firebaseConfig');
const firestore = admin.firestore();
const bodyParser = require('body-parser');
const path = require("path");
const db = admin.firestore();
exports.home = (req,res,next)=>{
    const message1 = req.query.msg;
    res.render('home/home',{title: "Home",errorMessage:'a', message1});
}
exports.reg = (req,res,next)=>{
    res.render('home/reg',{title: "REG"});
}
exports.LOGIN = (req,res,next)=> {

    let datatocheck = {Email: req.body.Email, Password: req.body.Password,}
    const collectionRef = admin.firestore().collection('Staff').where("Email", '==', datatocheck.Email);
    try {

console.log("email"+datatocheck.Email+"pass:"+datatocheck.Password)
        if(datatocheck.Email==="admin"&&datatocheck.Password==="admin"){
            req.session.adminLogin=datatocheck;
            req.session.nameStaff='ADMIN';
          return  res.redirect('/home?msg=admin')
        }
    collectionRef.get().then((snapshot) => {
            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userData = userDoc.data();
                // Kiểm tra mật khẩu
                if (userData.Password === datatocheck.Password) {
                    console.log("Mật khẩu đúng"+userData.Password);
                    req.session.staffLogin=userData.Password && userData.Email;
                   req.session.nameStaff=userData.Fullname;
                   res.locals.nameStaff=req.session.nameStaff;
                 return res.redirect('/home?msg=staff')
                   
                    
                }  else {
           const message = 'Mật khẩu không đúng';
                    res.render('home/login', { title: 'Login', message });

                }
            } else {
                const message = 'Tài khoản không tồn tại';
                res.render('home/login', { title: 'Login', message });
                console.log("Người dùng không tồn tại");
            }

    });
    }catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
}
exports.addSTAFF= async(req,res,next)=>{
        try {

            const collectionRef = admin.firestore().collection('Staff');
            const Id = collectionRef.doc().id;
            const emailToCheck = req.body.Email; // Email cần kiểm tra

// Kiểm tra xem email đã tồn tại hay chưa
            const query = collectionRef.where('Email', '==', emailToCheck).limit(1);
            query.get()
                .then(async (snapshot) => {
                    if (snapshot.empty) {
                        let data2 = {
                            id: Id,
                            Email: req.body.Email,
                            Fullname: req.body.Fullname,
                            Password: req.body.Password,
                        }
                        const docID = Id ? collectionRef.doc(Id) : collectionRef.doc();
                         docID.set(
                            data2)
                            .then(() => {
                                res.redirect('/');
                            })
                            .catch(error => {
                                console.error('Lỗi khi thêm tài liệu:', error);
                                res.status(500).json({message: 'Lỗi khi thêm tài liệu'});
                            });
                    } else {
                        // Email đã tồn tại, xử lý logic tương ứng
                   var   msg ='Email đã được sử dụng';

                        // Xử lý logic khi email đã tồn tại
                    }
                })
                .catch((error) => {
                    console.error('Lỗi khi kiểm tra email:', error);
                    // Xử lý lỗi nếu cần
                });

        } catch (error) {
            console.error('Error adding data:', error);
            res.status(500).send('Error adding data to Firestore');
        }



};
exports.Logout = (req , res  , next) => {
    req.session.destroy((err) => {
        if(err){
          console.log(err)
        }else{
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
          return res.redirect('/');
        }
      })
  
     
};






 