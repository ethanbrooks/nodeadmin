var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var sock = require('socket.io');
var morgan = require('morgan');
var fs = require('fs');
var secret = 'Heyo Taytay';

fs.readFile('./secret.js', function(err, data){
  if (err.code === 'ENOENT') {
    var secret = 'randomly generated string';
    var data = "module.exports = '" + secret + "';";
    fs.writeFileSync(__dirname + '/secret.js', data);
  }
});
// var secret = require('./secret.js');




//NodeAdmin Routers\\
var auth = require('./auth/authRoutes.js');
var database = require('./database/databaseRoutes.js');
var settings = require('./settings/settingsRoutes.js');
var system = require('./system/systemRoutes.js');
var home = require('./home/homeRoutes.js');

module.exports = function nodeadmin(app, port) {
  'use strict';

  //Socket Connection\\
  var server = http.createServer(app);
  var io = sock(server);

  var expressListen = app.listen;
  app.listen = server.listen.bind(server);
  // server.listen(port || 8000);

  //Socket Controller\\
  require('./sockets/socketController.js')(io);

  //Logs\\
  var accessLogStream = fs.createWriteStream(__dirname + '/serverLogs/access.log', {flags: 'a'});
  // app.use(morgan('combined', {
  //   stream:accessLogStream
  // }));
    
  //Third party middleware\\
  app.use(morgan('dev', {
    stream:accessLogStream
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use('/nodeadmin', express.static(__dirname + '/public'));
  app.locals.secret = secret;
  
  //Routes\\
  app.use('/nodeadmin/api/auth', auth);
  app.use('/nodeadmin/api/db', database);
  app.use('/nodeadmin/api/settings',settings);
  app.use('/nodeadmin/api/system',system);
  app.use('/nodeadmin/api/home',home);
  app.use('/nodeadmin/', function(req,res){
    res.send('hello');
  });

  //Middleware\\
  return function nodeadmin(req,res,next) {
    next();
  };


};
