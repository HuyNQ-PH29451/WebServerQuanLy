const express = require('express');
const socketIO = require('socket.io');
const admin = require('firebase-admin');
var router = express.Router();
const http = require('http');
const app = express();
const server = http.createServer(router); // Tạo một instance của http.Server
const io = socketIO(server); 

// Khởi tạo Firebase Admin SDK


// Lấy tham chiếu đến Firestore
const firestore = admin.firestore();

router.get('/data',async(req,res,next)=>{
    try {
        // Truy vấn dữ liệu từ Firestore
        const snapshot = await admin.firestore().collection('Notification').get();
        const data = snapshot.docs.map(doc => doc.data());
        // Trả về dữ liệu dưới dạng JSON
        res.json(data);
      } catch (error) {
        console.error('Error getting documents', error);
        res.status(500).json({ error: 'Something went wrong' });
      }
})

// Định nghĩa route để phục vụ trang web hoặc ứng dụng của bạn

// Kết nối Socket.IO và xử lý các sự kiện
io.on('connection', (socket) => {
    console.log('Client connected');

    // Lắng nghe sự kiện khi client yêu cầu dữ liệu
    socket.on('requestData', async () => {
        try {
            const data = await fetchDataFromFirestore(); // Hàm này lấy dữ liệu từ Firestore
            socket.emit('dataResponse', data); // Gửi dữ liệu trả về cho client
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    // Xử lý sự kiện khi client ngắt kết nối
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Hàm để lấy dữ liệu từ Firestore
async function fetchDataFromFirestore() {
    // Code để truy vấn dữ liệu từ Firestore ở đây
    const data = [];
    try {
        const querySnapshot = await firestore.collection('Notification').get();
        querySnapshot.forEach((doc) => {
            const notificationData = doc.data();
            data.push(notificationData);
        });
        return data;
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
        throw error;
    }
}

module.exports = router;