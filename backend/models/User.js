const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student',
  },
  facultyId: {
    type: String,
    // This makes facultyId required only if the role is 'teacher'
    required: function () {
      return this.role === 'teacher';
    },
  },
});

module.exports = mongoose.model('User', UserSchema);