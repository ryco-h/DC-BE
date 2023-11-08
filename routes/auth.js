const { UserCollection } = require("../models/user")

const route = require("express").Router()

route.post("/register", async (req, res) => {

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

  if(userLogin.password === req.body.password) {
    userLogin.token = generateRandomToken()
    await userLogin.save()

    console.log(req.io)

    req.io.sockets.emit(
      'login',
      {
        message: `Someone has logged in!`,
        content: userLogin.username
      }
   );

    res.send({
      status: "success",
      message: "Login was successful",
      token: userLogin.token
    })
  } else {
    res.send({
      status: "failed",
      message: "Login was failed"
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