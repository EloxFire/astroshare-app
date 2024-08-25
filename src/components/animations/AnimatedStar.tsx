import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing } from 'react-native'

interface AnimatedStarProps {
  size: number
}

export default function AnimatedStar({ size }: AnimatedStarProps) {

  // References to hold animation values
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity is 0
  const rotateAnim = useRef(new Animated.Value(0)).current; // Initial rotation is 0

  const [rotationDirection, setRotationDirection] = useState(1);

  useEffect(() => {
    // Looping fade-in fade-out animation
    const fadeInOut = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.linear
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.linear
        })
      ])
    )

    // Randomly choose clockwise or anticlockwise rotation
    const isClockwise = Math.random() >= 0.5;
    const rotationDirection = isClockwise ? 1 : -1;
    setRotationDirection(rotationDirection);

    // Random rotation speed (between 2000ms and 5000ms)
    const rotationSpeed = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

    // Rotation animation
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: rotationSpeed,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      { iterations: -1 } // Infinite loop
    );

    // Start both animations
    fadeInOut.start();
    rotate.start();

    // Cleanup animations on component unmount
    return () => {
      fadeInOut.stop();
      rotate.stop();
    };
  }, [fadeAnim, rotateAnim]);

  // Interpolating fadeAnim value to an opacity value
  const fadeInterpolate = fadeAnim.interpolate({
    inputRange: [.7, 1],
    outputRange: [1, .7]
  });

  // Interpolating rotateAnim value to a rotation angle
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0.8, 1],
    outputRange: ['0deg', `${rotationDirection * 360}deg`],
  });

  return (
    <Animated.Image style={{ width: size, height: size, opacity: fadeAnim, transform: [{ rotate: rotateInterpolate }], }} source={require('../../../assets/icons/FiStar.png')} />
  )
}
