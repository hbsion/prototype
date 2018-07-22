export default function getRoomId(playerId1, playerId2) {
  return playerId1 < playerId2 ?
    playerId1 + '_' + playerId2 :
    playerId2 + '_' + playerId1
}
