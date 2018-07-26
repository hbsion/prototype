const {uri, username, password} = Meteor.settings.landingPageDdp

let ddpConnection

export default () => {
  if(ddpConnection) return ddpConnection
  ddpConnection = DDP.connect(uri)
  DDP.onReconnect(connection => {
    connection.call('login', {user: {username}, password}, (err, res) => {
      //console.log(err)
      //console.log(res)
    })
  })
}
