
var express = require('express');  
var router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../config/dbconfig');

// 게시판으로 이동
router.get('/board', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query(`SELECT a.*,(SELECT COUNT(*) FROM comment WHERE board_id=a.number) AS 'cc' FROM board AS a;`, function(err, results){
      res.render('board/board', { results: results });
      console.log(results.cc);
      
      conn.release();
    });
  });
});

// 게시판글 등록으로 이동
router.get('/create', function(req, res, next) {
  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM board WHERE NAME='${req.session.ID}';`, function(err, results){
      res.render('board/create', { results: results });
      
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
      res.redirect('board');
      
      conn.release();
    });
  });
});

// 게시판글 삭제 페이지
router.get('/delete', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM board WHERE id='${req.session.ID}';`, function(err, results){
      res.render('board/delete', { results: results });
      
      conn.release();
    });
  });
});

// 게시판글 삭제
router.get('/final', function(req, res, next) {
  const title = req.query.title;
  pool.getConnection(function(err, conn){
    conn.query(`DELETE FROM board WHERE number='${req.query.number}'`, function(err, results){
      res.redirect('board');
      
      conn.release();
    });
  });
});

// 작성한 글 페이지로 이동
router.get('/cn', function(req, res, next) {
  const board_id = req.query.number;
  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM board WHERE number='${req.query.number}';`, function(err, results){
      conn.query(`SELECT * FROM comment WHERE board_id='${req.query.number}';`, function(err, com){
        res.render('board/content', {board_id:board_id , results : results , com:com});
      });
      
      
      conn.release();
    });
  });
});

// 글 수정 페이지
router.get('/ud', function(req, res, next) {
  const title = req.query.title;
  const content = req.query.content;

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM board WHERE number='${req.query.number}';`, function(err, results){
      res.render('board/update',{ result : results });
      
      conn.release();
    });
  });
});

// 글 수정 처리
router.post('/update', function(req, res, next) {
  const reqnumber = req.body.reqnumber;

  pool.getConnection(function(err, conn){
    conn.query(`UPDATE board SET title='${req.body.title}', content='${req.body.content}' WHERE number='${reqnumber}';`, function(err, results){
      res.redirect('board');
      
      conn.release();
    });
  });
});

// 댓글 달기
router.post('/cm', function(req, res, next) {
  const reqnumber = req.body.reqnumber;
  const number = req.query.number;
  const comment = req.body.comment;
  const board_id = req.body.board_id;

  pool.getConnection(function(err, conn){
    conn.query(`INSERT INTO comment(board_id, email, content) values('${board_id}', '${req.session.ID}', '${comment}');`, function(err, results){
      conn.query(`SELECT * FROM board WHERE number='${req.query.number}';`, function(err, results){
        // res.render('board/content', { results : results });
        res.redirect(`/board/content?number=${comment}&email=${req.session.ID}&comment=${comment}`);
      
        conn.release();
        });
      });      
  });
});

// 댓글 등록처리
router.post('/comment', function(req, res, next) {
  const reqnumber = req.body.reqnumber;
  const board_id = req.body.board_id;
  const comment = req.body.comment;

  pool.getConnection(function(err, conn){
    conn.query(`INSERT INTO comment(board_id, email, content) values('${board_id}', '${req.session.ID}', '${comment}');`, function(err, results){
      res.redirect(`/board/cn?number=${board_id}`);
      
      conn.release();
    });
  });
});

module.exports = router;