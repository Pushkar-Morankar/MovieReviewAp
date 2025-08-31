import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#6200ee',
  secondary: '#03dac6',
  background: '#f5f5f5',
  white: '#ffffff',
  dark: '#121212',
  gray: '#888888',
  danger: '#b00020',
};

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
};

export const globalStyles = StyleSheet.create({
  
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    container: {
      flex: 1,
      padding: spacing.md,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.dark,
      marginBottom: spacing.md,
    },
  });