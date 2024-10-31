const db = require('../../model/firebaseConfig'); 

var express = require('express');
const admin = require("firebase-admin");
var router = express.Router();

router.get('/data',async(req,res,next)=>{
    try {
        // Truy vấn dữ liệu từ Firestore
        const snapshot = await db.collection('Chat').get();
        const data = snapshot.docs.map(doc => doc.data());
        console.log(data);
        
        // Trả về dữ liệu dưới dạng JSON
        const docIds = snapshot.docs.map(doc => doc.id);
        const responseData = {
            data: data,
            docIds: docIds
        };
        res.json(responseData);
      } catch (error) {
        console.error('Error getting documents', error);
        res.status(500).json({ error: 'Something went wrong' });
      }
});
router.get('/send',async(req,res,next)=>{

    try {
        const docId = req.query.id;
        console.log(docId);
        
        
        const newData = {
            msg: req.query.msg,
            type: req.query.type,
        };
        // Dữ liệu mới từ request body
        console.log(newData);

        // Cập nhật tài liệu dựa trên ID và dữ liệu mới đã cung cấp
        await db.collection('Chat').doc(docId).update({
            messages: admin.firestore.FieldValue.arrayUnion(newData)
        });


    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data in Firestore');
    }
});
module.exports = router;