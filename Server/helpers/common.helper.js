const crypto = require("crypto");
const moment = require('moment');
const _ = require("lodash");
/**
 * Common Helper
 * ---
 */
module.exports = {

  /**
   * Six digit random OTP number
   */
  otp: () => Math.floor(100000 + Math.random() * 900000),

  /**
   * Check if values are identical
   * @param val1
   * @param val2
   *
   * @returns {Boolean} true/false
   */

  isIdentical: (val1, val2) => val1 === val2,

  /**
   * dynamic skip and limt according to the page
   */
  skipAndLimit: (page) => {
    //console.log(page);
    
    if (!page) page = 1;
    return {
      skip: (page - 1) * 100,
      limit: +process.env.DATALIMIT || 100
    }
  },

  img: (image) => {
    if(!image) return "";
    if (typeof image === "string") {
      return `${process.env.S3_IMAGE_URL}${image}`;
    }else{
      return _.map(image, el=>{
        return `${process.env.S3_IMAGE_URL}${el}`;
      });
    }
  },

  enc: (val, key) => {
    var cipher = crypto.createCipher('aes-256-ctr', key);
    return cipher.update(val.toString(), 'utf8', 'hex') + cipher.final('hex');
  },

  dec: (enc, key) => {
    var cipher = crypto.createDecipher('aes-256-ctr', key);
    return cipher.update(enc, 'hex', 'utf8') + cipher.final('utf8');
  },

  dateFormat: (timeString) => {
    if(timeString == null){
      return '';
    }else{
      return moment(timeString).format("hh:mm a, DD-MM-YYYY")
    }
    
  },
  date: (timeString) => {
    let date = moment(timeString).format("DD-MM-YYYY");
    if (date == moment().format("DD-MM-YYYY")) {
      return "Today";
    }  
    return date;
  },

  paddzero : (number) => {
    length = 6;
    let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  },
  escapeRegex: (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  },
  array_diff:(a1, a2)=>{
    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
  }

}
