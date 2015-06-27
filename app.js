'use strict';

var fs = require('fs');
var express = require('express');
var path = require('path');
var jade = require('jade');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//-------Routes Director--------------
var routes = require('./routes/index');
var users = require('./routes/users');
//-----------SendGrid------------------
var sendgrid  = require('sendgrid')('davidyu37', 'dire821silo949');

//Starting express
var app = express();

//load email tempalte
var hogan = require('hogan.js');
var template = fs.readFileSync('./views/mailer/invoice.hjs', 'utf-8');
var compiledTemplate = hogan.compile(template);


//view engine setup, choose the way express render view
app.engine('html', require('hogan-express'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//place favicon from public
app.use(favicon(__dirname + '/public/favicon.ico'));
//use the middleware for express
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//connect the routes to express
app.use('/', routes);
app.use('/users', users);

//process the user's post
app.post('/inquiry', function (req, res) {
  var mailContent = {
    //to: 'yount.insert@msa.hinet.net',
    to: 'davidyu37@gmail.com',
    fromname: req.body.name,
    from: req.body.email,
    subject: 'Inquiry',
    html: compiledTemplate.render({
      name: req.body.name, companyName: req.body.companyName, email: req.body.email, message: req.body.message,
      item1: req.body.ITEM_1, quan1: req.body.ANN_1, quanlot1: req.body.QTY_1, price1: req.body.US_1, 
      item2: req.body.ITEM_2, quan2: req.body.ANN_2, quanlot2: req.body.QTY_2, price2: req.body.US_2,
      item3: req.body.ITEM_3, quan3: req.body.ANN_3, quanlot3: req.body.QTY_3, price3: req.body.US_3,
      item4: req.body.ITEM_4, quan4: req.body.ANN_4, quanlot4: req.body.QTY_4, price4: req.body.US_4,
      item5: req.body.ITEM_5, quan5: req.body.ANN_5, quanlot5: req.body.QTY_5, price5: req.body.US_5
    })
  };

  //invoke sendgrid's send method
  sendgrid.send(mailContent, function(err, json) {
    if (err) { return res.send('No!'+err); }
    res.render('inquiry', function(err, html) {
      //res.send('<script>alert("資料送出")</script>');
      res.send(html);
    });
  });

});
module.exports = app;

app.listen(3000);
//The end------------------------

