const mysql = require('mysql');

// 내 db 의 값 가져오기
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '1234',
    database        : 'karen'
  });
  
module.exports = pool;