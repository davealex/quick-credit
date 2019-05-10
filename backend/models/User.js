const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  id: { type: Number, required: true },
  email: { type: String, required: true, max: 100 },
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  address: { type: String, required: true, max: 100 },
  status: { type: String, required: true, max: 10 },
  isAdmin: { type: Boolean, required: true, max: 100 },
});


// Export the model
module.exports = mongoose.model('User', UserSchema);
