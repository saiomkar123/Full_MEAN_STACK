// importing libraries and js files
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'sai_omkar';

module.exports = function(router){
    // For User Registration
    router.post('/register', function(req, res){
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        if(user.username == (null || "" || undefined) || user.username == (null || "" || undefined) || user.password == (null || "" || undefined) || user.email == (null || "" || undefined)){
            res.json({success: false, message: 'Ensure name,  username, email and password provided'});
        }else{
            user.save(function(err){
                if(err){
                    if(err.errors != null){
                        if(err.errors.name){
                            res.json({success: false, message: err.errors.name.message});
                        }else if(err.errors.email){
                            res.json({success: false, message: err.errors.email.message})
                        }else if(err.errors.username){
                            res.json({success: false, message: err.errors.username.message});
                        }else if(err.errors.password){
                            res.json({success: false, message: err.errors.password.message});
                        }else{
                            res.json({success: false, message: err})
                        }
                    }else if(err){
                        if(err.code == 11000){
                            if(err.errmsg[61] == 'u'){
                                res.json({success: false, message: 'Username already exist'});
                            }else if(err.errmsg[61] == 'e'){
                                res.json({success: false, message: 'Email already exist'});
                            }
                        }else{
                            res.json({success: false, message: err});
                        }
                    }                     
                }else{
                    res.json({success: true, message: 'user created successfully'});
                }
            });
        }    
    });

// Check Username
    router.post('/checkusername', function(req, res){
        User.findOne({username: req.body.username}).select('username').exec(function(err, user){
            if(err) throw err;
            if(user){
                res.json({success: false, message: 'That Username is already taken'});
            }else{
                res.json({success: true, message: 'Valid Username'});
            }
        })
    })
// Check Email
     router.post('/checkemail', function(req, res){
        User.findOne({email: req.body.email}).select('email').exec(function(err, user){
            if(err) throw err;
            if(user){
                res.json({success: false, message: 'That E-mail is already taken'});
            }else{
                res.json({success: true, message: 'Valid E-mail'});
            }
        })
    })

//    User login 
    router.post('/authenticate', function(req, res){
        if(!req.body.username){
            res.json({success: false, message: 'Username and Password is required'})
        }else{
            User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user){
                if(err) throw err;
                if(!user){
                    res.json({ success: false, message: 'Could not authenticate user'})
                }else if(user){
                    if(!req.body.password){
                        res.json({success: false, message: 'Password is required'});
                    }else{
                        var validPassword = user.comparePassword(req.body.password);
                        if(!validPassword){
                            res.json({success: false, message: 'Could not authenticate password'});
                        } else{
                            var token = jwt.sign({
                                            username: user.username,
                                            email: user.email
                                        }, secret, {expiresIn: '24h'});
                            // console.log(token);
                            res.json({success: true, message: 'User authenticated', token: token});
                        }
                    }
                }
            })
        }
    });
// Middle ware for token
    router.use(function(req, res, next){
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if(token){
            // verifying token
            jwt.verify(token, secret, function(err, decoded){
                if(err){
                    res.json({success: false, message: 'Token Invalid'})
                }else{
                    req.decoded = decoded;
                    next();
                }
            })
        }else{
            res.json({success: false, message: 'No token provided'});
        }
    })

    router.post('/me', function(req, res){
        res.send(req.decoded);
    })
    
    return router;
}