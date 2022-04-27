import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { Path } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps } from 'react-native-reanimated';

interface AnimatedStrokeProps {
  d: string;
  progress: Animated.SharedValue<number>;
}

const colors = ['#ffc27a', '#7edab9', '#45a6e5', '#fe8777'];

const AnimatedPath = Animated.createAnimatedComponent(Path);
const stroke = colors[Math.round(Math.random() * (colors.length - 1))];

export default function AnimatedStroke({ d, progress }: AnimatedStrokeProps) {
  const [length, setLength] = useState<number>(0);
  const ref = useRef<Path>(null);
  const bgStrokeAnimation = useAnimatedProps(() => ({
    strokeDashoffset: length - length * progress.value,
  }));
  const strokeAnimation = useAnimatedProps(() => ({
    strokeDashoffset: length - length * progress.value,
  }));

  return (
    <>
      <AnimatedPath
        animatedProps={bgStrokeAnimation}
        d={d}
        stroke={stroke}
        strokeWidth={10}
        strokeDasharray={length}
      />
      <AnimatedPath
        animatedProps={strokeAnimation}
        onLayout={() => setLength(ref.current!.getTotalLength())}
        ref={ref}
        d={d}
        stroke={stroke}
        strokeWidth={10}
        strokeDasharray={length}
      />
    </>
  );
}
