const mysql=require('mysql');

let db_host = process.env.DB_HOST;
let db_name = process.env.DB_NAME;
let db_user = process.env.DB_USER;
let db_password = process.env.DB_PASSWORD;

let connection=mysql.createConnection({
   host: db_host,
   user: db_user ,
   password: db_password,
   database: db_name
 });
connection.connect(function(error){
   if(!!error){
     console.error(error);
   }else{
     console.log('Connected');
   }
 });  
module.exports = connection; 
