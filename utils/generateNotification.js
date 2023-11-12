const { NotificationCollection } = require("../models/notification")

async function generateNotification({ sender, user, title, message, status }) {

  const notification = await NotificationCollection.create({
    sender,
    user,
    title,
    message,
    status: status || null,
    datetime: new Date(),
    isRead: false
  })

  return notification.id
}

module.exports = generateNotification