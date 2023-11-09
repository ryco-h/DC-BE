const mongoose = require('mongoose')

const ChatCollectionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  tags: Array,
  datetime: Date
})

exports.ChatCollection = mongoose.model('chat_collection', ChatCollectionSchema)