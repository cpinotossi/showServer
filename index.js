exports.start = function(port, isHttps){
  /**
   * Module dependencies.
   */
  const express = require('express')
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
  const app = express()

  //GET Request Handler
  app.get('/*', (req, res) => {
    var url = JSON.stringify(req.url, null, 4);
    var headers = JSON.stringify(req.headers, null, 4);
    var response = url+"\n"+headers;
    console.log(response)
    res.send(response);
  })

  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  //POST Request Handler
  app.post('/*', upload.array(), (req, res, next) => {
      var url = JSON.stringify(req.url, null, 4);
      var headers = JSON.stringify(req.headers, null, 4);
      var body = JSON.stringify(req.body, null, 4);
      var response = url+"\n"+headers+"\n"+body;
      console.log(response)
      res.send(response);
  });

  if(isHttps){
    //Https support
    //read keys from filesystem for https
    var fs = require('fs');
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
