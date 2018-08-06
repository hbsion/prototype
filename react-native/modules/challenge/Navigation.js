import React from 'react'
import {View, Animated, StyleSheet, Text, Button, Alert, Image} from 'react-native'
import { Accelerometer, Gyroscope }  from 'react-native-sensors'
import { RNCamera } from 'react-native-camera'
import ModelView from 'react-native-gl-model-view'
import KeepAwake from 'react-native-keep-awake'
const AnimatedModelView = Animated.createAnimatedComponent(ModelView);

import arrow from '/utils/arrow.png'

function r(n) {
  if (!n) {
    return 0
  }
  return Math.floor(n * 100) / 100
}

export default class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      accX: 0,
      accY: 0,
      accZ: 0,
      gyrX: 0,
      gyrY: 0,
      gyrZ: 0,
    }
  }
  async componentDidMount() {
    try {
      const interval = 1
      this.accelerationObservable = await new Accelerometer({
        updateInterval: interval * 1000 // defaults to 100ms
      })
      console.log("accelerometer")
      let firstRun = true
      this.accelerationObservable
        //.filter(({ x, y, z }) => x + y + z > 20)
        .subscribe(({ x, y, z }) => {
          const {accX, accY, accZ} = this.state
          const modifier = {}
          if(Math.abs((x - accX) / accX) > 0.1) modifier.accX = x
          if(Math.abs((y - accY) / accY) > 0.1) modifier.accY = y
          if(Math.abs((z - accZ) / accZ) > 0.1) modifier.accZ = z

          // if(firstRun) {
          //   modifier.gyroscope = {
          //     ...this.state.gyroscope,
          //     //x: y / 9.81 * Math.PI / 2
          //   }
          //   console.log(y, y / 9.81 * Math.PI / 2)
          //   firstRun = false
          // }
          if(Object.keys(modifier).length) this.setState(modifier)
        })
      /*this.gyroscopeObservable = await new Gyroscope({
        updateInterval: interval * 1000 // defaults to 100ms
      })
      console.log("gyro")
      this.gyroscopeObservable
        .subscribe(({ x, y, z }) => {
          this.setState({
            gyrX: r(this.state.gyrX + x * interval),
            gyrY: r(this.state.gyrY + y * interval),
            gyrZ: r(this.state.gyrZ + z * interval),
          })
        })*/
    } catch (error) {
      console.log("The sensor is not available")
    }
  }
  componentWillUnmount() {
    this.accelerationObservable && this.accelerationObservable.stop()
    this.gyroscopeObservable && this.gyroscopeObservable.stop()
  }
  render() {
    const { accX, accY, accZ, gyrX, gyrY, gyrZ } = this.state
    //console.log(accelerometer)
    //console.log(gyroscope)
    const baseAngle = 0 //- Math.PI / 2
    const acc = Math.min(1, Math.abs(accY) / 9.81)
    const angle = Math.acos(accY / 9.81)
    //const rotation = baseAngle + this.getAngle(accelerometer, gyroscope)
    //console.log(rotation / Math.PI * 180, (rotation - angle) / Math.PI * 180, acc, angle / Math.PI * 180)
    const factorX = accX // 9.7
    const factorY = accY // 9.7
    const factorZ = accZ // 9.7
    const allFactors = Math.sqrt(Math.pow(factorX, 2) + Math.pow(factorY, 2) + Math.pow(factorZ, 2))
    const accXn = Math.abs(factorX) / allFactors
    const accYn = Math.abs(factorY) / allFactors
    const accZn = Math.abs(factorZ) / allFactors
    const accZnPortrait = accZn * Math.abs(factorY) / (Math.abs(factorX) + Math.abs(factorY))
    const accZnLandscape = accZn * Math.abs(factorX) / (Math.abs(factorX) + Math.abs(factorY))
    // const rotateX = 90  + ( (accYn + accZnPortrait) * gyrX + (accXn + accZnLandscape) * gyrY ) / Math.PI * 180
    // const rotateY = 180 + ( - accXn * gyrZ - accYn * gyrZ + accZnPortrait * gyrY + accZnLandscape * gyrX ) / Math.PI * 180
    // const rotateZ = 0   + ( accXn * gyrX + accYn * gyrY - accZn * gyrZ ) / Math.PI * 180
    const FACTOR = 0.98
    const rotateX = 90 + (FACTOR * gyrX + (1 - FACTOR) * Math.atan(accYn, accZn)) / Math.PI * 180
    const rotateY = 180 - (FACTOR * gyrY + (1 - FACTOR) * Math.atan(accXn, accZn)) / Math.PI * 180
    const rotateZ = (FACTOR * gyrZ + (1 - FACTOR) * Math.atan(accXn, accYn)) / Math.PI * 180
    //const rotateX = 0 + (1 - factorX / allFactors) * gyroscope.x / Math.PI * 180
    //const rotateX = (gyroscope.z * factorZ / allFactors + gyroscope.y * factorX / allFactors + gyroscope.x * factorY / allFactors) / Math.PI * 180
    //const rotateY = 180 - elevationSign * (gyroscope.z * (1 - elevationFactorAbs) + gyroscope.y * elevationFactorAbs) / Math.PI * 180
    //const rotateY = 180 - (gyroscope.y * factorZ / allFactors + gyroscope.z * (1 - factorZ / allFactors)) / Math.PI * 180
    //const rotateZ = 0 + (gyroscope.z * factorZ / allFactors + gyroscope.y * factorY / allFactors + gyroscope.x * factorX / allFactors) / Math.PI * 180
    return (
      <View style={styles.container}>
        <KeepAwake />
        <Text>{r(accX)} {r(accY)} {r(accZ)} {r(allFactors)}</Text>
        <Text>{r(gyrX)} {r(gyrY)} {r(gyrZ)}</Text>
        <Text>{r(rotateX)} {r(rotateY)} {r(rotateZ)}</Text>
        <Text>{r(accZnPortrait)} {r(accZnLandscape)}</Text>
        {/*<RNCamera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
        />*/}
        {/*<AnimatedModelView
          model="demon.model"
          texture="demon.png"
          tint={{r: 1.0, g: 1.0, b: 1.0, a: 1.0}}
          rotateX={rotateX}
          rotateY={rotateY}
          rotateZ={rotateZ}
          translateZ={-2}
          animate={true}
          flipTexture={false}
          scale={0.005}
          style={styles.modelView}
        />*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  modelView: {
    position: 'absolute',
    top: 10,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  },
  arrow: {
    fontSize: 40,
    //width: 100,
  }
})
