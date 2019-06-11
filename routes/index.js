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

  req.session.ID = req.body.id;
  req.session.PW = req.body.pw;

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM user WHERE email = '${id}' AND pw = PASSWORD('${pw}');`, function(err, results){

      if(req.session.ID && req.session.PW){
        conn.query('SELECT * FROM user;', function(err, results){
        res.render('lgi', {results : results});
        });
      }else{
        res.render('index', { });
      }

      // if(result.length > 0){
      //   res.render('lgi', {id: id, pw: pw});
      // }
      // pool.getConnection(function(err, conn){
      //   conn.query(`SELECT * FROM user;`, function(err, results){
          
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

// 회원 탈퇴
router.get('/delete', function(req, res, next) {
  pool.getConnection(function(err, conn){
    if(err) {throw err;
    }
    conn.query(`DELETE FROM user WHERE num = '${req.query.num}'`, function(err, results){
      conn.release();
      req.session.destroy();
      res.redirect('/user');
    });
  });
});

// 회원가입
router.get('/sigu', function(req, res, next) {
  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM user;', function(err, results){
      res.render('sigu' ,{results : results});

      conn.release();
    });
  });
});


// 회원가입에서 적은 정보를 저장
router.post('/sigu', function(req, res, next) {
    
    const name = req.body.name;
    const age = req.body.age;
    const birth = req.body.birth;
    const add = req.body.add;
    const post = req.body.post;
    const hobby = req.body.hobby;
    const number = req.body.number;
    const id = req.body.id;
    const pw = req.body.pw;

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM user WHERE email = '${id}'`,function(err, result){
      if(result.length > 0) {
        res.render('sigu');
      } else {
        conn.query(`INSERT INTO user(name, age, birth, address, post, hobby, number, email, pw)VALUES('${name}', '${age}', '${birth}', '${add}', '${post}', '${hobby}', '${number}', '${id}', PASSWORD('${pw}'));`,function(err, result){
          res.render('lgg');
        });
      }
    });
  });
 });

module.exports = router;
