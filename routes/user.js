const { NotificationCollection } = require("../models/notification")
const { UserCollection } = require("../models/user")
const generateNotification = require("../utils/generateNotification")

const route = require("express").Router()

route.get("/notifications/get/:id", async (req, res) => {

  const user = await UserCollection.findOne({_id: req.params.id}).populate("notifications")

  const notifications = user.notifications

  if(!user) {
    return res.send({
      status: "error",
      message: "User not found"
    })
  }

  return res.send({
    status: "success",
    data: notifications
  })
})

route.post("/invite/t/:username", async (req, res) => {

  const user = await UserCollection.findOne(
    {username: req.params.username}
  )

  const sender = await UserCollection.findOne(
    {_id: req.body.sender}
  )

  if(!user) {
    req.io.to(sender.id).emit("invitation", {
      status: "error",
      type: "onInviteFailure",
      message: "Please check user's ID"
    })

    return res.send({
      status: "success",
      message: "Operation was succeded."
    })
  }

  if(user.invitationList.includes(sender.id)) {
    req.io.to(sender.id).emit("invitation", {
      status: "info",
      type: "onInviteSuccess",
      message: "Your invitation has been sent, please wait patiently"
    })

    return res.send({
      status: "success",
      message: "Operation was succeded."
    })
  }

  const userToInvite = await UserCollection.findOneAndUpdate(
    {username: req.params.username},
    {
      $push: {
        invitationList: sender.id
      }
    },
    {
      new: true
    }
  )

  if(userToInvite) {

    await UserCollection.findOneAndUpdate(
      {_id: user.id},
      {
        $push: {
          notifications: await generateNotification({
            sender: sender.id,
            user: user.id,
            title: "Invitation",
            message: `${sender.username} sent you a friend requet`,
            status: null
          })
        }
      }
    )

    await UserCollection.findOneAndUpdate(
      {_id: sender.id},
      {
        $push: {
          notifications: await generateNotification({
            sender: sender.id,
            user: user.id,
            title: "Invitation",
            message: `Your invitation was successfully sent`,
            status: null
          })
        }
      }
    )

    req.io.to(sender.id).emit("invitation", {
      status: "success",
      type: "onInviteSuccess",
      message: "Your invitation was successfully sent"
    })

    req.io.to(user.id).emit("invitation", {
      status: "info",
      type: "onInviteSuccess",
      message: "You have a new invitation"
    })
  }

  return res.send({
    status: "success",
    message: "Operation was succeded."
  })
})

route.post('/invite/accept', async (req, res) => {

  const user = await UserCollection.findOne({_id: req.body.user})
  const sender = await UserCollection.findOne({_id: req.body.sender})

  if(!user || !sender) {
    return res.send({
      status: "error",
      message: "User not found"
    })
  }

  await UserCollection.findOneAndUpdate(
    {_id: user.id},
    {
      $push: {
        friendList: sender.id
      },
      $pull: {
        invitationList: sender.id
      }
    }
  )

  await UserCollection.findOneAndUpdate(
    {_id: sender.id},
    {
      $push: {
        notifications: await generateNotification({
          sender: sender.id,
          user: user.id,
          title: "Invitation",
          message: `${user.username} accepted your friend request`,
          status: null
        }),
        friendList: user.id
      }
    }
  )

  req.io.to(sender.id).emit("invitation", {
    type: "onInviteAcceptedByuser",
    status: "info",
    message: `${user.username} accepted your friend request`
  })

  return res.send({
    status: "success",
    message: "Operation was succeded."
  })
})

module.exports = route