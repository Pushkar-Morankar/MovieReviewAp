/**
 * @fileoverview Reusable input component with validation and error handling
 * 
 * This component provides a consistent input interface across the app with:
 * - Label display above input field
 * - Error state handling and display
 * - Touch state tracking for validation
 * - Consistent styling using global theme colors
 * 
 * Extends React Native's TextInput with additional validation features
 * and error display capabilities.
 */

import React from 'react';
import {View, TextInput, Text, StyleSheet, TextInputProps} from 'react-native';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

/**
 * Props interface for the Input component
 * 
 * @interface InputProps
 * @extends TextInputProps - Inherits all standard TextInput properties
 * @property {string} label - Label text displayed above the input field
 * @property {any} [error] - Error message or error object to display
 * @property {any} [touched] - Touch state indicator for validation timing
 */
interface InputProps extends TextInputProps {
  label: string;
  error?: any; 
  touched?: any;
}

/**
 * Enhanced input component with validation and error display
 * 
 * Features include:
 * - Label display above input field
 * - Error state handling with visual feedback
 * - Touch state tracking for validation timing
 * - Error message display below input when validation fails
 * - Consistent styling using global theme colors
 * 
 * @param {InputProps} props - Component properties
 * @returns {JSX.Element} Rendered input component
 */
const Input: React.FC<InputProps> = ({ label, error, touched, ...props }) => {
  
  const isTouched = !!touched;
  let errorMessage: string | undefined;

  if (error) {
    if (typeof error === 'string') {
      errorMessage = error; 
    } else if (Array.isArray(error)) {
      errorMessage = error.join('; ');
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }
  }

  const isError = isTouched && errorMessage;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isError && styles.errorBorder]}
        placeholderTextColor={colors.gray}
        {...props}
      />
      {isError && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: colors.dark,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  errorBorder: {
    borderColor: colors.danger,
  },
  errorText: {
    marginTop: 5,
    color: colors.danger,
    fontSize: 12,
  },
});

export default Input;