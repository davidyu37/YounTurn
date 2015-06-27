var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/inquiry', function(req, res, next) {
	res.render('inquiry', { title: 'Inquiry'});
});

module.exports = router;
