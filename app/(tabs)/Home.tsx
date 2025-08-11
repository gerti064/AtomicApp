import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'All', icon: '🛍️' },
  { id: '2', name: 'Luxury', icon: '💎' },
  { id: '3', name: 'Watches', icon: '⌚' },
  { id: '4', name: 'Cars', icon: '🚗' },
];

const quickActions = [
  { id: '1', title: 'New Arrivals', subtitle: 'Latest products', icon: '🆕', color: '#ff6b35' },
  { id: '2', title: 'Best Sellers', subtitle: 'Popular choices', icon: '🔥', color: '#f7931e' },
];

const featuredProducts = [
  {
    id: '1',
    title: 'Luxury Watch',
    description: 'Elegant and classy watch.',
    category: 'Watches',
    price: '$5,000',
    rating: 4.8,
    badge: 'NEW',
    gradient: ['#ff6b35', '#f7931e'],
  },
  {
    id: '2',
    title: 'Sports Car',
    description: 'Fast and stylish.',
    category: 'Cars',
    price: '$120,000',
    rating: 4.9,
    badge: 'HOT',
    gradient: ['#f7931e', '#ffdd00'],
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <LinearGradient
              colors={['#ff6b35', '#f7931e', '#ffdd00']}
              style={styles.brandContainer}
            >
              <Text style={styles.brandText}>ATOMIC</Text>
            </LinearGradient>
          </View>

          <TouchableOpacity style={styles.profileButton}>
            <LinearGradient
              colors={['#ff6b35', '#f7931e']}
              style={styles.profileGradient}
            >
              <Text style={styles.profileIcon}>👤</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <LinearGradient
            colors={['rgba(255, 107, 53, 0.1)', 'rgba(247, 147, 30, 0.1)']}
            style={styles.searchWrapper}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search luxury items..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton}>
              <LinearGradient
                colors={['#ff6b35', '#f7931e']}
                style={styles.filterGradient}
              >
                <Text style={styles.filterIcon}>⚙️</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderCategories = () => (
    <Animated.View style={[
      styles.categoriesSection,
      { opacity: fadeAnim }
    ]}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <LinearGradient
              colors={selectedCategory === category.name
                ? ['#ff6b35', '#f7931e']
                : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)']
              }
              style={styles.categoryGradient}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.name && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderQuickActions = () => (
    <Animated.View style={[
      styles.quickActionsSection,
      { opacity: fadeAnim }
    ]}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity key={action.id} style={styles.quickActionCard}>
            <LinearGradient
              colors={[`${action.color}20`, `${action.color}40`]}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderProductCard = ({ item }) => (
    <Animated.View
      style={[
        styles.productCard,
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
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
        style={styles.productCardGradient}
      >
        {/* Badge */}
        <View style={styles.badgeContainer}>
          <LinearGradient
            colors={item.gradient}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>{item.badge}</Text>
          </LinearGradient>
        </View>

        {/* Product Image Placeholder */}
        <LinearGradient
          colors={item.gradient}
          style={styles.productImage}
        >
          <View style={styles.productImageInner}>
            <Text style={styles.productImageIcon}>🔥</Text>
          </View>
        </LinearGradient>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productDescription}>{item.description}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>

          <View style={styles.productFooter}>
            <View>
              <Text style={styles.productPrice}>{item.price}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingStars}>⭐</Text>
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.addToCartButton}>
              <LinearGradient
                colors={['#ff6b35', '#f7931e']}
                style={styles.addToCartGradient}
              >
                <Text style={styles.addToCartIcon}>🛒</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderFeaturedSection = () => (
    <Animated.View style={[
      styles.featuredSection,
      { opacity: fadeAnim }
    ]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList with scroll disabled to avoid nested scroll warning */}
      <FlatList
        data={featuredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        scrollEnabled={false}  // Important fix here!
      />
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
          {renderCategories()}
          {renderQuickActions()}
          {renderFeaturedSection()}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.floatingButton}>
          <LinearGradient
            colors={['#ff6b35', '#f7931e']}
            style={styles.floatingButtonGradient}
          >
            <Text style={styles.floatingButtonIcon}>💬</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 5,
  },
  brandContainer: {
    paddingHorizontal: 2,
    borderRadius: 2,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '900',
    color: 'transparent',
    letterSpacing: 3,
    textShadowColor: 'rgba(255, 107, 53, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  profileButton: {
    borderRadius: 25,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },

  // Search Styles
  searchContainer: {
    marginTop: 10,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  filterButton: {
    marginLeft: 12,
  },
  filterGradient: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 16,
  },

  // Categories Styles
  categoriesSection: {
    paddingVertical: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 15,
    paddingHorizontal: 20,
    letterSpacing: 1,
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoryButton: {
    marginRight: 15,
    borderRadius: 25,
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
  },
  categoryTextActive: {
    color: '#ffffff',
  },

  // Quick Actions Styles
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
  },
  quickActionGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },

  // Featured Section Styles
  featuredSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllText: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Product Card Styles
  productsList: {
    paddingBottom: 20,
  },
  productCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  productCardGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageInner: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageIcon: {
    fontSize: 40,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
    productDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    lineHeight: 20,
  },
  productCategory: {
    fontSize: 12,
    color: '#ff6b35',
    fontWeight: '600',
    marginBottom: 15,
    letterSpacing: 1,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStars: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  addToCartButton: {
    borderRadius: 25,
  },
  addToCartGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addToCartIcon: {
    fontSize: 18,
  },

  // Floating Button Styles
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 30,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  floatingButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonIcon: {
    fontSize: 24,
  },
});

