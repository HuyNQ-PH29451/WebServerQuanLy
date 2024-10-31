const md = require('../model/firebaseConfig'); 
const admin = require('firebase-admin');
exports.listProducts = async (req, res, next) => {
    let msg = '';
    let list = null;
    let listJson = [];
    
    let categories = null;
    let categoriesJson = [];
   
    try {
        list = await admin.firestore().collection('products').get();
        categories = await admin.firestore().collection('Category').get();
         
       
    // Truy vấn tài liệu từ Firestore
    
        list.docs.forEach(doc => {
            const docData = doc.data();
           
            listJson.push(docData);
           
           
        });

        categories.docs.forEach(doc => {
           
            categoriesJson.push(doc.data());
        });
        
        msg = 'Lấy dữ liệu thành công !';
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from Firestore');
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
        
    }

    res.render('product/list', { title: "Products", listProducts: listJson, msg: msg, categories: categoriesJson });
}
exports.loginScreen = async (req, res, next) => {
    res.render('home/login', { title: "Login",message:''});
}
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
exports.validateData= async(req, res, next)=> {
   const Name= req.body.Name;
   const Categories= req.body.Categories;
   const Content= req.body.Content;
   const Price= req.body.Price;
   const Sale=req.body.Sale;
  
    if (!Name || !Categories ||!Content ||!Price||!Sale ) {
      return res.status(400).json({ error: ' Không được để trống' });
    }
    // Kiểm tra dữ liệu khác nếu cần
    next();
  }
exports.addProduct= async(req,res,next)=>{
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
          

            const collectionRef = admin.firestore().collection('products');
            const Id = collectionRef.doc().id;
            
            const Size = req.body.Size || [] ;
            
            let data2 = {
                id: Id,
                Name: req.body.Name,
                Categories: req.body.Categories,
                Content: req.body.Content,
                GiaNhap:req.body.GiaNhap,
                Price: req.body.Price,
                Sale:req.body.Sale,
                Img: UrlFile,
                Size:{ [req.body.SizeS]: req.body.SlS,
                    [req.body.SizeM]: req.body.SlM,
                    [req.body.SizeL]: req.body.SlL,
                    [req.body.SizeXL] : req.body.SlXL},
            }
            // Dữ liệu từ request body
            const docID = Id ? collectionRef.doc(Id) : collectionRef.doc();
            const dataRef = collectionRef.doc(Id);
            // Thay thế bằng collection và document ID của bạn

            // Thêm dữ liệu vào collection cụ thể (ví dụ: 'your-collection-name')

            docID.set(data2)
                .then(() => {
                    res.redirect('/products');
                    res.send({ success: true, message: 'Data added to Firestore successfully' });
                    return collectionRef.doc().id;
                })
                .catch(error => {
                    console.error('Lỗi khi thêm tài liệu:', error);
                    // res.status(500).json({message: 'Lỗi khi thêm tài liệu'});
                });
            // const docRef = await collectionRef.add(data);

            // Lấy Document ID đã sinh tự động


        } catch (error) {
            console.error('Error adding data:', error);
          
        }

    });


  };

  exports.delete=async(req,res,next)=>{
    try {
        let id = req.params.id; // Lấy ID tài liệu từ URL
    
        // Xóa tài liệu dựa trên ID đã cung cấp
        await admin.firestore().collection('products').doc(id).delete();
    
        res.redirect('/products');
      } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send('Error deleting data from Firestore');
      }
}
exports.put=async(req,res,next)=>{
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
            const Size = req.body.Size || [];
            let data2 = {
               
                Name: req.body.Name,
                Categories: req.body.Categories,
                Content: req.body.Content,
                Price: req.body.Price,
                Sale:req.body.Sale,
                Img: UrlFile,
                Size:{ [req.body.SizeS]: req.body.SlS,
                    [req.body.SizeM]: req.body.SlM,
                    [req.body.SizeL]: req.body.SlL,
                    [req.body.SizeXL] : req.body.SlXL},
            }
        
            const docId = req.params.id; // Lấy ID tài liệu từ URL
             // Dữ liệu mới từ request body
        
            // Cập nhật tài liệu dựa trên ID và dữ liệu mới đã cung cấp
            await admin.firestore().collection('products').doc(docId).set(data2, { merge: true });
            res.redirect('/products');
            // const docRef = await collectionRef.add(data);
        
            // Lấy Document ID đã sinh tự động
        
        
        } catch (error) {
            console.error('Error adding data:', error);
            res.status(500).send('Error adding data to Firestore');
        }

    });
  }
  