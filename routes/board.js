
var express = require('express');  
var router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const pool = mysql.createPool({
  connectionLimit : 10, 
  host            : 'localhost',
  user            : 'root',
  password        : '1234',
  database        : 'karen',
  dateStrings     : 'date' 
});

// 게시판으로 이동
router.get('/board', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM board;', function(err, results){
      res.render('board', { results: results });
      
      conn.release();
    });
  });
});

// 게시판글 등록으로 이동
router.get('/create', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM board WHERE NAME='${req.session.ID}';`, function(err, results){
      res.render('create', { results: results });
      
      conn.release();
    });
  });
});


// 게시판글 저장
router.post('/create2', function(req, res, next) {
  const title = req.body.title;
  const content = req.body.content;

  pool.getConnection(function(err, conn){
    conn.query(`INSERT INTO board (title, content, id) VALUES ('${title}','${content}','${req.session.ID}');`, function(err, results){
      res.redirect('/board/board');
      
      conn.release();
    });
  });
});

/*게시판글 삭제*/
router.get('/delete', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM board WHERE id='${req.session.ID}';`, function(err, results){
      res.render('delete', { results: results });
      
      conn.release();
    });
  });
});

/*게시판글 삭제*/
router.get('/final', function(req, res, next) {
  const title = req.query.title;
  pool.getConnection(function(err, conn){
    console.log(req);
    conn.query(`DELETE FROM board WHERE number='${req.query.number}'`, function(err, results){
      res.redirect('/board/board');
      
      conn.release();
    });
  });
});

module.exports = router;
