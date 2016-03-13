var express = require('express');
var port = 8080;
var app = express();

require('./middleware.js')(app, express);

var server = app.listen(port);
console.log('Now listening on port: ' + port);

module.exports = server;