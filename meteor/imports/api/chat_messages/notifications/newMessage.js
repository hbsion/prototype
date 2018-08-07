import sendToUsers from '/imports/modules/pushNotif/sendToUsers'

export default ({query}) => {
  const response = sendToUsers({
    query,
    body:    `Un message en attente`,
    groupBy: 'chat',
    title:   'Nouveau message',
    type:    'chatMessage',
  })
}
