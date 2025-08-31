/**
 * @fileoverview Loading indicator component for async operations
 * 
 * This component provides a consistent loading interface across the app:
 * - Centered loading spinner with large size
 * - Uses primary theme color for consistency
 * - Full-screen background for overlay loading states
 * 
 * Commonly used during API calls, data fetching, and other async operations.
 */

import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import { globalStyles,colors, spacing } from '../../styles/globalStyles';

/**
 * Loading indicator component
 * 
 * Displays a centered loading spinner with the app's primary color.
 * Used to indicate that an operation is in progress, typically
 * during API calls or data loading operations.
 * 
 * @returns {JSX.Element} Rendered loading component
 */
const Loading: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default Loading;