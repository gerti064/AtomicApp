import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow animation
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    glowLoop.start();

    return () => glowLoop.stop();
  }, []);

  function handleSubmit() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', `Logged in with ${email}`, [
      {
        text: 'OK',
        onPress: () => router.replace('/Home'),
      },
    ]);
  }

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background Gradient */}
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
        {/* Animated glow overlay */}
        <Animated.View style={[
          styles.glowOverlay,
          { opacity: glowInterpolation }
        ]} />

        <Animated.View style={[
          styles.content,
          {
            opacity: fadeInAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Mini atom logo */}
            <View style={styles.miniAtomContainer}>
              <LinearGradient
                colors={['#ff6b35', '#f7931e', '#ffdd00']}
                style={styles.miniAtom}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.miniNucleus} />
                <View style={[styles.miniRing, styles.miniRing1]} />
                <View style={[styles.miniRing, styles.miniRing2]} />
              </LinearGradient>
            </View>
            
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your Atomic account</Text>
            <View style={styles.divider} />
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[
                styles.inputWrapper,
                isEmailFocused && styles.inputWrapperFocused
              ]}>
                <LinearGradient
                  colors={isEmailFocused ? ['#ff6b35', '#f7931e'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  style={styles.inputGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[
                styles.inputWrapper,
                isPasswordFocused && styles.inputWrapperFocused
              ]}>
                <LinearGradient
                  colors={isPasswordFocused ? ['#ff6b35', '#f7931e'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  style={styles.inputGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButtonWrapper}
            onPress={handleSubmit}
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

          {/* Sign Up Link */}
          <View style={styles.signUpSection}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <TouchableOpacity onPress={() => router.push('/auth/SignUp')}>
                <Text style={styles.signUpLink}>Create Account</Text>
              </TouchableOpacity>
            </Text>
          </View>

          {/* Or Divider */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.socialButtonGradient}
              >
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.socialButtonGradient}
              >
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    flex: 1,
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
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  miniAtomContainer: {
    marginBottom: 20,
  },
  miniAtom: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 15,
  },
  miniNucleus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    position: 'absolute',
  },
  miniRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 25,
  },
  miniRing1: {
    width: 40,
    height: 40,
  },
  miniRing2: {
    width: 50,
    height: 50,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 107, 53, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#ff6b35',
    borderRadius: 1,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  inputGradient: {
    padding: 2,
    borderRadius: 16,
  },
  input: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#ff6b35',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loginButtonWrapper: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    marginBottom: 30,
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
  signUpSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  signUpText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#ff6b35',
    fontWeight: '700',
    letterSpacing: 0.5,
    textDecorationLine: 'underline',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  orText: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 20,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  socialContainer: {
    gap: 16,
  },
  socialButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  socialButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 28,
  },
  socialButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});