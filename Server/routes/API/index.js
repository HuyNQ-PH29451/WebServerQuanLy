var express = require('express');
var router = express.Router();
const db = require('../../model/firebaseConfig'); 
const { log } = require('debug/src/browser');
const admin = require('firebase-admin');

/* GET home page. */
router.get('/', async(req, res, next) =>{
  try {
    const Id = req.query.id;
    
    if (!Id) {
      // Nếu không có tham số truy vấn 'name', trả về tất cả người dùng
      const snapshot = await db.collection('products').get();
      
    const data = [];

    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data(),
        
      });
      
    });
    res.status(200).json(data);
    }else{
      const snapshot = await db.collection('products').where('id', '==', req.query.id).get();
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
  }});
router.get('/getbyid', async (req, res, next) => {
  try {
    const id = req.query.id; // Lấy giá trị id từ query parameter

    const snapshot = await db.collection('products').where('id', '==', id).get();
    const data = [];

    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data from Firestore');
  }
});
  router.post('/add',async(req,res,next)=>{
    try {
      // Dữ liệu từ request body
     const collectionRef = admin.firestore().collection('products');
           const Id = collectionRef.doc().id;
         
           const docID = Id ? collectionRef.doc(Id) : collectionRef.doc();

           let data2 = {
            id: Id,
            Name: req.body.Name,
            Categories: req.body.Categories,
            Content: req.body.Content,
            Price: req.body.Price,
            Sale:req.body.Sale,
            Img: req.body.Img,
            Size: req.body.Size,
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

  router.delete('/delete/:id',async(req,res,next)=>{
    try {
      const docId = req.params.id; // Lấy ID tài liệu từ URL
  
      // Xóa tài liệu dựa trên ID đã cung cấp
      await db.collection('products').doc(docId).delete();
  
      res.status(200).send(`Document with ID: ${docId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).send('Error deleting data from Firestore');
    }
  });

  router.put('/update',async(req,res,next)=>{
    try {
      const docId = req.params.id; // Lấy ID tài liệu từ URL
      // const newData = req.body; // Dữ liệu mới từ request body
      //
      // // Cập nhật tài liệu dựa trên ID và dữ liệu mới đã cung cấp
      // await db.collection('products').doc(docId).set(newData, { merge: true });
  
      res.status(200).send(`Document with ID: ${docId} updated successfully`);
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).send('Error updating data in Firestore');
    }
  })
router.post('/updatebyAddressID', async (req, res, next) => {
    try {
        const iduser = req.query.iduser;
        const input = req.body.input;
        const collectionRef = db.collection('Address');

        collectionRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const docData = doc.data();

                // Kiểm tra và xóa đối tượng map
                for (const key in docData) {
                    const fieldValue = docData[key];
                    if (typeof fieldValue === 'object' && fieldValue !== null && fieldValue.idAdress=== iduser) {
                        docData[key]=input ;
                        break;
                    }
                }

                // Cập nhật lại tài liệu
                doc.ref.set(docData)
                    .then(() => {
                        console.log('Đối tượng map đã được cap nhat thành công');
                        res.send("cap nhat thanh cong")
                    })
                    .catch((error) => {
                        console.error('Lỗi khi cập nhật tài liệu:', error);
                    });
            });
        }).catch((error) => {
            console.error('Lỗi khi truy xuất tài liệu:', error);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from Firestore');
    }
});
router.get('/deletebyAddressID', async(req, res, next) =>{
    try {
        const iduser = req.query.iduser;
        const collectionRef = db.collection('Address');

        collectionRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const docData = doc.data();

                // Kiểm tra và xóa đối tượng map
                for (const key in docData) {
                    const fieldValue = docData[key];
                    if (typeof fieldValue === 'object' && fieldValue !== null && fieldValue.idAdress=== iduser) {
                        delete docData[key];
                        break;
                    }
                }

                // Cập nhật lại tài liệu
                doc.ref.set(docData)
                    .then(() => {
                        console.log('Đối tượng map đã được xóa thành công');
                        res.send("xoa thanh cong")
                    })
                    .catch((error) => {
                        console.error('Lỗi khi cập nhật tài liệu:', error);
                    });
            });
        }).catch((error) => {
            console.error('Lỗi khi truy xuất tài liệu:', error);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from Firestore');
    }
});

module.exports = router;
