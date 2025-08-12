// app/(tabs)/Orders.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');
const API_URL = 'http://134.122.71.254:4000'; // ⬅️ change to your domain (use HTTPS in production)

type Product = {
  id: number;
  name?: string;
  title?: string;
  price?: number | string;
  image?: string;
  image_url?: string;
  thumbnail?: string;
  description?: string;
};

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Glow like Login
  const glowAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const glowInterpolation = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.6] });

  // Session (optional auth header)
  const loadSession = useCallback(async () => {
    const t = await SecureStore.getItemAsync('token');
    setToken(t ?? null);
  }, []);

  const normalizeList = (raw: any): Product[] => {
    if (Array.isArray(raw)) return raw;
    if (raw?.products && Array.isArray(raw.products)) return raw.products;
    return [];
  };

  const fetchProducts = useCallback(async () => {
    setError(null);
    if (!refreshing) setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const json = await res.json();
      setProducts(normalizeList(json));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, refreshing]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, [fetchProducts]);

  const formatCurrency = (v?: number | string) => {
    if (v == null) return '—';
    const num = typeof v === 'string' ? parseFloat(v) : v;
    if (Number.isNaN(num as number)) return String(v);
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'MKD',
        maximumFractionDigits: 0,
      }).format(num as number);
    } catch {
      return `${num} MKD`;
    }
  };

  const getName = (p: Product) => p.name ?? p.title ?? `#${p.id}`;
  const getPrice = (p: Product) => {
    if (p.price == null) return undefined;
    return typeof p.price === 'string' ? parseFloat(p.price) : p.price;
  };
  const getImage = (p: Product) => p.image ?? p.image_url ?? p.thumbnail ?? '';

  const renderCard = ({ item }: { item: Product }) => {
    const price = getPrice(item);
    const src = getImage(item);

    return (
      <LinearGradient
        colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardOuter}
      >
        <View style={styles.cardInner}>
          {/* Image */}
          <View style={styles.imageWrap}>
            {src ? (
              <Image
                source={{ uri: src }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={['#1a1a2e', '#16213e']}
                style={[styles.image, styles.imagePlaceholder]}
              >
                <Text style={styles.imagePlaceholderText}>No Image</Text>
              </LinearGradient>
            )}
            <View style={styles.imageGloss} />
          </View>

          {/* Info */}
          <Text numberOfLines={1} style={styles.productName}>{getName(item)}</Text>
          <Text style={styles.productPrice}>{formatCurrency(price)}</Text>

          {/* CTA (placeholder) */}
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
            <LinearGradient
              colors={['#ff6b35', '#f7931e', '#ff8c42']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaBtnGrad}
            >
              <Text style={styles.ctaText}>View</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  };

  if (loading && !refreshing) {
    return (
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e', '#1a1a2e', '#0a0a0a']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={styles.screen}
      >
        <Animated.View style={[styles.glowOverlay, { opacity: glowInterpolation }]} />
        <View style={styles.loadWrap}>
          <ActivityIndicator size="large" />
          <Text style={styles.muted}>Loading products…</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a2e', '#16213e', '#1a1a2e', '#0a0a0a']}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      style={styles.screen}
    >
      <Animated.View style={[styles.glowOverlay, { opacity: glowInterpolation }]} />

      {/* Header (matches Login vibe) */}
      <View style={styles.header}>
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
        <Text style={styles.title}>Products</Text>
        <Text style={styles.subtitle}>Browse items from the database</Text>
        <View style={styles.divider} />
      </View>

      {error ? (
        <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={[styles.muted, { textAlign: 'center', marginBottom: 8 }]}>{error}</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={products}
        keyExtractor={(p) => String(p.id)}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.loadWrap}>
            <Text style={styles.muted}>No products found.</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Screen background (like Login)
  screen: {
    flex: 1,
  },
  glowOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },

  // Header (copied vibe from Login)
  header: {
    alignItems: 'center',
    paddingTop: height * 0.07,
    paddingBottom: 14,
  },
  miniAtomContainer: { marginBottom: 16 },
  miniAtom: {
    width: 54, height: 54, borderRadius: 27,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
    shadowColor: '#ff6b35', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 12, elevation: 12,
  },
  miniNucleus: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff', position: 'absolute' },
  miniRing: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 25 },
  miniRing1: { width: 36, height: 36 },
  miniRing2: { width: 46, height: 46, transform: [{ rotate: '45deg' }] },
  title: {
    fontSize: 28, fontWeight: '800', color: '#ffffff', textAlign: 'center',
    marginBottom: 6, letterSpacing: 1,
    textShadowColor: 'rgba(255, 107, 53, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
  },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 12, letterSpacing: 0.5 },
  divider: {
    width: 60, height: 2, backgroundColor: '#ff6b35', borderRadius: 1,
    shadowColor: '#ff6b35', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 4,
  },

  // Loading / empty
  loadWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: '#9ca3af' },

  // Product card
  cardOuter: {
    flex: 1,
    borderRadius: 16,
    padding: 1.5,
    marginBottom: 12,
  },
  cardInner: {
    backgroundColor: '#0f0f12',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  imageWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 140,
    marginBottom: 8,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  imagePlaceholderText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  imageGloss: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  productName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  productPrice: { color: '#ffb26b', fontSize: 14, fontWeight: '800', marginTop: 2 },

  // CTA
  ctaBtn: { marginTop: 10, height: 44, borderRadius: 12, overflow: 'hidden' },
  ctaBtnGrad: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: 12,
  },
  ctaText: {
    color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 1.2,
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },

  // Primary button (reuse for error retry)
  primaryBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 10, marginTop: 6,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});
