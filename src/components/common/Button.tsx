/**
 * @fileoverview Reusable button component with loading and disabled states
 * 
 * This component provides a consistent button interface across the app with:
 * - Touchable scale animation for better user feedback
 * - Loading state with activity indicator
 * - Disabled state styling
 * - Consistent theming using global styles
 * 
 * Supports both enabled and disabled states with appropriate visual feedback.
 */

import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ActivityIndicator} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

/**
 * Props interface for the Button component
 * 
 * @interface ButtonProps
 * @property {string} title - Text to display on the button
 * @property {() => void} onPress - Function to call when button is pressed
 * @property {boolean} [loading] - Whether to show loading state (defaults to false)
 * @property {boolean} [disabled] - Whether button is disabled (defaults to false)
 */
interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Reusable button component with enhanced touch feedback
 * 
 * Features include:
 * - Scale animation on touch for better user experience
 * - Loading state with activity indicator
 * - Disabled state with visual feedback
 * - Consistent styling using global theme colors
 * 
 * @param {ButtonProps} props - Component properties
 * @returns {JSX.Element} Rendered button component
 */
const Button: React.FC<ButtonProps> = ({ title, onPress, loading = false, disabled = false }) => {
  return (
    <TouchableScale
      style={[styles.button, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeScale={0.95}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableScale>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: colors.gray,
  },
});

export default Button;