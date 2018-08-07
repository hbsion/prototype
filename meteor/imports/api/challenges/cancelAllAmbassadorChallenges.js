import {Challenges} from './Challenges'

export default (ambassador) => {
  Challenges.update({
    state: {$in: ['waiting', 'started']},
    players: {
      $elemMatch: {
        userId:  ambassador._id,
        role:    'unmoving',
        subrole: 'ambassador'
      }
    }
  }, {
    $set: {
      cancelledAt: new Date()
    }
  })
}
