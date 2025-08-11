import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  Switch
} from 'react-native';
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

const profileStats = [
  { id: '1', label: 'Orders', value: '24', icon: '📦' },
  { id: '2', label: 'Wishlist', value: '8', icon: '❤️' },
  { id: '3', label: 'Reviews', value: '12', icon: '⭐' },
  { id: '4', label: 'Points', value: '1,250', icon: '🏆' },
];

const menuItems = [
  { id: '1', title: 'Order History', subtitle: 'View past purchases', icon: '📋', color: '#ff6b35' },
  { id: '2', title: 'Wishlist', subtitle: 'Saved items', icon: '💝', color: '#f7931e' },
  { id: '3', title: 'Premium Club', subtitle: 'VIP membership benefits', icon: '👑', color: '#667eea' },
  { id: '4', title: 'Payment Methods', subtitle: 'Manage cards & payments', icon: '💳', color: '#4facfe' },
  { id: '5', title: 'Shipping Address', subtitle: 'Delivery locations', icon: '📍', color: '#f093fb' },
  { id: '6', title: 'Notifications', subtitle: 'App preferences', icon: '🔔', color: '#43e97b' },
  { id: '7', title: 'Support', subtitle: '24/7 customer service', icon: '💬', color: '#fa709a' },
  { id: '8', title: 'About Atomic', subtitle: 'Learn more about us', icon: 'ℹ️', color: '#a8edea' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [isPremiumMember, setIsPremiumMember] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for premium badge
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

    if (isPremiumMember) {
      pulseLoop.start();
    }

    return () => pulseLoop.stop();
  }, [isPremiumMember]);

  const renderHeader = () => (
    <Animated.View style={[
      styles.header,
      {
        opacity: fadeAnim,
        transform: [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, 0],
          }),
        }],
      }
    ]}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0a0a0a']}
        style={styles.headerGradient}
      >
        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#ff6b35', '#f7931e', '#ffdd00']}
            style={styles.avatarBorder}
          >
            <View style={styles.avatar}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.avatarInner}
              >
                <Text style={styles.avatarText}>JD</Text>
              </LinearGradient>
            </View>
          </LinearGradient>
          
          {/* Premium Badge */}
          {isPremiumMember && (
            <Animated.View style={[
              styles.premiumBadge,
              { transform: [{ scale: pulseAnim }] }
            ]}>
              <LinearGradient
                colors={['#ffdd00', '#f7931e']}
                style={styles.premiumBadgeGradient}
              >
                <Text style={styles.premiumBadgeText}>👑</Text>
              </LinearGradient>
            </Animated.View>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@atomic.com</Text>
          <View style={styles.membershipContainer}>
            <LinearGradient
              colors={isPremiumMember ? ['#ffdd00', '#f7931e'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.2)']}
              style={styles.membershipBadge}
            >
              <Text style={[
                styles.membershipText,
                { color: isPremiumMember ? '#000' : '#fff' }
              ]}>
                {isPremiumMember ? 'PREMIUM MEMBER' : 'STANDARD MEMBER'}
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Settings Button */}
        <TouchableOpacity style={styles.settingsButton}>
          <LinearGradient
            colors={['rgba(255, 107, 53, 0.2)', 'rgba(247, 147, 30, 0.2)']}
            style={styles.settingsGradient}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const renderStats = () => (
    <Animated.View style={[
      styles.statsSection,
      { opacity: fadeAnim }
    ]}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
        style={styles.statsContainer}
      >
        <View style={styles.statsGrid}>
          {profileStats.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderQuickActions = () => (
    <Animated.View style={[
      styles.quickActionsSection,
      { opacity: fadeAnim }
    ]}>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <LinearGradient
            colors={['#ff6b35', '#f7931e']}
            style={styles.quickActionGradient}
          >
            <Text style={styles.quickActionIcon}>🛒</Text>
            <Text style={styles.quickActionText}>Shop Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionButton}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.quickActionGradient}
          >
            <Text style={styles.quickActionIcon}>🎁</Text>
            <Text style={styles.quickActionText}>Rewards</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionButton}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.quickActionGradient}
          >
            <Text style={styles.quickActionIcon}>📞</Text>
            <Text style={styles.quickActionText}>Support</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderMenuItem = (item, index) => (
    <Animated.View
      key={item.id}
      style={[
        styles.menuItem,
        {
          opacity: fadeAnim,
          transform: [{
            translateX: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [width, 0],
            }),
          }],
        }
      ]}
    >
      <TouchableOpacity style={styles.menuItemTouchable}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
          style={styles.menuItemGradient}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuItemIcon, { backgroundColor: `${item.color}20` }]}>
              <Text style={styles.menuItemIconText}>{item.icon}</Text>
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
          <View style={styles.menuItemArrow}>
            <Text style={styles.arrowIcon}>➤</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderPreferences = () => (
    <Animated.View style={[
      styles.preferencesSection,
      { opacity: fadeAnim }
    ]}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      
      <View style={styles.preferenceItem}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
          style={styles.preferenceGradient}
        >
          <View style={styles.preferenceLeft}>
            <Text style={styles.preferenceIcon}>🔔</Text>
            <View>
              <Text style={styles.preferenceTitle}>Push Notifications</Text>
              <Text style={styles.preferenceSubtitle}>Get updates on orders & offers</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#ff6b35' }}
            thumbColor={notificationsEnabled ? '#f7931e' : '#f4f3f4'}
          />
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderLogoutSection = () => (
    <Animated.View style={[
      styles.logoutSection,
      { opacity: fadeAnim }
    ]}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/auth/FirstScreen")}
      >
        <LinearGradient
          colors={['#ff4757', '#ff3742']}
          style={styles.logoutGradient}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Sign Out</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0 • Built with ❤️</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e', '#1a1a2e', '#0a0a0a']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={styles.backgroundGradient}
      >
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {renderHeader()}
          {renderStats()}
          {renderQuickActions()}
          
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </View>

          {renderPreferences()}
          {renderLogoutSection()}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },

  // Header Styles
  header: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    position: 'relative',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    overflow: 'hidden',
  },
  avatarInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 2,
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
    right: width * 0.25,
    borderRadius: 20,
  },
  premiumBadgeGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffdd00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumBadgeText: {
    fontSize: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 107, 53, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  membershipContainer: {
    marginTop: 8,
  },
  membershipBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#ffdd00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    borderRadius: 25,
  },
  settingsGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  settingsIcon: {
    fontSize: 20,
  },

  // Stats Styles
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statsContainer: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Quick Actions Styles
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  quickActionGradient: {
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },

  // Menu Styles
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 15,
    letterSpacing: 1,
  },
  menuItem: {
    marginBottom: 12,
    borderRadius: 15,
  },
  menuItemTouchable: {
    borderRadius: 15,
  },
  menuItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemIconText: {
    fontSize: 18,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
  menuItemArrow: {
    marginLeft: 10,
  },
  arrowIcon: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },

  // Preferences Styles
  preferencesSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  preferenceItem: {
    borderRadius: 15,
  },
  preferenceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  preferenceSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Logout Styles
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoutGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});