const mongoose = require('mongoose')

const NotificationCollectionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user_collection'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user_collection'
  },
  title: String,
  message: String,
  status: String,
  datetime: Date,
  isRead: Boolean
})

exports.NotificationCollection = mongoose.model('notification', NotificationCollectionSchema)