var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var passport	= require('passport');
var User        = require('./app/models/user');
var config = require('./config/database');
var jwt         = require('jwt-simple');


var uristring ='mongodb://heroku_m659607v:kv8avo3fa54k1k8sdo3ckk6osi@ds229648.mlab.com:29648/heroku_m659607v';

var theport = process.env.PORT || 5000;

mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.get('/admin', function(request, response) {
  response.render('pages/index')
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.send('Hello! The API');
});
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();

// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
 if (!req.body.name || !req.body.password) {
   res.json({success: false, msg: 'Please pass name and password.'});
 } else {
   var newUser = new User({
     name: req.body.name,
     password: req.body.password
   });
   // save the user
   newUser.save(function(err) {
     if (err) {
       return res.json({success: false, msg: 'Username already exists.'});
     }
     res.json({success: true, msg: 'Successful created new user.'});
   });
 }
});

apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({
      name: req.body.name
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        res.send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.encode(user, config.secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });


// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, config.secret);

      User.findOne({
        name: decoded.name
      }, function(err, user) {
          if (err) throw err;

          if (!user) {
            return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
          } else {
            res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
          }
      });
    } else {
      return res.status(403).send({success: false, msg: 'No token provided.'});
    }
  });

  // route to a restricted info (GET http://localhost:8080/api/memberinfo)
  apiRoutes.post('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
      var token = getToken(req.headers);
      if (token) {
        var decoded = jwt.decode(token, config.secret);

        User.findOne({
          name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
              return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
              //res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});

            }
        });
      } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
      }
    });

  getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
// connect the api routes under /api/*
app.use('/api', apiRoutes);