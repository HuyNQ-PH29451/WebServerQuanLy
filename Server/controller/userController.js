const admin = require('firebase-admin');
const db = require("../model/firebaseConfig");
const { FieldValue } = require('firebase-admin/firestore');
exports.listUsers = async (req, res, next) => {
    let msg = '';
    let list = null;
    let listJson = [];
    
    

    try {
        list = await admin.firestore().collection('Users').get();


        list.docs.forEach(doc => {
            listJson.push(doc.data());
           
        });

        
        
        msg = 'Lấy dữ liệu thành công !';
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from Firestore');
        
    }

    res.render('User/list', { title: "Users", listUser: listJson, msg: msg});
}

exports.delete=async(req,res,next)=>{
    try {
        let id = req.query.id; // Lấy ID tài liệu từ URL
        let tt = req.query.tt;
if(tt===''){
     await db.collection('Users').doc(id).update({
         Trangthai: 'Banned'
     });
}else{
    await db.collection('Users').doc(id).update({
        Trangthai: FieldValue.delete()
    });
}

    
        res.redirect('/users');
      } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send('Error deleting data from Firestore');
      }
}
