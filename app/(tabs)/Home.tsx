import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const data = [
  {
    id: '1',
    title: 'Fitness Burger',
    price: '15$',
    category: 'Fast Food',
    time: '15-25 min',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Ciabatta Sandwich',
    price: '12$',
    category: 'Fast Food',
    time: '15-25 min',
    rating: 4.7,
  },
  {
    id: '3',
    title: 'Double Burger',
    price: '17$',
    category: 'Fast Food',
    time: '15-25 min',
    rating: 4.8,
  },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Damaska</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for restaurants or food..."
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Image removed */}
            <View style={styles.cardContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDetails}>{item.category} · {item.time}</Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
            </View>
            <Text style={styles.price}>{item.price}</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FF4B00', marginBottom: 10 },
  searchInput: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFE5D1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  // image styles removed
  cardContent: { flex: 1 },
  itemTitle: { fontWeight: 'bold', fontSize: 16, color: '#FF4B00' },
  itemDetails: { color: '#555', fontSize: 12, marginTop: 2 },
  rating: { marginTop: 4, color: '#FFB500', fontWeight: 'bold' },
  price: { fontWeight: 'bold', color: '#FF4B00', marginRight: 10 },
  addButton: {
    backgroundColor: '#FF4B00',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 18 },
});
