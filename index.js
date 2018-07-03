exports.start = function(port, isHttps){
  /**
   * Module dependencies.
   */
  const resize = require('./resize');
  const express = require('express');
  const serveStatic = require('serve-static')
  const path = require('path');
  const fs = require('fs');
  var defaultTTL = "300";
  var bodyParser = require('body-parser');
  var multer = require('multer'); // v1.0.5


  //Verify if we need to support Https
  if (isHttps === undefined) {
    isHttps = false;
  } else if(typeof(isHttps) !== "boolean"){
    isHttps = false;
  }
  //Define port
  if (port === undefined) {
    port = 80;
  }

  //instantiate multer object
  var upload = multer(); // for parsing multipart/form-data
  //instantiate an express object
  const app = express();

  var staticOptions = {
    dotfiles: 'ignore',
    etag: true,
    index: false,
    lastModified: true,
    maxAge: '2h',
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }

  //app.use(express.static(__dirname + '/public', staticOptions));
  app.use(serveStatic(path.join(__dirname, 'public'), staticOptions));

  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
  }

  //GET Image Request Handler
  app.get('/images/jpeg/*', (req, res) => {
    var url = JSON.stringify(req.url, null, 4);
    var headers = JSON.stringify(req.headers, null, 4);
    var requestDetails = url+"\n"+headers;
    console.log(requestDetails)
    if(req.get("if-modified-since")){
      res.status(304).send();
    }else{
      var imagePathArray = req.path.split("/").filter(function (part) { return !!part; });//filter first empty entry.
      var imageFormat = imagePathArray[1];
      var imageFileName = imagePathArray[(imagePathArray.length-1)]; //extract last url path component
      var imageWidth = parseInt(imagePathArray[2]);//extract first path component
      var imageHight = parseInt(imagePathArray[3]);//extract second path component
      var imageFolderPath = ".images/"
      var imageLocal = `./images/${imageFileName}`;
      res.type(`image/${imageFormat}`);
      // Get the resized image
      const fs = require('fs');
      const readStream = fs.createReadStream(imageLocal);
      resize(readStream, imageWidth, imageHight).pipe(res.set('Last-Modified', 'Thu, 07 Jun 2018 17:16:20 GMT'));
      readStream.on('error', function(){
        res.status(404);
        res.type('image/jpeg');
        res.sendFile(path.resolve('public/sorry.jpg'));
      });

    }
  })

  // Serve Test Image.
  app.use('/bk_1.jpg', express.static(__dirname + '/public'));


  //GET Request Handler
  app.get('/cc*', async function(req, res){
    var url = JSON.stringify(req.url, null, 4);
    var headers = JSON.stringify(req.headers, null, 4);
    var requestDetails = url+"\n"+headers;
    console.log("Request Header:"+requestDetails);
    res.setHeader('Last-Modified', 'Thu, 07 Jun 2018 17:16:20 GMT');

    if(req.query.ccttl !== undefined){
      if(req.query.ccim !== undefined){
          res.setHeader('Cache-Control', `max-age=${req.query.ccttl}, immutable`);
      } else {
        res.setHeader('Cache-Control', `max-age=${req.query.ccttl}`);
      }
    } else {
      if(req.query.ccim !== undefined){
          //Use default value of 300sec
          res.setHeader('Cache-Control', `max-age=${defaultTTL}, immutable`);
      } else {
        //do not send Cache-Control Header
      }
    }

    if(req.query.ecttl !== undefined){
      if(req.query.ecim !== undefined){
          res.setHeader('Edge-Control', `max-age=${req.query.ecttl}, immutable`);
      } else {
        res.setHeader('Edge-Control', `max-age=${req.query.ecttl}`);
      }
    } else {
      if(req.query.ecim !== undefined){
          //Use default value of 300sec
          res.setHeader('Edge-Control', `max-age=${defaultTTL}, immutable`);
      } else {
        //do not send Cache-Control Header
      }
    }

    console.log("Response Header:"+JSON.stringify(res.header()._headers, null, 4))
    res.send(requestDetails+"\n"+JSON.stringify(res.header()._headers, null, 4));
  })

  //GET Request Handler
  app.get('/*', (req, res) => {
    var url = JSON.stringify(req.url, null, 4);
    var headers = JSON.stringify(req.headers, null, 4);
    var requestDetails = url+"\n"+headers;
    console.log("Request Header:"+requestDetails);
    console.log("Response Header:"+JSON.stringify(res.header()._headers, null, 4))
    res.send(requestDetails+"\n"+JSON.stringify(res.header()._headers, null, 4));
  })


  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  //POST Request Handler
  app.post('/*', upload.array(), (req, res, next) => {
      var url = JSON.stringify(req.url, null, 4);
      var headers = JSON.stringify(req.headers, null, 4);
      var body = JSON.stringify(req.body, null, 4);
      var requestDetails = url+"\n"+headers+"\n"+body;
      console.log(requestDetails);
      res.send(response);
  });

  if(isHttps){
    //Https support
    //read keys from filesystem for https
    var privateKey  = fs.readFileSync(__dirname + '/key.pem', 'utf8');
    var certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
    var credentials = {key: privateKey, cert: certificate};
    var https = require('https');
    var server = https.createServer(credentials, app);
  }else{
    //Http support
    var http = require("http");
    var server = http.createServer(app);
  }
  //Start Server
  server.listen(port);
};
