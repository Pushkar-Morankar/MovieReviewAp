import React from 'react';
import {View, TextInput, Text, StyleSheet, TextInputProps} from 'react-native';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

interface InputProps extends TextInputProps {
  label: string;
  error?: any; 
  touched?: any;
}

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