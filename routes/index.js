const express = require('express');
const router = express.Router();
const connection = require('../lib/db');

const getUsersFromDB = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM simpleapp ORDER BY id desc', function (err, rows) {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    })
  });
} 

const insertUserToDB = (simpleapp_record) => {
  return new Promise((resolve, reject) =>{
    connection.query('INSERT INTO simpleapp SET ?', simpleapp_record, function (err, result) {
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

// GET root page 
router.get('/', (req, res, next) => {

  getUsersFromDB().then((rows)=>{
    res.render('index', { title: "Simpleapp - devops skill test", data: rows })
  },(err)=>{
    req.flash('error', err);
    res.render('index', { title: "Simpleapp - devops skill test", data: '' })
  });

});

// POST save new record action
router.post('/add', (req, res, next) => {
  req.assert('name', 'Name is required').notEmpty(); // validate name

  var errors = req.validationErrors()

  if (!errors) { // No validation errors were found

    var simpleapp_record = {
      name: req.sanitize('name').escape().trim(),
      favorite_color: req.sanitize('favorite_color').escape().trim(),
      cats_or_dogs: req.sanitize('cats_or_dogs').escape().trim()
    }

    insertUserToDB(simpleapp_record).then((result)=>{
        req.flash('success', 'New record was added succesfully');
        res.redirect('/')
    },(err)=>{
        console.error(err);
        req.flash('error', err.sqlMessage)
        res.redirect('/')
    });

  } else {

    // Display errors
    var error_msg = '';
    errors.forEach((error) => {
      error_msg += error.msg + '<br>'
    })
    req.flash('error', error_msg);
    res.redirect('/')

  }
})

module.exports = router;