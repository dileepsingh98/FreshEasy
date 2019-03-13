var mongoose = require('mongoose');
var schema = mongoose.Schema;

var todoSchema = new schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  _creatorcustom:{
    type: Object,
    required: true
  }

}, { toJSON: { virtuals: true } })


todoSchema.virtual('userList', {
  ref: 'User',
  localField: '_creatorcustom',
  foreignField: 'alternativeId',
  justOne: false
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = {Todo};
