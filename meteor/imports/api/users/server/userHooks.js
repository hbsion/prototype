import {Meteor}  from 'meteor/meteor'

const creationfunList = {}
const changeFunList = {}


Meteor.users.find(
  {
    createdAt: {$gt: new Date()}
  },
  {
    //disableOplog: true,
    //pollingIntervalMs: 10000,
  }
)
.observeChanges({
  added(_id) {
    const user = Meteor.users.findOne(_id)
    console.log(_id, user)
    Object.keys(creationfunList)
    .map(name => {
      creationfunList[name](_id, user)
    })
  },
  changed(_id, user) {
    console.log("user changed", user)
    const {profile} = user
    if(!profile) return
    console.log(profile)
    Object.keys(changeFunList)
    .map(name => {
      changeFunList[name](_id, user)
    })
  }
})


export function onUserCreate(name, fun) {
  creationfunList[name] = fun
}

export function onUserChange(name, fun) {
  changeFunList[name] = fun
}