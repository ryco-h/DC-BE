const mongoose = require('mongoose')

const ServerCollectionSchema = new mongoose.Schema({
  serverName: String,
  listChat: Array,
  serverList: Array
})

exports.ServerCollection = mongoose.model('server_collection', ServerCollectionSchema)