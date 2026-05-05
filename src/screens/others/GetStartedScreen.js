import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedButton from '../../components/AnimatedButton';

const { height, width } = Dimensions.get('window');

export default function GetStarted() {
  const navigation = useNavigation();

  // Animation values
  const fadeAnimTitle = useRef(new Animated.Value(0)).current;
  const slideAnimTitle = useRef(new Animated.Value(30)).current;

  const fadeAnimSubtitle = useRef(new Animated.Value(0)).current;
  const slideAnimSubtitle = useRef(new Animated.Value(30)).current;

  const fadeAnimButton = useRef(new Animated.Value(0)).current;
  const slideAnimButton = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(fadeAnimTitle, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnimTitle, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnimSubtitle, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnimSubtitle, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnimButton, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnimButton, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ])
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/Onboarding.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)', '#050505']}
          style={styles.gradient}
          locations={[0, 0.4, 0.7, 1]}
        >
          <View style={styles.content}>
            <Animated.View
              style={{
                opacity: fadeAnimTitle,
                transform: [{ translateY: slideAnimTitle }]
              }}
            >
              <Text style={styles.titleTop}>Fall in Love with</Text>
              <Text style={styles.titleMain}>Coffee in Blissful{"\n"}Delight!</Text>
            </Animated.View>

            <Animated.View
              style={{
                opacity: fadeAnimSubtitle,
                transform: [{ translateY: slideAnimSubtitle }]
              }}
            >
              <Text style={styles.subtitle}>
                Welcome to our cozy coffee corner, where every cup is a delight for you. Let's brew some joy together!
              </Text>
            </Animated.View>

            <Animated.View
              style={{
                opacity: fadeAnimButton,
                transform: [{ translateY: slideAnimButton }],
                width: '100%',
                alignItems: 'center'
              }}
            >
              <AnimatedButton
                style={styles.button}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </AnimatedButton>
            </Animated.View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height * 0.75,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  titleTop: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.5,
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  titleMain: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: 20,
    letterSpacing: -0.5,
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  subtitle: {
    fontSize: 15,
    color: '#A9A9A9',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 16,
    fontWeight: '500',
    alignSelf: 'stretch',
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  button: {
    backgroundColor: '#C67C4E',
    width: width - 64,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#C67C4E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 18,
  },
});
