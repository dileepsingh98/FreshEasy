"use strict";

const {
  Schema
} = require('mongoose');

const {
    setOptions
  } = require('./../middleware/mongoose.middleware');

const validator = require('validator');

var UserSchema = new Schema({
    name:{
      type: String,
      maxlength: 150,
      default:''
    },
    email: {
      type: String,
      unique: [true, 'There’s already an account with this email. Please sign in'],
      required: [true, 'User email required'],
      trim: true,
      minlength: 1,
      lowercase:true,
      default:'',
       validate: {
         validator: validator.isEmail,
         message: '{VALUE} is not a valid email'
      }
    },
    avatar:{
      type: String,
      default:''
    },
   password: {
      type: String,
      required: [true, 'Please enter the password'],
      minlength: 6
    },
    country_code:{
      type: String,
      required: [true, 'Please select the country code'],
      minlength: 1,
    },
    mobile_no:{
      type: String,
      unique: [true, 'There’s already an account with this number. Please sign in'],
      required: [true, 'Please enter the mobile number'],
      length: { min: 10, max: 10 }
    },
    otp:{
      type: String,
      default:''
    },
    is_mobile_verify:{
      type: Number,
      enum: [0, 1],
      default:0
    },
    is_delete:{
      type: Number,
      enum: [0, 1],
      default:0
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
  },{
    timestamps: true
  });
  

  module.exports = UserSchema;