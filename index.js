const express = require("express")
const http = require("http")
require("dotenv/config")

const mongoose = require('mongoose')
const app = express()

const port = process.env.PORT
const morgan = require('morgan')
const cors = require('cors');

const httpServer = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    origin: ["http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
}); 

mongoose.connect(process.env.DB_URL, {
  dbName: process.env.DB_NAME
})
.then(() => {
  console.log('Database is ready...')
})
.catch(error => {
  console.log(error)
})

io.on('connection', (socket) => {
  // console.log('A client is connected');
  socket.send("Welcome to TransChat")
  
  socket.on("registerRoom", (client) => {
    const room = io.sockets.adapter.rooms.get(client.id);

    if (room === undefined || room === null && room.size === 0) {
      socket.join(client.id)
      console.log("Registering room: " + client.id)
    } 
  })
});

// Middleware
app.use(function(req, res, next){
  req.io = io;
  res.header("Access-Control-Allow-Origin", ["http://127.0.0.1:5173"]);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

const corsOption = {
  origin: '*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(cors(corsOption));
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const mainRoute = require("./routes/main")
app.use("/main", mainRoute)

const authRoute = require("./routes/auth")
app.use("/auth", authRoute)

const userRoute = require("./routes/user")
app.use("/user", userRoute)

httpServer.listen(port || 5000, () => {
  console.log('Server is listening at port ' + (port || 5000))
})