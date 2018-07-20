import PropTypes from 'prop-types'
import React from 'react'
import osmtogeojson from 'osmtogeojson'
import Mapbox from '@mapbox/react-native-mapbox-gl'
import {View, StyleSheet, Text, AsyncStorage, Button, Alert} from 'react-native'
import { Cache } from "react-native-cache"
import {MAPBOX_KEY} from 'react-native-config'

const cache = new Cache({
  namespace: "venues",
  policy: {
    //maxEntries: 100,
  },
  backend: AsyncStorage,
})
const promisify = (func, parent) => (...args) => new Promise((resolve, reject) => {
  func.bind(parent)(...args, function(err, res) {
    if(err) return reject(err)
    resolve(res)
  })
})

cache.setItem = promisify(cache.setItem, cache)
cache.getItem = promisify(cache.getItem, cache)
cache.removeItem = promisify(cache.removeItem, cache)
cache.peekItem = promisify(cache.peekItem, cache)
cache.getAll = promisify(cache.getAll, cache)
cache.clearAll = promisify(cache.clearAll, cache)

Mapbox.setAccessToken(MAPBOX_KEY)

const citiesCsv = `
node	9002746	Charleroi	50.4120332	4.4436244
node	17807753	Paris	48.8566101	2.3514992
node	20626319	Lyon	45.7578137	4.8320114
node	26686463	Metz	49.1196964	6.1763552
node	26686468	Tours	47.3900474	0.6889268
node	26686473	Clermont-Ferrand	45.7774551	3.0819427
node	26686477	Reims	49.2577886	4.0319260
node	26686504	Dijon	47.3215806	5.0414701
node	26686508	Orléans	47.9027336	1.9086066
node	26686514	Amiens	49.8941708	2.2956951
node	26686518	Toulouse	43.6044622	1.4442469
node	26686524	Limoges	45.8354243	1.2644847
node	26686526	Rennes	48.1113387	-1.6800198
node	26686539	Saint-Étienne	45.4401467	4.3873058
node	26686548	Nantes	47.2186371	-1.5541362
node	26686554	Besançon	47.2379530	6.0243246
node	26686559	Le Mans	48.0078497	0.1997933
node	26686563	Strasbourg	48.5846140	7.7507127
node	26686568	Mulhouse	47.7494188	7.3399355
node	26686572	Angers	47.4739884	-0.5515588
node	26686577	Lille	50.6305089	3.0706414
node	26686582	Toulon	43.1257311	5.9304919
node	26686585	Nîmes	43.8374249	4.3600687
node	26686587	Rouen	49.4404591	1.0939658
node	26686589	Grenoble	45.1821510	5.7274722
node	26686593	Boulogne-Billancourt	48.8356649	2.2402060
node	26686595	Aix-en-Provence	43.5298424	5.4474738
node	26691769	Poitiers	46.5802596	0.3401960
node	26691842	Calais	50.9488000	1.8746800
node	26691955	Argenteuil	48.9479069	2.2481797
node	26692183	Dunkerque	51.0347708	2.3772525
node	26692216	Montreuil	48.8623357	2.4412184
node	26692268	Pau	43.2957547	-0.3685668
node	26692383	Saint-Denis	48.9357730	2.3580232
node	26692465	Annecy	45.9087950	6.1198672
node	26692561	Nancy	48.6937223	6.1834097
node	26692577	Troyes	48.2971626	4.0746257
node	26761400	Marseille	43.2961743	5.3699525
node	51341115	Ajaccio	41.9263991	8.7376029
node	412476714	Caen	49.1828008	-0.3690815
node	647953515	Villeurbanne	45.7733105	4.8869339
node	823582966	Brest	48.3905283	-4.4860088
node	1664142674	Perpignan	42.6953868	2.8844713
node	1691675873	Bordeaux	44.8412250	-0.5800364
node	1701090139	Nice	43.7009358	7.2683912
node	1768128336	Chartres	48.4470039	1.4866387
node	1836027948	Avignon	43.9493143	4.8060329
node	1909836591	Le Havre	49.4938975	0.1079732
`
const cities = citiesCsv.split('\n').map(line => line.split('\t'))
  .filter(line => parseFloat(line[3]) > 40 && parseFloat(line[3]) < 52 && parseFloat(line[4]) > -5 && parseFloat(line[4]) < 9)
  .reduce((acc, item) => {
    if(!item) return acc
    acc.features.push({
      "type": "Feature",
      "properties": {
        "@id": `${item[0]}/${item[1]}`,
        "place": "city",
        "name": item[2],
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          parseFloat(item[4]),
          parseFloat(item[3]),
        ]
      },
      "id": `${item[0]}/${item[1]}`
    })
    return acc
  }, {
    "type": "FeatureCollection",
    "features": []}
  )
