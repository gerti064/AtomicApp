import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

// Auth screens
import FirstScreen from './auth/FirstScreen';
import Login from './auth/Login';
import ProfileScreen from './auth/ProfileScreen';
import SignUp from './auth/SignUp';

// Shop screens
import Orders from './(tabs)/Orders';
import Cart from './pages/cart';

export type RootStackParamList = {
  FirstScreen: undefined;
  Login: undefined;
  SignUp: undefined;
  Profile: undefined;
  Tabs: undefined;
  Cart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Orders" component={Orders} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FirstScreen">
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Cart" component={Cart} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
