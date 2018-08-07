

export default ({startedAt, finishedAt, declinedAt, cancelledAt}) => {
  if(cancelledAt) return 'cancelled'
  if(finishedAt)  return 'finished'
  if(startedAt)   return 'started'
  if(declinedAt)  return 'declined'
  return 'waiting'
}
