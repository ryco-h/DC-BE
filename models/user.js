const mongoose = require('mongoose')

const UserCollectionSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String,
  serverList: Array,
  friendList: Array,
  invitationList: Array,
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'notification' 
    }
  ]
})

exports.UserCollection = mongoose.model('user_collection', UserCollectionSchema)