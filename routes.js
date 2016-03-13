var fs = require('fs');

module.exports = function(app) {
  data = [];

  app.post('/all', function(req, res){
    queryDB(function(data){
      var sorted;
      if(req.body.order === "ascending") {
        sorted = JSON.stringify(sortAll(data, 1, req.body.compare));
      } else {
        sorted = JSON.stringify(sortAll(data, -1, req.body.compare));
      }
      res.send(sorted);
    });
  });

  app.post('/user', function(req, res){
    queryDB(function(data){
      var userData = data.filter(function(item){
        if(item.userId === req.body.id){
          return true;
        }
      });
      res.send(userData);
    })
  });

  app.post('/single', function(req, res){
    queryDB(function(data){
      var postData = data.filter(function(item){
        if(item.id === req.body.id){
          return true;
        }
      });
      res.send(postData);
    })
  });

  app.post('/loc', function(req, res){
    queryDB(function(data){
      var inputs = {
        lat: parseInt(req.body.lat),
        lon: parseInt(req.body.lon),
        dist: parseInt(req.body.dist)
      }
      var postData = data.filter(function(item){
        var coord = {
          lat: item.loc[0],
          lon: item.loc[1]
        };
        if(calculateDistance(inputs, coord) < req.body.dist){
          return true;
        }
      });
      res.send(postData);
    })
  });
}

function sortAll(data, order, compare){
    return data.sort(function(a,b){
      if(compare === 'createdAt'){
        a = new Date(a[compare]);
        b = new Date(b[compare]);
      } else {
        a = a[compare];
        b = b[compare];
      }
      if(a > b) {
        return order;
      } else if (a < b) {
        return (order*-1);
      }
      return 0;
    });
}

function queryDB(cb){
 fs.readFile('./data.json', 'utf-8', function(err, data){
    if(err){
      console.log(err);
    }

    var json = BSONConvert(data);
    var array = JSON.parse(json);

    cb(array);

  });
};

function BSONConvert (BSON) {
  var isoRegex = /ISODate\((".+?")\)/g;
  return BSON.replace(isoRegex, function(match, parenGroup){
    return parenGroup;
  });
};

function calculateDistance (coord1, coord2){
  var deg2rad = function(deg){
    return deg*(Math.PI/180);
  };
  var r = 3959;
  var dLat = deg2rad(coord2.lat-coord1.lat);
  var dLon = deg2rad(coord2.lon-coord1.lon);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = r * c;
  return d;
}