import { HTTP } from 'meteor/http'

import {Countries}   from '/imports/api/countries/Countries'

const TIMEOUT = 25
const TYPES = ['node', 'way', 'relation']


export default function(objType, objId) {
  const baseUrl = 'http://overpass-api.de/api/interpreter?data='
  const queryStart = `[out:json][timeout:${TIMEOUT}];`
  const obj = `${objType}(${objId});out;`
  const area = 'is_in;area._["boundary"="administrative"]["admin_level"];area._(if:t["admin_level"]<"8");out;'
  const queryEnd = '>;out skel qt;'
  const query = baseUrl + queryStart + obj + area + queryEnd
  console.log(query)
  return new Promise((resolve, reject) => {
    HTTP.get(
      query,
      (err, {statusCode, content, data, headers}) => {
        if(err) {
          console.error(err)
          reject(err)
        } else {
          const { elements } = data
          const areas = elements.filter(({type}) => type === 'area')
          const areasByAdminLevel = areas.reduce(
            (acc, item) => {
              acc[item.tags.admin_level] = item
              return acc
            },
            {}
          )
          const countryArea = areasByAdminLevel['2']
          const country = Countries.findOne({osmId: countryArea.id})
          let adminLevel = country && country.osmCityAdminLevel || 8
          let cityArea
          do {
            cityArea = areasByAdminLevel[adminLevel]
            adminLevel -= 1
          }
          while(!cityArea && adminLevel > 2)
          const obj = elements.filter(({type}) => type === objType)[0]
          console.log(obj.tags)
          resolve({
            cityArea,
            countryArea,
            country,
            lat: obj.lat,
            lon: obj.lon,
            name: obj.tags.name,
            amenity: obj.tags.amenity,
          })
        }
      }
    )
  })
}

/*
  [out:json][timeout:25];
  (
    node(nodeId);
    relation(nodeId);
    way(nodeId);
  ) -> .node;
  out;
  (
    .node is_in;
  );
  area._["boundary"="administrative"];
  area._(if:t["admin_level"] == _.max(t["admin_level"]));
  out body;
  >;
  out skel qt;
*/
