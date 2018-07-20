import { Cache }    from 'react-native-cache'

const promisify = (func, parent) => (...args) => new Promise((resolve, reject) => {
  func.bind(parent)(...args, function(err, res) {
    if(err) return reject(err)
    resolve(res)
  })
})

export default (args) => {
  const cache = new Cache(args)
  cache.setItem    = promisify(cache.setItem,    cache)
  cache.getItem    = promisify(cache.getItem,    cache)
  cache.removeItem = promisify(cache.removeItem, cache)
  cache.peekItem   = promisify(cache.peekItem,   cache)
  cache.getAll     = promisify(cache.getAll,     cache)
  cache.clearAll   = promisify(cache.clearAll,   cache)
  return cache
}
