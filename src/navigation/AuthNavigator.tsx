/**
 * @fileoverview Authentication navigation structure
 * 
 * This file defines the navigation stack for unauthenticated users:
 * - Login screen for existing users
 * - Registration screen for new users
 * 
 * Implements a simple stack navigation pattern for authentication flow
 * with no headers for a clean, focused user experience.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Authentication navigator component
 * 
 * Manages navigation between authentication screens:
 * - Login screen (initial screen)
 * - Registration screen
 * 
 * Configured with no headers for a streamlined authentication experience.
 * 
 * @returns {JSX.Element} Authentication stack navigator
 */
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;