const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const connection = require('./lib/db')

// Table creation
connection.query(`
CREATE TABLE IF NOT EXISTS simpleapp (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    favorite_color VARCHAR(100) NOT NULL,
    cats_or_dogs VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE(name)
);
`, (err, result)=>{
  if(err)
  console.error(err);
})

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '123456cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000}
}))

app.use(flash());
app.use(expressValidator());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

let port = process.env.PORT;
let host = process.env.HOST;
app.listen(host,port);

module.exports = app;
