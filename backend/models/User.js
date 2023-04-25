const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  chatData: [{
    domain: String,
    chats: [{
        question: String,
        response: String
    }]
  }]
});

module.exports = User = mongoose.model("users", UserSchema);
