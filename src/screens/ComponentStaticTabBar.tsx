import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

interface Tab {
  name: string;
}

interface ComponentStaticTabBarProps {
  tabs: Tab[];
  value: Animated.Value;
}

const { width } = Dimensions.get('window');

export const tabHeight = 64;

export default function ComponentStaticTabBar({
  tabs,
  value,
}: ComponentStaticTabBarProps) {
  const values = tabs.map(
    (tab, index) => new Animated.Value(index === 0 ? 1 : 0)
  );

  const onPress = (index: number) => {
    const tabWidth = width / tabs.length;
    Animated.sequence([
      ...values.map((value) =>
        Animated.timing(value, {
          toValue: 0,
          useNativeDriver: true,
          duration: 100,
        })
      ),
      Animated.parallel([
        Animated.spring(values[index], {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(value, {
          toValue: -width + tabWidth * index,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const tabWidth = width / tabs.length;

  return (
    <View style={styles.container}>
      {tabs.map(({ name }, key) => {
        const activeValue = values[key];
        const opacity = value.interpolate({
          inputRange: [
            -width + tabWidth * (key - 1),
            -width + tabWidth * key,
            -width + tabWidth * (key + 1),
          ],
          outputRange: [1, 0, 1],
          extrapolate: 'clamp',
        });
        const translateY = activeValue.interpolate({
          inputRange: [0, 1],
          outputRange: [tabHeight, 0],
        });
        return (
          <React.Fragment {...{ key }}>
            <TouchableWithoutFeedback onPress={() => onPress(key)}>
              <Animated.View style={[styles.tab, { opacity }]}>
                <Icon {...{ name }} size={25} />
              </Animated.View>
            </TouchableWithoutFeedback>
            <Animated.View
              style={{
                position: 'absolute',
                width: tabWidth,
                top: -8,
                left: tabWidth * key,
                height: tabHeight,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ translateY }],
              }}
            >
              <View style={styles.circle}>
                <Icon {...{ name }} size={25} />
              </View>
            </Animated.View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    height: tabHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
