import venuesCache   from '/modules/cache/venues'
import overpass      from './overpass'

export default async function getCityVenues(cityName) {
  console.log(cityName)
  const TIMEOUT = 25
  const TYPES = ['node', 'way', 'relation']
  const amenities = ['pub', 'bar', 'cafe', 'restaurant', 'fast_food', ]
  const queryStart = `[out:json][timeout:${TIMEOUT}];area[name="${cityName}"]["boundary"="administrative"];area._(if:t["admin_level"] == _.max(t["admin_level"]))->.s;(`
  const queryMain = []
  TYPES.map(type => amenities.map(amenity => {
    queryMain.push(`${type}["amenity"="${amenity}"](area.s)`)
  }))
  TYPES.map(type => {
    queryMain.push(`${type}["shop"](area.s)`)
  })
  const queryEnd = ';);out geom;'
  const query = queryStart + queryMain.join(';') + queryEnd
  const cacheItemName = `${cityName}-${query.length}`

  //await venuesCache.removeItem(cacheItemName)

  let venues = await venuesCache.getItem(cacheItemName)
  if(!venues || (venues.loading && venues.timeout && Date.now() > venues.timeout)) {
    await venuesCache.setItem(cacheItemName, {loading: true, data: {}, timeout: Date.now() + (TIMEOUT + 5) * 1000})
    const data = await (await overpass(query)).json()
    await venuesCache.setItem(cacheItemName, {loading: false, data})
  }
  venues = await venuesCache.getItem(cacheItemName)
  if(venues.loading) return
  return venues.data
}
