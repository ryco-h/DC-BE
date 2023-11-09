const mongoose = require('mongoose')

const UserCollectionSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String,
  listServer: Array
})

exports.UserCollection = mongoose.model('user_collection', UserCollectionSchema)