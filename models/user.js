const mongoose = require('mongoose')

const UserCollectionSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String
})

exports.UserCollection = mongoose.model('userCollection', UserCollectionSchema)