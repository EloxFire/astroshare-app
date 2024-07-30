import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Text,
  View,
} from "react-native";
import { compassStyles } from "../styles/components/compass";
import { Magnetometer, Gyroscope } from "expo-sensors";
import { Grid, Col, Row } from 'react-native-easy-grid';
import { getAngle } from "../helpers/scripts/compass/getAngle";
import { getDirection } from "../helpers/scripts/compass/getDirection";
import { getDegree } from "../helpers/scripts/compass/getDegrees";

const { height, width } = Dimensions.get('window');

export default function Compass({ navigation }: any) {
  const [subscription, setSubscription] = useState<any>(null);
  const [magnetometer, setMagnetometer] = useState(0);

  useEffect(() => {
    _toggle();
    return () => {
      _unsubscribe();
    };
  }, []);

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((data) => {
        setMagnetometer(_angle(data));
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const _angle = (magnetometer: any) => {
    let angle = 0;
    if (magnetometer) {
      let { x, y, z } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
  };

  const _direction = (degree: any) => {
    if (degree >= 22.5 && degree < 67.5) {
      return 'NE';
    }
    else if (degree >= 67.5 && degree < 112.5) {
      return 'E';
    }
    else if (degree >= 112.5 && degree < 157.5) {
      return 'SE';
    }
    else if (degree >= 157.5 && degree < 202.5) {
      return 'S';
    }
    else if (degree >= 202.5 && degree < 247.5) {
      return 'SW';
    }
    else if (degree >= 247.5 && degree < 292.5) {
      return 'W';
    }
    else if (degree >= 292.5 && degree < 337.5) {
      return 'NW';
    }
    else {
      return 'N';
    }
  };

  // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
  const _degree = (magnetometer: any) => {
    return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
  };

  return (
    <View style={compassStyles.content.compass}>
      <Grid style={{ backgroundColor: 'black' }}>
        <Row style={{ alignItems: 'center' }} size={.1}>
          <Col style={{ alignItems: 'center' }}>
            <View style={{ position: 'absolute', width: width, alignItems: 'center', top: height / 8 }}>
              <Image source={require('../../assets/icons/compass/compass_pointer.png')} style={{
                height: 30,
                resizeMode: 'contain'
              }} />
            </View>
          </Col>
        </Row>

        <Row style={{ alignItems: 'center' }} size={2}>
          <Text style={{
            color: '#fff',
            fontSize: height / 27,
            width: width,
            position: 'absolute',
            textAlign: 'center'
          }}>
            {_degree(magnetometer)}°
          </Text>

          <Col style={{ alignItems: 'center' }}>

            <Image source={require("../../assets/icons/compass/compass_bg.png")} style={{
              height: width - 80,
              justifyContent: 'center',
              alignItems: 'center',
              resizeMode: 'contain',
              transform: [{ rotate: 360 - magnetometer + 'deg' }]
            }} />

          </Col>
        </Row>

      </Grid>
    </View>
  );
}
