const express = require("express")
const http = require("http")
require("dotenv/config")

const port = process.env.PORT
const morgan = require('morgan')

const mongoose = require('mongoose')
const app = express()
const httpServer = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer);

const listClient = new Set()

io.on('connection', (socket) => {
  listClient.add(socket.handshake.address)
  socket.broadcast.emit("message", 'A client is connected');
  socket.send("Welcome to TransChat")
});

// Middleware
app.use(function(req, res, next){
  req.io = io;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const mainRoute = require("./routes/main")
app.use("/main", mainRoute)

const authRoute = require("./routes/auth")
app.use("/auth", authRoute)

mongoose.connect(process.env.DB_URL, {
  dbName: process.env.DB_NAME
})
.then(() => {
  console.log('Database is ready...')
})
.catch(error => {
  console.log(error)
})

httpServer.listen(port || 5000, () => {
  console.log('Server is listening at port ' + (port || 5000))
})