const route = require("express").Router()

route.get("/", async (req, res) => {

  res.send("N word")
})

module.exports = route