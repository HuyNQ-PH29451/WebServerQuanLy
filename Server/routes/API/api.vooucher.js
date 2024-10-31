var express = require('express');
var router = express.Router();
const db1 = require('../../model/firebaseConfig'); 
const admin = require('firebase-admin');
router.get('/', async(req, res, next) =>{
  try {
    const Id = req.query.id;
    if (!Id) {
      // Nếu không có tham số truy vấn 'name', trả về tất cả người dùng
      const snapshot = await db1.collection('Vouchers').get();
    const data = [];

    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data(),
        
      });
      
    });
    res.status(200).json(data);
    }else{
      const snapshot = await db1.collection('Vouchers').where('id', '==', req.query.id).get();
    const data = [];

    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json(data);
    }

    
    

    
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data from Firestore');
  }
});

router.delete('/delete/:id',async(req,res,next)=>{
  try {
    const docId = req.params.id; // Lấy ID tài liệu từ URL

    // Xóa tài liệu dựa trên ID đã cung cấp
    await db1.collection('Vouchers').doc(docId).delete();

    res.status(200).send(`Document with ID: ${docId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).send('Error deleting data from Firestore');
  }
});

router.post('/add',async(req,res,next)=>{
  try {
    // Dữ liệu từ request body
   const collectionRef = admin.firestore().collection('Vouchers');
         const Id = collectionRef.doc().id;
       
         const docID = Id ? collectionRef.doc(Id) : collectionRef.doc();

         let data2 = {
          id: Id,
          Discount: req.body.Discount,
          Title: req.body.Title,
          
      }
          docID.set(data2).then(() => {
           res.status(200).send(`Document with ID: add successfully`);
           return collectionRef.doc().id;
       })
       .catch(error => {
           console.error('Lỗi khi thêm tài liệu:', error);
           res.status(500).json({message: 'Lỗi khi thêm tài liệu'});
       });
  
 } catch (error) {
   console.error('Error adding data:', error);
   res.status(500).send('Error adding data to Firestore');
 }
});

router.put('/update/:id',async(req,res,next)=>{
  try {
    const docId = req.params.id; // Lấy ID tài liệu từ URL
    const newData = req.body; // Dữ liệu mới từ request body

    // Cập nhật tài liệu dựa trên ID và dữ liệu mới đã cung cấp
    await db1.collection('Vouchers').doc(docId).set(newData, { merge: true });

    res.status(200).send(`Document with ID: ${docId} updated successfully`);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Error updating data in Firestore');
  }
});

module.exports = router;