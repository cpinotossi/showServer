#!/usr/bin/env node
var showServer = require('./index');
var port = process.env.PORT || 8080;
//Will serve via http
showServer.start(port,false);
