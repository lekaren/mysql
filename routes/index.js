var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '1234',
  database        : 'karen'
});

// 로그인 페이지
router.get('/', function(req, res, next) {
  const id = req.body.id;
  const pw = req.body.pw;
  res.render('lgg');
});

// 로그인 처리
router.post('/', function(req, res, next) {
  
  const id = req.body.id;
  const pw = req.body.pw;

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM user WHERE email = '${id}' AND pw = PASSWORD('${pw}');`, function(err, result){
      if(result.length > 0){
        res.render('lgi', {id: id, pw: pw});
        // console.log('-------------로그인 성공-------------');
      }
      else {
        res.render('lgf');
        // console.log('-------------로그인 실패-------------');
      }
      conn.release();
    });
  });
});

// 회원 목록
router.get('/user', function(req, res, next) {
  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM user;', function(err, results){
      res.render('index' ,{results : results});

      conn.release();
    });
  });
});


module.exports = router;
