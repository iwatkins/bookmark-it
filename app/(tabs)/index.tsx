import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        dark: Colors.dark.background,
        light: Colors.light.background
      }}
      headerImage={
        <Image
          source={require('@/assets/images/cozy-fire-banner.png')}
          style={styles.cozyBanner}
        />
      }>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    height: 178,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  cozyBanner: {
    height: 200,
    width: 400,
    top: -20,
    left: 0,
    position: 'absolute',
  },
});
