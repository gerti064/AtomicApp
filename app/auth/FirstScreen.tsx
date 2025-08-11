import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function FirstScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for the logo
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Glow animation
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );

    // Fade in animation
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    pulseLoop.start();
    glowLoop.start();

    return () => {
      pulseLoop.stop();
      glowLoop.stop();
    };
  }, []);

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      {/* Complex Background Gradient */}
      <LinearGradient
        colors={[
          '#0a0a0a',
          '#1a1a2e',
          '#16213e',
          '#1a1a2e',
          '#0a0a0a'
        ]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={styles.backgroundGradient}
      >
        {/* Animated overlay for depth */}
        <Animated.View style={[
          styles.glowOverlay,
          {
            opacity: glowInterpolation,
          }
        ]} />
        
        <Animated.View style={[styles.content, { opacity: fadeInAnim }]}>
          {/* Premium Logo Section */}
          <View style={styles.logoContainer}>
            <Animated.View style={[
              styles.atomContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}>
              <LinearGradient
                colors={['#ff6b35', '#f7931e', '#ffdd00', '#f7931e', '#ff6b35']}
                style={styles.atomIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.nucleus} />
                <View style={[styles.electronRing, styles.ring1]} />
                <View style={[styles.electronRing, styles.ring2]} />
                <View style={[styles.electronRing, styles.ring3]} />
                
                {/* Electron particles */}
                <View style={[styles.electron, styles.electron1]} />
                <View style={[styles.electron, styles.electron2]} />
                <View style={[styles.electron, styles.electron3]} />
              </LinearGradient>
            </Animated.View>
            
            <LinearGradient
              colors={['#ffffff', '#f0f0f0', '#ffffff']}
              style={styles.brandNameContainer}
            >
              <Text style={styles.brandName}>ATOMIC</Text>
            </LinearGradient>
            <Text style={styles.tagline}>PREMIUM FIRE COLLECTION</Text>
            <View style={styles.divider} />
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Ignite Your Passion</Text>
            <Text style={styles.subtitle}>
              Discover our curated collection of luxury lighters, designer ashtrays, 
              and exclusive smoking accessories crafted for connoisseurs
            </Text>
          </View>

          {/* Premium Button Section */}
          <View style={styles.buttonContainer}>
            {/* Login Button with Glass Effect */}
            <TouchableOpacity
              style={styles.loginButtonWrapper}
              onPress={() => router.push('/auth/Login')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#ff6b35', '#f7931e', '#ff8c42']}
                style={styles.loginButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.buttonGloss} />
                <Text style={styles.loginButtonText}>SIGN IN</Text>
                <View style={styles.buttonShadowInner} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up Button with Border Gradient */}
            <TouchableOpacity
              style={styles.signUpButtonWrapper}
              onPress={() => router.push('/auth/SignUp')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#ff6b35', '#f7931e', '#ffdd00', '#f7931e', '#ff6b35']}
                style={styles.signUpButtonBorder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.signUpButton}>
                  <Text style={styles.signUpButtonText}>CREATE ACCOUNT</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Premium Footer */}
          <View style={styles.footer}>
            <View style={styles.flameContainer}>
              <LinearGradient
                colors={['#ff6b35', '#ffdd00']}
                style={styles.flame}
              />
            </View>
            <Text style={styles.footerText}>EST. 2024 • PREMIUM QUALITY</Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    flex: 1,
    position: 'relative',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: height * 0.08,
    paddingBottom: 50,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  atomContainer: {
    marginBottom: 24,
  },
  atomIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  nucleus: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    position: 'absolute',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
  electronRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
  },
  ring1: {
    width: 70,
    height: 70,
  },
  ring2: {
    width: 85,
    height: 85,
    transform: [{ rotate: '60deg' }],
  },
  ring3: {
    width: 95,
    height: 95,
    transform: [{ rotate: '120deg' }],
  },
  electron: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  electron1: {
    top: 15,
    right: 47,
  },
  electron2: {
    bottom: 25,
    left: 25,
  },
  electron3: {
    top: 35,
    left: 10,
  },
  brandNameContainer: {
    paddingHorizontal: 2,
    borderRadius: 2,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '900',
    color: 'transparent',
    letterSpacing: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    // For gradient text effect
    backgroundColor: 'linear-gradient(45deg, #ff6b35, #f7931e)',
  },
  tagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
    letterSpacing: 3,
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#ff6b35',
    marginTop: 20,
    borderRadius: 1,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
    lineHeight: 38,
    textShadowColor: 'rgba(255, 107, 53, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    paddingVertical: 20,
    gap: 20,
  },
  loginButtonWrapper: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  loginButton: {
    flex: 1,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  buttonGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  buttonShadowInner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    zIndex: 1,
  },
  signUpButtonWrapper: {
    width: '100%',
    height: 64,
    borderRadius: 32,
  },
  signUpButtonBorder: {
    flex: 1,
    borderRadius: 32,
    padding: 2,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signUpButton: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  signUpButtonText: {
    color: '#ff6b35',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 107, 53, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  flameContainer: {
    marginBottom: 12,
  },
  flame: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
});