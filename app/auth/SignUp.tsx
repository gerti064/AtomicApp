// app/auth/SignUp.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');
const API_URL = 'http://134.122.71.254:4000'; // ⬅️ change to your domain (HTTPS in production)

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [isFullNameFocused, setIsFullNameFocused] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeInAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideUpAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2500, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2500, useNativeDriver: false }),
      ])
    );
    glowLoop.start();
    return () => glowLoop.stop();
  }, []);

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function validatePassword(password: string) {
    return password.length >= 6;
  }

  const trySignin = async () => {
    const res = await fetch(`${API_URL}/api/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const maybeText = await res.text();
    let data: any = {};
    try { data = JSON.parse(maybeText); } catch { data = { message: maybeText }; }
    if (!res.ok) throw new Error(data?.message || `Login failed (${res.status})`);
    if (!data?.token || !data?.user) throw new Error('Login did not return token/user');
    return data;
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match!");
      return;
    }
    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the Terms & Conditions');
      return;
    }

    setLoading(true);
    try {
      // 1) Create account
      const res = await fetch(`${API_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const raw = await res.text();
      let data: any = {};
      try { data = JSON.parse(raw); } catch { data = { message: raw }; }

      // Non-2xx: show backend message if present
      if (!res.ok) {
        throw new Error(data?.message || `Sign up failed (${res.status})`);
      }

      // 2) If backend already returns token+user → save & go
      if (data?.token && data?.user?.id) {
        await SecureStore.setItemAsync('token', data.token);
        await SecureStore.setItemAsync('user', JSON.stringify(data.user));
        router.replace('/(tabs)/Orders');
        return;
      }

      // 3) If no token returned, try to sign in with same credentials
      try {
        const login = await trySignin();
        await SecureStore.setItemAsync('token', login.token);
        await SecureStore.setItemAsync('user', JSON.stringify(login.user));
        router.replace('/(tabs)/Orders');
        return;
      } catch {
        // 4) If login still not returning token but signup gave us an id, store minimal user so Orders can use user_id
        const inferredId =
          data?.user?.id ?? data?.id ?? data?.user_id ?? data?.insertId ?? null;

        if (inferredId) {
          const minimalUser = { id: Number(inferredId), email, name: fullName };
          await SecureStore.setItemAsync('user', JSON.stringify(minimalUser));
          // token may be missing; Orders will still pass user_id in query
          router.replace('/(tabs)/Orders');
          return;
        }

        // If we reach here, we have no token and no id
        throw new Error('Account created, but could not authenticate automatically.');
      }
    } catch (e: any) {
      Alert.alert('Sign up failed', e?.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const glowInterpolation = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.6] });

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, color: 'transparent', text: '' };
    if (password.length < 4) return { strength: 25, color: '#ff4444', text: 'Weak' };
    if (password.length < 6) return { strength: 50, color: '#ffaa00', text: 'Fair' };
    if (password.length < 8) return { strength: 75, color: '#88cc00', text: 'Good' };
    return { strength: 100, color: '#44cc44', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Background Gradient */}
        <LinearGradient
          colors={['#0a0a0a', '#1a1a2e', '#16213e', '#1a1a2e', '#0a0a0a']}
          locations={[0, 0.25, 0.5, 0.75, 1]}
          style={styles.backgroundGradient}
        >
          {/* Animated glow overlay */}
          <Animated.View style={[styles.glowOverlay, { opacity: glowInterpolation }]} />

          <Animated.View style={[styles.content, { opacity: fadeInAnim, transform: [{ translateY: slideUpAnim }] }]}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              {/* Back Button */}
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              {/* Mini atom logo */}
              <View style={styles.miniAtomContainer}>
                <LinearGradient colors={['#ff6b35', '#f7931e', '#ffdd00']} style={styles.miniAtom} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <View style={styles.miniNucleus} />
                  <View style={[styles.miniRing, styles.miniRing1]} />
                  <View style={[styles.miniRing, styles.miniRing2]} />
                  <View style={[styles.miniRing, styles.miniRing3]} />
                </LinearGradient>
              </View>

              <Text style={styles.title}>Join Atomic</Text>
              <Text style={styles.subtitle}>Create your premium account</Text>
              <View style={styles.divider} />
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={[styles.inputWrapper, isFullNameFocused && styles.inputWrapperFocused]}>
                  <LinearGradient
                    colors={isFullNameFocused ? ['#ff6b35', '#f7931e'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={styles.inputGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <TextInput
                      placeholder="Enter your full name"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={fullName}
                      onChangeText={setFullName}
                      style={styles.input}
                      onFocus={() => setIsFullNameFocused(true)}
                      onBlur={() => setIsFullNameFocused(false)}
                    />
                  </LinearGradient>
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.inputWrapper, isEmailFocused && styles.inputWrapperFocused]}>
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
                <View style={[styles.inputWrapper, isPasswordFocused && styles.inputWrapperFocused]}>
                  <LinearGradient
                    colors={isPasswordFocused ? ['#ff6b35', '#f7931e'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={styles.inputGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <TextInput
                      placeholder="Create a password"
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

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <View style={styles.passwordStrengthContainer}>
                    <View style={styles.passwordStrengthBar}>
                      <View
                        style={[
                          styles.passwordStrengthFill,
                          {
                            width: `${getPasswordStrength().strength}%`,
                            backgroundColor: getPasswordStrength().color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.passwordStrengthText, { color: getPasswordStrength().color }]}>
                      {getPasswordStrength().text}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={[styles.inputWrapper, isConfirmPasswordFocused && styles.inputWrapperFocused]}>
                  <LinearGradient
                    colors={isConfirmPasswordFocused ? ['#ff6b35', '#f7931e'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={styles.inputGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <TextInput
                      placeholder="Confirm your password"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      style={styles.input}
                      onFocus={() => setIsConfirmPasswordFocused(true)}
                      onBlur={() => setIsConfirmPasswordFocused(false)}
                    />
                  </LinearGradient>
                </View>
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <Text style={styles.errorText}>Passwords don't match</Text>
                )}
              </View>

              {/* Terms & Conditions */}
              <TouchableOpacity style={styles.termsContainer} onPress={() => setAcceptTerms(!acceptTerms)}>
                <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                  {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity style={styles.signUpButtonWrapper} onPress={handleSubmit} activeOpacity={0.85} disabled={loading}>
              <LinearGradient colors={['#ff6b35', '#f7931e', '#ff8c42']} style={styles.signUpButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View style={styles.buttonGloss} />
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signUpButtonText}>CREATE ACCOUNT</Text>}
                <View style={styles.buttonShadowInner} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <TouchableOpacity onPress={() => router.push('/auth/Login')}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </Animated.View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  /* ——— your styles exactly as provided ——— */
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContainer: { flexGrow: 1 },
  backgroundGradient: { flex: 1, minHeight: height },
  glowOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 107, 53, 0.1)' },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: height * 0.06, paddingBottom: 40 },
  headerSection: { alignItems: 'center', marginBottom: 30, position: 'relative' },
  backButton: { position: 'absolute', left: -20, top: 10, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  backButtonText: { fontSize: 20, color: '#ffffff', fontWeight: 'bold' },
  miniAtomContainer: { marginBottom: 20 },
  miniAtom: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', position: 'relative', shadowColor: '#ff6b35', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 15, elevation: 15 },
  miniNucleus: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff', position: 'absolute' },
  miniRing: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 25 },
  miniRing1: { width: 35, height: 35 },
  miniRing2: { width: 45, height: 45, transform: [{ rotate: '45deg' }] },
  miniRing3: { width: 55, height: 55, transform: [{ rotate: '90deg' }] },
  title: { fontSize: 32, fontWeight: '800', color: '#ffffff', textAlign: 'center', marginBottom: 8, letterSpacing: 1, textShadowColor: 'rgba(255, 107, 53, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: 20, letterSpacing: 0.5 },
  divider: { width: 60, height: 2, backgroundColor: '#ff6b35', borderRadius: 1, shadowColor: '#ff6b35', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 4 },
  formContainer: { marginBottom: 30 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8, marginLeft: 4, fontWeight: '600', letterSpacing: 0.5 },
  inputWrapper: { borderRadius: 16, overflow: 'hidden' },
  inputWrapperFocused: { shadowColor: '#ff6b35', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 },
  inputGradient: { padding: 2, borderRadius: 16 },
  input: { backgroundColor: 'rgba(26, 26, 46, 0.8)', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 14, fontSize: 16, color: '#ffffff', fontWeight: '500' },
  passwordStrengthContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginLeft: 4 },
  passwordStrengthBar: { flex: 1, height: 3, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 2, marginRight: 12, overflow: 'hidden' },
  passwordStrengthFill: { height: '100%', borderRadius: 2 },
  passwordStrengthText: { fontSize: 12, fontWeight: '600', minWidth: 50 },
  errorText: { color: '#ff4444', fontSize: 12, marginTop: 4, marginLeft: 4, fontWeight: '500' },
  termsContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10, paddingHorizontal: 4 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 4, marginRight: 12, marginTop: 2, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#ff6b35', borderColor: '#ff6b35' },
  checkmark: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  termsText: { flex: 1, fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 20 },
  termsLink: { color: '#ff6b35', fontWeight: '600', textDecorationLine: 'underline' },
  signUpButtonWrapper: { width: '100%', height: 64, borderRadius: 32, marginBottom: 30, shadowColor: '#ff6b35', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12 },
  signUpButton: { flex: 1, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  buttonGloss: { position: 'absolute', top: 0, left: 0, right: 0, height: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  buttonShadowInner: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: 'rgba(0, 0, 0, 0.2)', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  signUpButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '800', letterSpacing: 2, textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2, zIndex: 1 },
  loginSection: { alignItems: 'center', paddingBottom: 20 },
  loginText: { fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' },
  loginLink: { color: '#ff6b35', fontWeight: '700', letterSpacing: 0.5, textDecorationLine: 'underline' },
});
