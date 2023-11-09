const { UserCollection } = require("../models/user")

const route = require("express").Router()

route.post("/register", async (req, res) => {

  const userLogin = await UserCollection.findOne({username: req.body.username})

  if(userLogin) {
    return res.send({
      status: "success",
      title: "Register was failed",
      message: "Your username is already registered",
    })
  }

  const user = await UserCollection.create({
    username: req.body.username,
    password: req.body.password,
    token: null
  })

  await user.save()

  res.status(200).send({
    status: "success",
    message: "Successfully registering account",
    account: user
  })
})

route.post("/login", async (req, res) => {
  
  const userLogin = await UserCollection.findOne({username: req.body.username})
  
  if(!userLogin) {
    return res.send({
      status: "failed",
      title: "Failed to login",
      message: "Username or password incorrect",
    })
  } else if (userLogin.password === req.body.password) {
    userLogin.token = generateRandomToken()
    await userLogin.save()

    req.io.sockets.emit(
      'login',
      {
        message: `Someone has logged in!`,
        content: userLogin.username
      }
    );

    return res.send({
      status: "success",
      title: "Login was successful",
      message: "Welcome to TransChat",
      token: userLogin.token
    })
  }
})

module.exports = route

function generateRandomToken() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Define the character set for the token
  let token = "";
  
  for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      token += charset.charAt(randomIndex);
  }
  
  return token;
}