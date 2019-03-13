const {
  model
} = require('mongoose');

const UserSchema = require('./../db/user.schema');


const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {
  common
} = require('./../helpers/common.helper');


UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id','name','email','avatar','mobile_no','is_mobile_verify','otp']);
};

/********Save User OTP**********/
UserSchema.methods.saveOtp = function(){
  var user = this;
  var newOtp = Math.floor(1000 + Math.random() * 9000);
  user.otp = newOtp;
  return user.save().then(() => {
    /************Send otp on mobile numbr **************/
     return newOtp;
  });
}

/*********Generate authenticate key*************/
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
   
  user.tokens = user.tokens.concat([{access, token}]);
  

  return user.save().then(() => {
     return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var User = this;
  return User.update({
    $pull: {
      tokens: {token}
    }
  });
};

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;
  try{
      decoded = jwt.verify(token,process.env.JWT_SECRET);
  }catch(e){
    return Promise.reject();
  }

  return User.findOne({
    '_id':decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  });

}

UserSchema.statics.findByCredentials = function (mobile_no, password) {
  var User = this;

  return User.findOne({mobile_no}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          if(user.is_mobile_verify == 0){
            /*********Send verify Otp****************/
          }
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.updatePasswordHash = function (password) {
  var user = this;
  user.password = password;
  return user.save().then(() => {
     return password;
  });
}



const User = model('User', UserSchema);

module.exports = {User}
