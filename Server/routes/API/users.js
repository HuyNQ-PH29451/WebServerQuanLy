var express = require('express');
var router = express.Router();
const admin = require('firebase-admin');
const db = require('../../model/firebaseConfig'); 
/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const Phone = req.query.Phone;
    if (!Phone) {
      // Nếu không có tham số truy vấn 'name', trả về tất cả người dùng
      const snapshot = await db.collection('Users').get();
    const data = [];

    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data(),
        
      });
      
    });
    res.status(200).json(data);
    }else{
      const snapshot = await db.collection('Users').where('Phone', '==', req.query.Phone).get();
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
router.get('/getbyid', async (req, res, next) => {
  try {
    const id = req.query.id;
    if (!id) {
      // Nếu không có tham số truy vấn 'id', trả về tất cả người dùng
      const snapshot = await db.collection('Users').get();
      const data = [];

      snapshot.forEach(doc => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      res.status(200).json(data);
    } else {
      const snapshot = await db.collection('Users').where('id', '==', req.query.id).get();
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
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now()  + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });
const bucket = admin.storage().bucket();
  router.post('/add',async(req,res,next)=>{
    upload.single('avatar')(req, res, async (err) => {
      if (err) {
        console.error('Lỗi tải lên tệp tin:', err);
        res.status(500).json({ message: 'Lỗi tải lên tệp tin' });
        return;
      }
      const fileName=req.file.filename;
      const filePath = path.resolve(req.file.path);
      const options = {
        destination: fileName
      };
      await bucket.upload(filePath, options);
      const UrlFile='https://firebasestorage.googleapis.com/v0/b/produc-e30a9.appspot.com/o/'+fileName+'?alt=media&token=1f7538b4-68a2-408e-8bc6-96f8f5a51650';
      try {
        const collectionRef = admin.firestore().collection('Users');
        const Id = collectionRef.doc().id;

        const docID = Id ? collectionRef.doc(Id) : collectionRef.doc();

        const data2={
          id:Id,
          Avatar: UrlFile,
          Address: req.body.Address,
          Phone:  req.body.Phone,
          FullName: req.body.FullName,
          Email: req.body.Email,
          Password: req.body.Password

        }
        docID.set(data2).then(() => {
          res.status(202).send(`Document with ID: add successfully`);
          return collectionRef.doc().id;
        })
            .catch(error => {
              console.error('Lỗi khi thêm tài liệu:', error);
              res.status(500).json({message: 'Lỗi khi thêm tài liệu'});
            });

      } catch (error) {
        console.error('Error adding data:', error);

      }

    });
  });

  router.delete('/delete/:id',async(req,res,next)=>{
    try {
      const docId = req.params.id; // Lấy ID tài liệu từ URL
  
      // Xóa tài liệu dựa trên ID đã cung cấp
      await db.collection('Users').doc(docId).delete();
  
      res.status(200).send(`Document with ID: ${docId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).send('Error deleting data from Firestore');
    }
  });
  router.put('/update/:id',async(req,res,next)=>{
    try {
      const docId = req.params.id; // Lấy ID tài liệu từ URL
      const newData = req.body; // Dữ liệu mới từ request body
  
      // Cập nhật tài liệu dựa trên ID và dữ liệu mới đã cung cấp
      await db.collection('Users').doc(docId).set(newData, { merge: true });
  
      res.status(200).send(`Document with ID: ${docId} updated successfully`);
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).send('Error updating data in Firestore');
    }
  })

  async function checkDuplicateKey(key) {
    const docRef = db.collection('yourCollection').doc(key);
    const docSnapshot = await docRef.get();
    return docSnapshot.exists;
  }
module.exports = router;
