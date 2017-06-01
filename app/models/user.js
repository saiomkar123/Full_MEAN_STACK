var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt= require('bcrypt-nodejs');
var titilize = require('mongoose-title-case');
var validate = require('mongoose-validator');


var nameValidator = [    
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Name must be atleast 3 characters, max 30 characters, no special characters, must have space in between the name'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Is not a valid e-mail'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contains Letters and Numbers only'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments:  /^(?=.*[a-z])(?=.*[A-Z])(?=.*?[\d])(?=.*?[\w]).{8,35}$/,
        message: 'Password needs to have at least one lowercase, one upper case, one number and one special character. The length of the password must be 8 to 30 characters'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];


// User mongoose schema
var UserSchema = new Schema({
    name: { type: String, required: true, validate: nameValidator },
    username: { type: String, lowercase: true, required: true, validate: usernameValidator },
    password: { type: String, required: true, validate: passwordValidator },
    email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidator },
    permission: {type: String, required: true, default: 'user'}
});


// Middleware to ensure password is encrypted before savin user to database
// Before Saving the json
UserSchema.pre('save', function(next){
    // Store hash in your password DB..
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash){
        if(err){
            console.log('error occured in password hash');
            return next(err);
        }
        user.password = hash;        
        next();
    })
})

// Mongoose Plugin to change fields to title case after saved to database 
UserSchema.plugin(titilize, {
    paths: [ 'name' ]
})

// Matched to comparepasswords in API (when user login)
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema);