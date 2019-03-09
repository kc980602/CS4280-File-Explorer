var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var fe = require('./util/fe')
// Enable command line
var readline = require('./util/readline')

var indexRouter = require('./routes/index');

var app = express();
var router = express.Router();

// init share folder
fe.init()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

app.use('/', indexRouter);

app.use(function (ex, req, res, next) {
    if (!ex)
        return next()
    let status = 500
    let code = '500'
    let message = 'Server Error'
    if (Number.isInteger(ex.code)) status = ex.code
    if (Number.isInteger(ex.status_code)) status = ex.status_code
    if (ex.code !== undefined) code = ex.code.toString()
    if (ex.message !== undefined) message = ex.message

    console.error(ex)
    res.status(status)
    res.json({'code': code, 'message': message, 'data': ex.data})
})

app.get('/fe', function(req,res){
    res.sendfile(__dirname + '/public/fe.html');
});

module.exports = app;
