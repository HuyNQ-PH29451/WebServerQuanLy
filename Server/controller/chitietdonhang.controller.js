const admin = require('firebase-admin');
const firestore = admin.firestore();


exports.getOrderDetailList = async (req, res, next) => {
    let list = [];
    let OrderDetailsList =null;

    let listpr = null;
    let listJson = [];

    let listst = null;
    let listJsonSt = [];
    try {
        listpr = await admin.firestore().collection('products').get();
        listst = await admin.firestore().collection('Staff').get();
        OrderDetailsList = await firestore.collection('Order Details').get();
        if (OrderDetailsList.empty) {
            console.log('No matching OrderDetailsList.');
            return;
        }
        OrderDetailsList.docs.forEach(doc => {
            list.push(doc.data());
        });
        // console.log("list:", list);
        listpr.docs.forEach(doc => {
            const docData = doc.data();
           
            listJson.push(docData);
           
           
        });

        listst.docs.forEach(doc => {
            listJsonSt.push(doc.data());
        });
    } catch (error) {
        console.error('Fetching error data:', error);
        res.status(500).send('Error fetching data');
    }
    res.render('orderDetails/chitietdonhang', { listOrderDetail: list,product:listJson,Staff:listJsonSt });
}

exports.newbill= async(req,res,next)=>{
    try {
         const collectionRef=admin.firestore().collection('Order Details');
    const Id=collectionRef.doc().id;
    const date =  new Date();

    // Định dạng lại ngày tháng theo định dạng mong muốn
   var newdate= date.getDate()+'/' + (date.getMonth() + 1)   +  '/' +  date.getFullYear();;
   const Size= req.body.Size||[];
   let dataBill={
        id:Id,
        Product : req.body.Product||[],
        SoLuong : req.body.SLSP,
        Staff_name : req.body.Staff_name,
        Time: newdate,
        TongTien : req.body.TongTien,
        Username : req.body.Username,
        Size :Size,
        note: req.body.note,
    }

    const docId=Id? collectionRef.doc(Id):collectionRef.doc();
 await  docId.set(dataBill).then(()=>{
        res.redirect('/OrderDetails');
        res.send({ success: true, message: 'Data added to Firestore successfully' });
        return Id;
    }).catch(err=>{
        console.log(err);
        // res.status(500).json({message:"Lỗi khi thêm tài liệu"})
});
    } catch (error) {
        console.error('Error adding data:', error);
    }
   
}

exports.delete = async (req, res, next) => {
    try {
        let id = req.params.id;
        await firestore.collection('Order Details').doc(id).delete();
        res.redirect('/OrderDetails');
    } catch (error) {
        console.error('fetching error data',error);
        res.status(500).send('Error data');
    }
    
}

exports.put = async(req,res,next) =>{
    const date =  new Date();
    
    var newdate= date.getDate()+'/' + (date.getMonth() + 1)   +  '/' +  date.getFullYear();;
   const Size= req.body.Size||[];
   let dataBill={
       
        Product : req.body.Product||[],
        SoLuong : req.body.SLSP,
        Staff_name : req.body.Staff_name,
        Time: newdate,
        TongTien : req.body.TongTien,
        Username : req.body.Username,
        Size :Size,
        note: req.body.note,
    }
    
    try {
        console.log(dataBill);
        const id = req.params.id;
        await firestore.collection('Order Details').doc(id).set(dataBill,{merge : true});
        res.redirect('/OrderDetails');
    } catch (error) {
        console.error('fetching error data',error);
        res.status(500).send('Error data');
    }
    

}

exports.tinhtongtien= async(req, res,next) => {
    const cacMucDaChon = req.body.items;
    const quantities = req.body.quantities;

    // Lấy giá của các mục đã chọn từ Firestore và tính tổng tiền
    let tongTien = 0;
    const promises = []; 
    // cacMucDaChon.forEach(muc => {
    //     const mucRef = admin.firestore().collection('products').doc(muc);
    //     promises.push(mucRef.get().then(doc => {
            
    //         if (doc.exists) {
    //             tongTien += parseInt (doc.data().Price) * parseInt(quantities); // Giả sử mỗi mục có trường "gia"
    //         }
    //     }));

    // });

    cacMucDaChon.forEach((item, index) => {
        const itemRef = admin.firestore().collection('products').doc(item);
        promises.push(itemRef.get().then(doc => {
            if (doc.exists) {
                const price = parseInt (doc.data().Price); // Assuming each item has a "price" field
                const quantity = parseInt(quantities[index], 10); // Parse quantity as integer
                tongTien += price * quantity;
            }
        }));
    });

    

    Promise.all(promises)
    .then(() => {
        res.json({ total: tongTien });
    })
    .catch(error => {
        console.error('Lỗi khi tính tổng tiền:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    });

    
}