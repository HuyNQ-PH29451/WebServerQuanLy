const session = require('express-session');
const admin = require('firebase-admin');
const serviceAccount = require('../model/firebaseConfig');
const firestore = admin.firestore();
const bodyParser = require('body-parser');
const path = require("path");
const moment = require('moment');

exports.OrderDanhSach = async (req, res, next) => {
    let msg = '';
    let listDonHang = null;
    let listDonHangJson = [];
    
const options = [
    { value: 'Chờ xác nhận', label: 'Chờ xác nhận' },
    { value: 'Chờ lấy hàng', label: 'Chờ lấy hàng' },
    { value: 'Chờ giao hàng', label: 'Chờ giao hàng' },
    { value: 'Đã giao', label: 'Đã giao' },
            
            
            // Thêm các option khác nếu cần
        ];
    try {
        
        listDonHang = await firestore.collection('DonHang').get();
        if (listDonHang.empty) {
            console.log('No matching listDonHang.');
            return;
        }
        listDonHang.docs.forEach(doc => {
            listDonHangJson.push(doc.data());
            
        });

        // console.log('donhang:' + listDonHang);
        msg = 'Lấy dữ liệu thành công !';

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(505).send('Error fetching data');
    }

    res.render('order/donhang', {
        title: "Order", listdonhang: listDonHangJson ,options : options
    });
};
exports.delete = async(req,res,next)=>{
     try {
        let id = req.params.id;   
        await firestore.collection('DonHang').doc(id).delete();

        res.redirect('/Orders');
     } catch (error) {
        console.error('Error deleting data:',error);
        res.status(500).send('Error deleting data from Firestore');  
     }

};

exports.put = async(req,res,next)=>{
    
    try {
        const id = req.params.id;
        // const status = req.body.Status;
        const querySnapshot = await firestore.collection('DonHang').where('id', '==', id).get();
        if (querySnapshot.empty) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
        }
        const newdata = {
            status:req.body.Status,
            id_user : req.body.id_user,
           
        }
        
        const docRef = querySnapshot.docs[0].ref;
        await docRef.update(newdata);
        console.log(newdata);
        const now = moment(); // Lấy thời gian hiện tại
        const formattedDate = now.format('HH:mm DD/MM/YYYY');
        
       
        // await firestore.collection('DonHang').doc(id).set(newdata,{merge:true});
        // res.json({ success: true, message: 'Đã cập nhật trạng thái đơn hàng.' });
        res.redirect('/Orders');
       
    const notification = {
                // Đặt các trường thông tin cần thiết cho thông báo của bạn ở đây
                Img:"",
                id_DonHang: id,
                Title: newdata.status,
                Time: formattedDate.toString(),
                TypeNotification:"Đơn hàng với mã đơn "+ id + " đã được đổi trạng thái sang " + newdata.status ,
                id_user: newdata.id_user, // Ghi lại thời gian cập nhật
            }
        
            // Post thông báo vào collection ThongBao
            await firestore.collection('Notification').add(notification);
            console.log('Thông báo đã được gửi:', notification);
        
    } catch (error) {
        console.error('Error updating data:',error);
        res.status(500).send('Error updating data from Firestore');  
    }
}

// exports.addDonHang = async(req,res,next)=>{
//     try {
//         let data = {
//             Address: req.body.Address,
//             Name_Staff:req.body.Name_Staff,
//             Name_User:req.body.Name_User,
//             Name_product:req.body.Name_product,
//             NgayDat:req.body.NgayDat,
//             Status:req.body.Status,
//             TenDonHang:req.body.TenDonHang
//         }
       
//         await firestore.collection('DonHang').add(data)
//           .then((docRef) => {
//               console.log("Document written with ID: ", docRef.id);
//                res.json({'message':'successful','ID':docRef.id}); 
//            })
//         res.redirect('/Orders');

//     } catch (error) {
//         console.error('Error adding data:', error);
//         res.status(500).send('Error adding data to Firestore');
//     }
// };