console.log(cities)

const players = {
  "type": "FeatureCollection",
  "features": [].concat(
    ...cities.features.map(({properties: {name}, geometry: {coordinates: [lon, lat]}}) => {
      const length = Math.round(Math.random() * 100)
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
console.log(players)

const layerStyles = Mapbox.StyleSheet.create({
  playerSinglePoint: {
    circleColor: 'blue',
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleRadius: 8,
    circlePitchAlignment: 'map',
  },
  singlePoint: {
    circleColor: 'green',
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleRadius: 5,
    circlePitchAlignment: 'map',
  },

  clusteredPoints: {
    circlePitchAlignment: 'map',
    circleColor: Mapbox.StyleSheet.source(
      [
        [25, 'yellow'],
        [50, 'red'],
        [75, 'blue'],
        [100, 'orange'],
        [300, 'pink'],
        [750, 'white'],
      ],
      'point_count',
      Mapbox.InterpolationMode.Exponential,
    ),

    circleRadius: Mapbox.StyleSheet.source(
      [[0, 15], [100, 20], [750, 30]],
      'point_count',
      Mapbox.InterpolationMode.Exponential,
    ),

    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
  },

  clusterCount: {
    textField: '{point_count}',
    textSize: 12,
    textPitchAlignment: 'map',
  },
})

export default class MainMap extends React.Component {
  static propTypes = {
    latitude:  PropTypes.number,
    longitude: PropTypes.number,
  }
  static defaultProps = {
    latitude:  0,
    longitude: 0,
  }
  state = {
    venues: null,
  }
  render() {
    const { latitude, longitude } = this.props
    const { venues } = this.state
    //console.warn(latitude, longitude)
    const region = {
      //latitude: latitude || 45.56944,
      latitude: 43.9493143,
      //longitude: longitude || 4.73418,
      longitude: 4.8060329,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    }
    return (
      <View style={styles.container}>
        <Mapbox.MapView
          ref={ref => this.mapView = ref}
          styleURL={Mapbox.StyleURL.Street}
          zoomLevel={15}
          centerCoordinate={latLngToArray(region)}
          showUserLocation={true}
          onRegionDidChange={this.handleRegionDidChange}
          style={styles.container}>

          <Mapbox.PointAnnotation
            key='pointAnnotation'
            id='pointAnnotation'
            coordinate={[4.75418, 44.56044]}>

            <View style={styles.annotationContainer}>
              <View style={styles.annotationFill}><Text>8</Text></View>
            </View>
            <Mapbox.Callout title='Look! An annotation!' />
          </Mapbox.PointAnnotation>


          <Mapbox.ShapeSource
            id="cities"
            shape={cities}>
            <Mapbox.CircleLayer
              id="citiesPoints"
              style={layerStyles.clusteredPoints}
            />
          </Mapbox.ShapeSource>

          <Mapbox.ShapeSource
            id="players"
            cluster
            clusterRadius={50}
            clusterMaxZoom={14}
            shape={players}>
            <Mapbox.SymbolLayer
              id="playerPointCount"
              style={layerStyles.clusterCount}
            />

            <Mapbox.CircleLayer
              id="playerClusteredPoints"
              belowLayerID="playerPointCount"
              filter={['has', 'point_count']}
              style={layerStyles.clusteredPoints}
            />

            <Mapbox.CircleLayer
              id="playerSinglePoint"
              belowLayerID="playerClusteredPoints"
              filter={['!has', 'point_count']}
              style={layerStyles.playerSinglePoint}
            />
          </Mapbox.ShapeSource>

          {venues && venues.features.length < 50 && venues.features.map((feature, idx) => (
            <Mapbox.PointAnnotation
              key={`city-${idx}`}
              id={`city-${idx}`}
              coordinate={feature.geometry.coordinates}>

              <View style={styles.annotationContainer}>
                <View style={styles.annotationFill} />
              </View>
              <Mapbox.Callout title={feature.properties.name}>
                <View>
                  <Text>test</Text>
                  <Button title="enter" onPress={this.enterVenue(feature.properties.name)}>enter</Button>
                </View>
              </Mapbox.Callout>
            </Mapbox.PointAnnotation>
          ))}
          {venues &&
            <Mapbox.ShapeSource
              id="venues"
              shape={venues}>
              <Mapbox.CircleLayer
                id="venuesPoints"
                belowLayerID="playerSinglePoint"
                style={layerStyles.singlePoint}
              />
            </Mapbox.ShapeSource>
          }
        </Mapbox.MapView>
      </View>
    )
  }
  handleRegionDidChange = async () => {
    const [[e, n], [w, s]] = await this.mapView.getVisibleBounds()
    const zoom = await this.mapView.getZoom()
    //console.log("plop", zoom, [e, n, w, s])
    if(zoom < 14) {
      this.setState({venues: null})
      return
    }
    const displayable = cities.features.filter(({geometry: {coordinates: [lon, lat]}}) => (
      isInsideBbox({lat, lon}, {s, w, n, e})
    ))
    if(displayable.length) {
      this.getData(displayable[0].properties.name, s, w, n, e)
    }
  }
  getData = async (cityName, s, w, n, e) => {
    console.log(cityName)
    if(!(await cache.getItem(cityName))) {
      cache.setItem(cityName, {loading: true, data: {}})
      const TYPES = ['node', 'way', 'relation']
      const amenities = ['pub', 'bar', 'cafe', 'restaurant', 'fast_food']
      const baseUrl = 'http://overpass-api.de/api/interpreter?data='
      const queryStart = `[out:json][timeout:25];area[name="${cityName}"]["boundary"="administrative"];area._(if:t["admin_level"] == _.max(t["admin_level"]))->.s;(`
      const queryMain = TYPES.map(type => amenities.map(amenity => (
        `${type}["amenity"="${amenity}"](area.s);`
      )).join('')).join('')
      const queryEnd = ');out geom;'
      const query = baseUrl + queryStart + queryMain + queryEnd
      console.log(query)
      const data = await (
        fetch(query)
          .then(res => res.json())
          .catch(error => console.error(error))
      )
      await cache.setItem(cityName, {loading: false, data})
    }
    const venues = await cache.getItem(cityName)
    if(venues.loading) return
    console.log(venues.data.elements.length)
    const osmObj = {
      ...venues.data,
      elements: venues.data.elements.filter(({lat, lon}) => isInsideBbox({lat, lon}, {s, w, n, e}))
    }
    console.log(osmObj.elements.length)
    this.setState({venues: osmtogeojson(osmObj)})
  }
  enterVenue = (name) => () => {
    Alert.alert(`entering ${name}`)
  }
}


function latLngToArray({latitude, longitude}) {
  return [longitude, latitude]
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    transform: [{ scale: 0.6 }],
  },
  annotationFill2: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'green',
    transform: [{ scale: 0.6 }],
  }
})

function isInsideBbox({lat, lon}, {s, w, n, e}) {
  return lat <= n && lat >= s && lon <= e && lon >= w
}
