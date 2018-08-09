import citiesCache   from '/modules/cache/cities'
import overpass      from './overpass'

export default async (bbox) => {
  console.log("getCities", bbox)
  //await citiesCache.clearAll()
  const bboxes = (
    Object.entries(await citiesCache.getAll()) || []
  ).filter(([key]) => key.indexOf('cities') === 0)
    .map(([key, value]) => value)
  console.log("bboxes", bboxes)
  const bboxesCache = bboxes.filter(({value: {bbox: {s, w, n, e}}}) => {
    const height = Math.abs(bbox.n - bbox.s)
    const width = Math.abs(bbox.e - bbox.w)
    const exceedingHeight = Math.min(height, Math.max(0, s - bbox.s) + Math.max(0, bbox.n - n))
    const exceedingWidth = Math.min(width, Math.max(0, w - bbox.w) + Math.max(0, bbox.e - e))
    const area = height * width
    const out = (
      exceedingWidth * height +
      exceedingHeight * width +
      exceedingWidth * exceedingHeight
    )
    console.log(out / area, out, area)
    return out / area < 0.1
  })
  console.log("cities cache found", bboxesCache.length)
  if(bboxesCache.length) {
    console.log(bboxesCache)
    const {s, w, n, e} = bboxesCache[0].value.bbox
    citiesCache.refreshLRU(cacheKey({s, w, n, e}))
    if(bboxesCache[0].value.loading) return null
    return bboxesCache[0].value.cities
  }
  const s = bbox.s - 0.02
  const w = bbox.w - 0.02
  const n = bbox.n + 0.02
  const e = bbox.e + 0.02
  const bboxCache = {bbox: {s, w, n, e}, loading: true}
  await citiesCache.setItem(cacheKey({s, w, n, e}), bboxCache)
  const TIMEOUT = 25
  const out = '[out:csv(::"type",::"id", name, "place", ::"lon", ::"lat")]'
  const queryStart = `${out}[timeout:${TIMEOUT}][bbox:${s},${w},${n},${e}];(`
  const queryMain = ['city', 'town', 'village'].map(t => `node["place"="${t}"]`)
  const queryEnd = ';);out geom;'
  const query = queryStart + queryMain.join(';') + queryEnd
  const data = await (await overpass(query)).text()
  const lines = data.split('\n')
  bboxCache.cities = lines.slice(1).map(line => {
    const [type, id, name, place, lon, lat] = line.split('\t')
    return {type, id, name, place, lon, lat}
  }).filter(l => l.type)
  bboxCache.loading = false
  //citiesCache.bboxes.push(bboxCache)
  await citiesCache.setItem(cacheKey({s, w, n, e}), bboxCache)
  return bboxCache.cities
}

const cacheKey = ({s, w, n, e}) => `cities-${s}-${w}-${n}-${e}`
