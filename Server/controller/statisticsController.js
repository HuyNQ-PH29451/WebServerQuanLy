const moment =require('moment');

const admin = require('firebase-admin');
const db = require('../model/firebaseConfig'); 
exports.Home = async (req, res, next) => {
    let label="";
    let msg="";
    let type="";
    let monthLabels =[];
        const snapshot = await db.collection("Order Details").get();
        const orderDetails = [];
    const theloai = req.query.Tl;
    const thoigian = req.query.time;
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    if(theloai==="SP"){
        label="Sản phẩm bán ra (Chiếc)";
    }else{
        label="Doanh Thu (Triệu VND)";
    }
 if(theloai==="SP"&&thoigian==="all"){
     msg= 'Đây là dữ liệu được lấy từ tháng 1 năm 2024'
     const monthSums = Array(12).fill(0);
     snapshot.forEach((doc) => {
         const data = doc.data();
         const soLuong = data.SoLuong; // Thay đổi tên trường từ TongTien thành SoLuong
         const time = data.Time;
         orderDetails.push({ soLuong, time }); // Thay đổi tên biến từ tongTien thành soLuong
     });
     orderDetails.forEach((item) => {
         const [, month] = item.time.split('/');
         const monthIndex = parseInt(month) - 1;
         const soLuong = parseInt(item.soLuong); // Thay đổi tên trường từ tongTien thành soLuong
         monthSums[monthIndex] += soLuong; // Thay đổi tên biến từ tongTienInMillion thành soLuong
     });
     monthLabels = monthSums.map((sum, index) => {
         return sum > 0 ? sum : 0;
     });
     chartDates=['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
 }
    if (theloai === "SP" && thoigian === "today") {
        let totalSoLuong = 0;

        const today = new Date();
        const day = today.getDate().toString().padStart(2, "0");
        const month = (today.getMonth() + 1).toString();
        const year = today.getFullYear().toString();
        const dayOfWeek = today.getDay(); // Lấy thứ của ngày hôm nay

        const formattedDate = `${day}/${month}/${year}`;
        chartDates=formattedDate;
        console.log(chartDates);
        msg='Đây là dữ liệu được lấy từ hôm nay: '+formattedDate;
        const snapshot = await db
            .collection("Order Details")
            .where("Time", "==", formattedDate)
            .get();

        snapshot.forEach((doc) => {
            const data = doc.data();
            const soLuong = data.SoLuong;
            // Thực hiện các thao tác xử lý với dữ liệu
            console.log("Item:", data);

            // Tính tổng giá trị SoLuong và thêm vào orderDetails
            orderDetails.push(soLuong);
            totalSoLuong += parseInt(soLuong);
        });
        monthLabels=[totalSoLuong];
        console.log("Tổng giá trị SoLuong:", [totalSoLuong]);
    }
    if (theloai === "SP" && thoigian === "week") {

        const chartData = [0, 0, 0, 0, 0, 0, 0];
        moment.locale('en', {
            week: {
                dow: 1, // 1: Thứ hai, 0: Chủ nhật
            },
        });
        const startOfWeek = moment().startOf('week');
        const endOfWeek = moment().endOf('week');
        const filteredItems = [];
        msg= 'Đây là dữ liệu được lấy từ thứ 2 '+startOfWeek.format('DD-M-YYYY')+' đến chủ nhật '+endOfWeek.format('DD-M-YYYY');

        snapshot.forEach((doc) => {
            const item = doc.data();
            const itemTime = moment(item.Time, 'DD/M/YYYY');
            const dayOfWeek = itemTime.day();

            // Kiểm tra xem trường Time có nằm trong khoảng từ đầu tuần đến cuối tuần không
            if (itemTime.isSameOrAfter(startOfWeek, 'day') && itemTime.isSameOrBefore(endOfWeek, 'day')) {
                chartData[dayOfWeek] += parseInt(item.SoLuong);
                filteredItems.push(item);
            }
        });
        const modifiedChartData = [
            chartData[1], // Thứ Hai
            chartData[2], // Thứ Ba
            chartData[3], // Thứ Tư
            chartData[4], // Thứ Năm
            chartData[5], // Thứ Sáu
            chartData[6], // Thứ Bảy
            chartData[0], // Chủ Nhật
        ];
        console.log(modifiedChartData);
monthLabels=modifiedChartData;
       chartDates = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
    }
  if (theloai === "SP" && thoigian === "month") {
      type="month";
      var listitem = [];
 var Dates = [];
      var Value = [];
      snapshot.forEach((doc) => {
          var item = doc.data();
          var itemTime = moment(item.Time, "DD/M/YYYY"); // Chuyển đổi trường thời gian thành định dạng Moment.js

          // Kiểm tra xem item có trường thời gian hợp lệ không
          if (itemTime.isValid()) {
              var currentDate = moment(); // Lấy ngày hiện tại
              var startOfMonth = moment().startOf('month'); // Lấy ngày đầu tháng
              var endOfMonth = moment().endOf('month'); // Lấy ngày cuối tháng

              // Kiểm tra xem itemTime có nằm trong khoảng từ đầu tháng đến cuối tháng hiện tại không
              if (itemTime.isBetween(startOfMonth, endOfMonth, 'day', '[]')) {
                  listitem.push({
                      date: itemTime.format("DD/M/YYYY"),
                      value: parseInt(item.SoLuong)
                  });
              }
          }
      });
      msg= 'Đây là dữ liệu được lấy từ tháng này';
      listitem.forEach((item) => {
          var index = Dates.findIndex((date) => date === item.date);

          if (index === -1) {
             Dates.push(item.date);
              Value.push(parseInt(item.value));
          } else {
              Value[index] += parseInt(item.value);
          }
      });
chartDates=Dates;
    monthLabels=Value;
      console.log(monthLabels);
    }
if(theloai==="Doanhthu"&&thoigian==="all"){
  msg= 'Đây là dữ liệu được lấy từ tháng 1 năm 2024'
    type="Doanhthu";
    const monthSums = Array(12).fill(0);
    snapshot.forEach((doc) => {
        const data = doc.data();
        const tongTien = data.TongTien;
        const time = data.Time;
        orderDetails.push({ tongTien, time });
    });

    orderDetails.forEach(item => {
        const [, month] = item.time.split('/');
        const monthIndex = parseInt(month) - 1;
        const tongTien = parseInt(item.tongTien);
        const tongTienInMillion = tongTien / 1000000; // Chia tổng tiền cho một triệu
        monthSums[monthIndex] += tongTienInMillion;
    });
     monthLabels = monthSums.map((sum, index) => {
        return sum > 0 ? sum : 0;
    });
    chartDates=['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
}
    if (theloai === "Doanhthu" && thoigian === "today") {
        let totalSoLuong = 0;

        const today = new Date();
        const day = today.getDate().toString().padStart(2, "0");
        const month = (today.getMonth() + 1).toString();
        const year = today.getFullYear().toString();
        const dayOfWeek = today.getDay(); // Lấy thứ của ngày hôm nay

        const formattedDate = `${day}/${month}/${year}`;
        chartDates=formattedDate;
        console.log(chartDates);
        msg='Đây là dữ liệu được lấy từ hôm nay: '+formattedDate;
        const snapshot = await db
            .collection("Order Details")
            .where("Time", "==", formattedDate)
            .get();

        snapshot.forEach((doc) => {
            const data = doc.data();
            const soLuong = data.TongTien/1000000;
            // Thực hiện các thao tác xử lý với dữ liệu
            console.log("Item:", data);

            // Tính tổng giá trị SoLuong và thêm vào orderDetails
            orderDetails.push(soLuong);
            totalSoLuong += parseInt(soLuong);
        });
        monthLabels=[totalSoLuong];
        console.log("Tổng giá trị SoLuong:", [totalSoLuong]);
    }
    if (theloai === "Doanhthu" && thoigian === "week") {

        const chartData = [0, 0, 0, 0, 0, 0, 0];
        moment.locale('en', {
            week: {
                dow: 1, // 1: Thứ hai, 0: Chủ nhật
            },
        });
        const startOfWeek = moment().startOf('week');
        const endOfWeek = moment().endOf('week');
        const filteredItems = [];
        msg= 'Đây là dữ liệu được lấy từ thứ 2 '+startOfWeek.format('DD-M-YYYY')+' đến chủ nhật '+endOfWeek.format('DD-M-YYYY');

        snapshot.forEach((doc) => {
            const item = doc.data();
            const itemTime = moment(item.Time, 'DD/M/YYYY');
            const dayOfWeek = itemTime.day();

            // Kiểm tra xem trường Time có nằm trong khoảng từ đầu tuần đến cuối tuần không
            if (itemTime.isSameOrAfter(startOfWeek, 'day') && itemTime.isSameOrBefore(endOfWeek, 'day')) {
                chartData[dayOfWeek] += parseInt(item.TongTien/1000000);
                filteredItems.push(item);
            }
        });
        const modifiedChartData = [
            chartData[1], // Thứ Hai
            chartData[2], // Thứ Ba
            chartData[3], // Thứ Tư
            chartData[4], // Thứ Năm
            chartData[5], // Thứ Sáu
            chartData[6], // Thứ Bảy
            chartData[0], // Chủ Nhật
        ];
        console.log(modifiedChartData);
        monthLabels=modifiedChartData;
        chartDates = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
    }
    if (theloai === "Doanhthu" && thoigian === "month") {
        type="month";
        var listitem = [];
        var Dates = [];
        var Value = [];
        snapshot.forEach((doc) => {
            var item = doc.data();
            var itemTime = moment(item.Time, "DD/M/YYYY"); // Chuyển đổi trường thời gian thành định dạng Moment.js

            // Kiểm tra xem item có trường thời gian hợp lệ không
            if (itemTime.isValid()) {
                var currentDate = moment(); // Lấy ngày hiện tại
                var startOfMonth = moment().startOf('month'); // Lấy ngày đầu tháng
                var endOfMonth = moment().endOf('month'); // Lấy ngày cuối tháng

                // Kiểm tra xem itemTime có nằm trong khoảng từ đầu tháng đến cuối tháng hiện tại không
                if (itemTime.isBetween(startOfMonth, endOfMonth, 'day', '[]')) {
                    listitem.push({
                        date: itemTime.format("DD/M/YYYY"),
                        value: parseInt(item.TongTien/1000000)
                    });
                }
            }

        });
        msg= 'Đây là dữ liệu được lấy từ tháng này';
        listitem.forEach((item) => {
            var index = Dates.findIndex((date) => date === item.date);

            if (index === -1) {
                Dates.push(item.date);
                Value.push(parseInt(item.value));
            } else {
                Value[index] += parseInt(item.value);
            }
        });
        chartDates=Dates;
        monthLabels=Value;
        console.log(monthLabels);
    }

    res.render('statistics/chart', { title: "Statistics", listdata: monthLabels,msg:msg,monthdate:chartDates,label:label});
}



