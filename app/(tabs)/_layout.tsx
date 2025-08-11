import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8e8e93',
      }}
    >
      <Tabs.Screen name="Home" options={{ title: 'Home' }} />
      <Tabs.Screen name="Orders" options={{ title: 'Orders' }} />
      <Tabs.Screen name="Profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
