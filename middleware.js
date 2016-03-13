var fs = require('fs');
var bodyParser = require('body-parser');
var morgan = require('morgan');

module.exports = function(app, express){

  var router = express.Router();
  require('./routes.js')(router);
  app.use(express.static(__dirname + '/public'));
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use('/', router);

}

