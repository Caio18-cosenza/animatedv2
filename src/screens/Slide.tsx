import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedProps,
} from 'react-native-reanimated';
import { cartesian2Canvas, Vector } from 'react-native-redash';
import Svg, { Circle, Path } from 'react-native-svg';

import { createSVGPath, curveTo, moveTo, serialize } from './Path';

const { width, height } = Dimensions.get('window');
const SIZE = width;
const C = 0.551915024494;
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SlideProps {
  slide: {
    picture: number;
    aspectRatio: number;
    color: string;
  };
  index: number;
  x: Animated.SharedValue<number>;
  colors: [string, string, string];
}

const vec = (x: number, y: number) =>
  cartesian2Canvas({ x, y }, { x: 1, y: 1 });

const P00 = vec(0, 1);
const P01 = vec(C, 1);
const P02 = vec(1, C);
const P03 = vec(1, 0);

const P11 = vec(1, -C);
const P12 = vec(C, -1);
const P13 = vec(0, -1);

const P21 = vec(-C, -1);
const P22 = vec(-1, -C);
const P23 = vec(-1, 0);

const P31 = vec(-1, C);
const P32 = vec(-C, 1);
const P33 = vec(0, 1);

export default function Slide({ slide, index, x, colors }: SlideProps) {
  const animatedProps = useAnimatedProps(() => {
    const progress = (x.value - index * width) / width;
    const offset = interpolate(progress, [0, 0.3], [0, -2], Extrapolate.CLAMP);
    const addX = (v: Vector) => ({
      x: v.x + offset,
      y: v.y,
    });
    const path = createSVGPath();
    // <Circle r={0.05} fill='green' cx={P02.x} cy={P02.y} />
    //     <Circle r={0.05} fill='green' cx={P11.x} cy={P11.y} />
    //     <Circle r={0.1} fill='red' cx={P03.x} cy={P03.y} />
    moveTo(path, P00.x + offset, P00.y);
    curveTo(path, {
      c1: addX(P01),
      c2: P02,
      to: P03,
    });
    curveTo(path, {
      c1: P11,
      c2: addX(P12),
      to: addX(P13),
    });
    curveTo(path, {
      c1: addX(P21),
      c2: {
        x: interpolate(progress, [-0.3, 0], [1, 0]) + offset,
        y: P22.y,
      },
      to: {
        x: interpolate(progress, [-0.3, 0], [1, 0]) + offset,
        y: P23.y,
      },
    });
    curveTo(path, {
      c1: {
        x: interpolate(progress, [-0.3, 0], [1, 0]) + offset,
        y: P31.y,
      },
      c2: addX(P32),
      to: addX(P33),
    });

    const d = serialize(path);
    return { d, fill: interpolateColor(progress, [-1, 0, 1], colors) };
  });

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox='0 0 2 2'>
        <AnimatedPath animatedProps={animatedProps} />
      </Svg>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={slide.picture}
          style={{
            width: width * 0.5,
            height: width * 0.5 * slide.aspectRatio,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
