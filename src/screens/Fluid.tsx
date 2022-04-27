import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import Slide from './Slide';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    color: '#3984FF',
    picture: require('../../assets/1.png'),
    aspectRatio: 439.75 / 470.5,
  },
  {
    color: '#39ffb4',
    picture: require('../../assets/2.png'),
    aspectRatio: 400.5 / 429.5,
  },
  {
    color: '#ffb439',
    picture: require('../../assets/4.png'),
    aspectRatio: 391.25 / 520,
  },
];

export default function Fluid() {
  const x = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event, ctx) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <GestureHandlerRootView
      renderToHardwareTextureAndroid
      style={style.container}
    >
      <Animated.ScrollView
        horizontal
        snapToInterval={width}
        decelerationRate='fast'
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => {
          const isFirst = index === 0;
          const isLast = index === slides.length - 1;
          const colors = [
            isFirst ? slide.color : slides[index - 1].color,
            slide.color,
            isLast ? slide.color : slides[index + 1].color,
          ] as const;
          return (
            <Slide
              slide={slide}
              key={index}
              index={index}
              x={x}
              colors={colors}
            />
          );
        })}
      </Animated.ScrollView>
    </GestureHandlerRootView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 30,
  },
});
