export default (cities) => {
  const users = {
    "type": "FeatureCollection",
    "features": [].concat(
      ...cities.features.map(({properties: {name}, geometry: {coordinates: [lon, lat]}}) => {
        const length = Math.round(Math.random() * 100)
        if(name === 'Lyon') return []
        return Array.from({length}, (v, i) => i)
          .map(i => ({
            "type": "Feature",
            "properties": {
              "@id": name + i,
              "name": name + i,
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                parseFloat(lon) + (Math.random() - 0.5) / 100,
                parseFloat(lat) + (Math.random() - 0.5) / 70,
              ]
            },
            "id": name + i
          }))
      })
    )
  }
  //console.log(users)
  return users
}