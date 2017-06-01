var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var path = require('path');
var passport = require('passport');

var app = express();
var port = process.env.PORT || 5698;

var social = require('./app/passport/passport')(app, passport);
var appRoutes = require('./app/routes/api')(router);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname+'/public'));
app.use('/api', appRoutes);

// Connecting dbs
mongoose.connect('mongodb://localhost/meanfull', function(err){
    if(err){
        console.log('error in connecting database');
        throw err;
    }else{
        console.log('Database connected successfully');
    }
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
})

app.get('*', function(req, res){
    // res.redirect('/');
    // res.sendFile(path.join(__dirname+'/public/app/views/pages/404.html'));
    res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
})

app.listen(port, function(err){
    if(err){
        console.log('error occuring in server');
        throw err;        
    }else{
        console.log('Server is running at port number: '+port);
    }
})