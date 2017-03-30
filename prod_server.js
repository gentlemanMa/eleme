var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function (req, res, next) {
	req.url = '/index.html';
	next();
});

app.use(router);

var appData=require('./data.json');
var seller=appData.seller;
var goods=appData.goods;
var ratings=appData.ratings;

var apiRoures=express.Router();
apiRoures.get("/seller",function(req,res) {
  res.json({
    errno:0,
    data:seller
  });
})
apiRoures.get("/goods",function(req,res) {
  res.json({
    errno:0,
    data:goods
  });
})
apiRoures.get("/ratings",function(req,res) {
  res.json({
    errno:0,
    data:ratings
  });
})
app.use('/api', apiRoures);

app.use(express.static('./dist'));

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  // when env is testing, don't need open it
  // if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
  //  opn(uri)
  // }
})
