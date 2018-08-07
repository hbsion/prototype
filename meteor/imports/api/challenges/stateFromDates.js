

export default ({startedAt, finishedAt, cancelledAt}) => {
  if(cancelledAt) return 'cancelled'
  if(finishedAt)  return 'finished'
  if(startedAt)   return 'started'
  return 'waiting'
}
