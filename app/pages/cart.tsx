import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export default function CartScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (v?: number) => {
    if (v == null) return '—';
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'MKD', maximumFractionDigits: 0 }).format(v);
    } catch {
      return `${v} MKD`;
    }
  };

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await SecureStore.getItemAsync('cart');
      const cart: CartItem[] = raw ? JSON.parse(raw) : [];
      setItems(
        cart.map(it => ({
          ...it,
          quantity: Math.max(1, Number(it.quantity) || 1),
          price: Number(it.price) || 0,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCart = useCallback(
    async (cart: CartItem[]) => {
      setItems(cart);
      await SecureStore.setItemAsync('cart', JSON.stringify(cart));
    },
    []
  );

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const increase = async (id: number) => {
    const cart = items.map(it => (it.id === id ? { ...it, quantity: (it.quantity || 1) + 1 } : it));
    await saveCart(cart);
  };

  const decrease = async (id: number) => {
    const cart = items.map(it => (it.id === id ? { ...it, quantity: Math.max(1, (it.quantity || 1) - 1) } : it));
    await saveCart(cart);
  };

  const removeItem = async (id: number) => {
    const cart = items.filter(it => it.id !== id);
    await saveCart(cart);
  };

  const clearCart = async () => {
    await saveCart([]);
  };

  const total = items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <LinearGradient colors={['#1a1a2e', '#16213e']} style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </LinearGradient>
        )}
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>

        <View style={styles.row}>
          <View style={styles.qtyGroup}>
            <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnLeft]} onPress={() => decrease(item.id)}>
              <Text style={styles.qtyText}>−</Text>
            </TouchableOpacity>
            <View style={styles.qtyMid}>
              <Text style={styles.qtyValue}>{item.quantity}</Text>
            </View>
            <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnRight]} onPress={() => increase(item.id)}>
              <Text style={styles.qtyText}>＋</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#0a0a0a', '#1a1a2e', '#16213e']} style={styles.screen}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.muted}>Loading cart…</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a2e', '#16213e']} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Your cart is empty.</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/Orders')} style={[styles.btn, { marginTop: 10 }]}>
            <Text style={styles.btnText}>Browse products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={it => String(it.id)}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>

            <TouchableOpacity style={[styles.btn, { marginRight: 10 }]} onPress={clearCart}>
              <Text style={styles.btnText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.checkoutBtn]} onPress={() => router.push('/pages/checkout')}>
              <Text style={styles.btnText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingTop: 54, paddingBottom: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  backBtn: { position: 'absolute', left: 16, bottom: 12, padding: 6, paddingHorizontal: 8 },
  backText: { color: '#9ca3af', fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: '#9ca3af' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#0f0f12',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
  },
  imageWrap: { width: 86, height: 86, borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  imagePlaceholderText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  name: { color: '#fff', fontSize: 14, fontWeight: '800' },
  price: { color: '#ffb26b', fontSize: 14, fontWeight: '800', marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  qtyGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  qtyBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#111827' },
  qtyBtnLeft: { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
  qtyBtnRight: { borderTopRightRadius: 10, borderBottomRightRadius: 10 },
  qtyText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  qtyMid: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#0b0f19' },
  qtyValue: { color: '#fff', fontWeight: '800' },
  removeBtn: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1f2937',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  removeText: { color: '#fff', fontWeight: '700' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  totalLabel: { color: '#9ca3af', fontWeight: '700', fontSize: 12 },
  totalValue: { color: '#fff', fontWeight: '900', fontSize: 20 },
  btn: {
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  checkoutBtn: { backgroundColor: '#0b0f19' },
  btnText: { color: '#fff', fontWeight: '800' },
});
