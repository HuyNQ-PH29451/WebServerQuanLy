const admin = require('firebase-admin');
// const firestore  = admin.firestore();
// firestore.settings({ignoreUndefinedProperties:true});


exports.listVouchers = async (req, res, next) => {
    let msg = '';
    let list = null;
    let listJson = [];
  
   
    try {
        list = await admin.firestore().collection('Vouchers').get();
    // Truy vấn tài liệu từ Firestore
    
        list.docs.forEach(doc => {
            const docData = doc.data();
           
            listJson.push(docData);
           
           
        });

        msg = 'Lấy dữ liệu thành công !';
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from Firestore');
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
        
    }

    res.render('../views/Vou/listV.ejs', { title: "Vouchers", listVouchers: listJson });
}


exports.delete=async(req,res,next)=>{
  try {
      let id = req.params.id; // Lấy ID tài liệu từ URL
  
      // Xóa tài liệu dựa trên ID đã cung cấp
      await admin.firestore().collection('Vouchers').doc(id).delete();
  
      res.redirect('/Vouchers');
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).send('Error deleting data from Firestore');
    }
}

exports.addVoucher = async (req, res, next) => {


    try {
        const collectionRef = admin.firestore().collection('Vouchers');
       const docID = req.body.addidname;
        let data = ({
            id: docID,
            Discount: req.body.addDiscount,
            SoLuong:req.body.addSLV,
            Title: req.body.addTitle,
            From: req.body.addFrom
        });
        
        await  collectionRef.doc(docID).set(data)
        .then(() => {
            res.redirect('/Vouchers');
            res.send({ success: true, message: 'Data added to Firestore successfully' });
            return collectionRef.doc().id;
        })
        .catch(error => {
            console.error('Lỗi khi thêm tài liệu:', error);
            // res.status(500).json({message: 'Lỗi khi thêm tài liệu'});
        });
        //   await admin.firestore().collection('Vouchers').doc().set({
        //     Discount: req.body.Discount,
        //     id: req.params.id,
        //     Title: req.body.Title,
        //     From: req.body.from
        // });

    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).send('Error adding data from Firestore');
    }
    
};

exports.updateVoucher = async (req, res, next) => {
    let _id = req.body.id;
    try {
        await admin.firestore().collection('Vouchers').doc(_id).set({

            Discount: req.body.Discount,
            id: req.body.id,
            Title: req.body.Title,
            From: req.body.from

        }, { merge: true });
        res.redirect('/Vouchers');
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send('Error deleting data from Firestore');
    }

}