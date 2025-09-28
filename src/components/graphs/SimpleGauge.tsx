import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const SimpleGauge = ({
                       value = 0,
                       maxValue = 100,
                       size = 200,
                       thickness = 20,
                       backgroundColor = '#e0e0e0',
                       fillColor = '#2196f3',
                       labelFontSize = 24
                     }) => {
  // Calculer l'angle de remplissage basé sur la valeur
  const angle = (value / maxValue) * 180;

  // Créer un arc de cercle avec des vues
  const createArc = (startAngle: any, endAngle: any, color: any) => {
    const items = [];
    for (let i = startAngle; i <= endAngle; i += 2) {
      const rad = (i - 90) * Math.PI / 180;
      const x = Math.cos(rad) * (size / 2 - thickness / 2);
      const y = Math.sin(rad) * (size / 2 - thickness / 2);

      items.push(
        <View
          key={i}
          style={[
            styles.dot,
            {
              width: thickness,
              height: thickness,
              backgroundColor: i <= angle ? fillColor : backgroundColor,
              transform: [
                { translateX: x - thickness / 2 },
                { translateY: y - thickness / 2 }
              ]
            }
          ]}
        />
      );
    }
    return items;
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.gaugeContainer,
          {
            width: size,
            height: size / 2
          }
        ]}
      >
        {createArc(0, 180, backgroundColor)}
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              { fontSize: labelFontSize }
            ]}
          >
            {Math.round(value)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  dot: {
    position: 'absolute',
    borderRadius: 999
  },
  labelContainer: {
    position: 'absolute',
    bottom: 0
  },
  label: {
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default SimpleGauge;