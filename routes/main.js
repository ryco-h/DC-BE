const route = require("express").Router()

route.get("/", async (req, res) => {

  res.io.sockets.emit("home", {
    message: "Connected to home"
  })
})

module.exports = route