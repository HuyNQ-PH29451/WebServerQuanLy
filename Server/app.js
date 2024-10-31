var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

  
//Controller router
var satisticsRouter=require('./routes/WebServer/revenuestatistics');
var homeRouter = require('./routes/WebServer/home');
var productRouter = require('./routes/WebServer/product');
var userRouter = require('./routes/WebServer/user');
var staffRouter = require('./routes/WebServer/staff');
var ordersRouter = require('./routes/WebServer/donhang');
var orderdetail = require('./routes/WebServer/chitietdonhang');
var VRouter = require('./routes/WebServer/voucher');
var NotifiRT=require('./routes/WebServer/Notification');
var Chat=require('./routes/WebServer/chat');

//API ROuter
var indexRouter = require('./routes/API/index');
var usersRouter = require('./routes/API/users');
var apiCate=require('./routes/API/api.cate');
var apiStaff=require('./routes/API/api.staff');
var apiDonHang=require('./routes/API/api.donhang');
var apiHoaDon=require('./routes/API/api.hoaDon');
var apiRating=require('./routes/API/api.Rating');
var apiNotification=require('./routes/API/api.notification');
var apiFVR=require('./routes/API/api.FVR');
var apiAddress=require('./routes/API/api.addres');
var apiVoucher=require('./routes/API/api.vooucher');
const bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret:'nhNNGHSNFGH83sdf23435Fdzgsfnksjdfh9', // chuỗi ký tự đặc biệt để Session mã hóa, tự viết
  resave:false,
  saveUninitialized:false
  }));



//WEB SERVER
app.use('/', homeRouter);
app.use('/products',productRouter);
app.use('/users',userRouter);
app.use('/staffs',staffRouter);
app.use('/Orders',ordersRouter);
app.use('/OrderDetails',orderdetail);
app.use('/Vouchers',VRouter);
app.use('/Statistics',satisticsRouter);
app.use('/Notification',NotifiRT);
app.use('/Chat',Chat);
//API
app.use('/API/product', indexRouter);
app.use('/API/users', usersRouter);
app.use('/API/Cate',apiCate);
app.use('/API/staff',apiStaff);
app.use('/API/donhang',apiDonHang);
app.use('/API/hoaDon',apiHoaDon);
app.use('/API/Rating',apiRating);
app.use('/API/ntf',apiNotification);
app.use('/API/fvr',apiFVR);
app.use('/API/Address', apiAddress);
app.use('/API/Voucher', apiVoucher);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
