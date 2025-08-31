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
 * @returns The main application component.
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
 * @returns The root of the application.
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
