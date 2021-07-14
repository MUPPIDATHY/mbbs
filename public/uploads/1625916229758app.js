const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const page = require('./route/page');

var conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'tmc'
  });
  conn.getConnection((err,connection) =>{
    if(connection)
        console.log('connected')
    return;
})

global.db = conn;

dotenv.config({path: './.env'});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render('index.ejs',{mobile_no:'',message:''});    
});
app.get('/admin',(req,res)=>{
    res.render('admin.ejs');    
});
// app.get('/user',(req,res)=>{
//     var message = '';
//     res.render('user.ejs',{message:message});    
// });
app.get('/loginuser',(req,res)=>{
    var message = '';
    res.render('login_user.ejs',{message:message});    
});
app.post('/get_otp',page.getotp);
app.post('/login',page.verifyotp);
app.post('/user',page.approved);
app.post('/approved',page.approved);


app.post('/loginuser',(req,res)=>{
    var message = "";
    var post=req.body;
    var username=post.username;
    var password=post.password;
    var render_page="";
    if(username=='admin')
    {
        render_page='admin.ejs';
    }
    else if(username=='user')
    {
        render_page='user.ejs';
    }
    else
    {
        message="Invalid Username!";
        render_page='login_user.ejs';
    }

    console.log('User name :'+username+' Pwd:'+password);
    var sql = "select * FROM `tmc`.`login` WHERE (`username` = '"+username+"' and `password`='"+password+"'); ";
    db.query(sql,(err,data)=>{
    res.render(render_page, { message: message });
    
    });
    
   
 });
app.listen(7000,()=>{
    console.log('http://localhost:7000')
});

// select top1,otp  from OTP where OTP ='' and mobile_number = ''  order by last_updated_time desc
// select count(!) from OTP where OTP ='' and mobile_number = ''  order by last_updated_time desc

