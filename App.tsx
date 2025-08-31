/**
 * @fileoverview Main application entry point and navigation structure
 * 
 * This file serves as the root component for the Movie Review App:
 * - Sets up React Navigation container
 * - Provides authentication and movie context providers
 * - Handles authentication state-based navigation routing
 * - Manages loading states during authentication checks
 * - Configures status bar appearance
 * 
 * The app automatically switches between authentication screens
 * and main app screens based on user authentication status.
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {AuthProvider, useAuth} from './src/context/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import {MovieProvider} from './src/context/MovieContext';
import Loading from './src/components/common/Loading';

/**
 * Root component that decides which navigator to show based on auth state.
 * 
 * Renders either the main app navigator (for authenticated users) or
 * the authentication navigator (for unauthenticated users).
 * Shows loading spinner while checking authentication state.
 * 
 * @returns {JSX.Element} The main application component
 */
const AppContent: React.FC = () => {
  const {user, isLoading} = useAuth();

  // Show a loading spinner while checking auth state
  if (isLoading) {
    return <Loading />;
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
};

/**
 * Main App component that wraps the application with necessary providers.
 * 
 * Sets up the complete application structure with:
 * - Navigation container for routing
 * - Status bar configuration
 * - Authentication context provider
 * - Movie context provider (nested for auth access)
 * - Main app content component
 * 
 * @returns {JSX.Element} The root of the application
 */
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        {/* MovieProvider is nested so it can access AuthContext if needed */}
        <MovieProvider>
          <AppContent />
        </MovieProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
