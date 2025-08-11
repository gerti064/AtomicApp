import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FirstScreen from './auth/FirstScreen';
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import ProfileScreen from './auth/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FirstScreen">
        <Stack.Screen
          name="FirstScreen"
          component={FirstScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
