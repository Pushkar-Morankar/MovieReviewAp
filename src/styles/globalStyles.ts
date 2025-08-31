/**
 * @fileoverview Global styling constants and shared styles
 * 
 * This file provides centralized styling resources for the Movie Review App:
 * - Color palette for consistent theming
 * - Spacing values for consistent layout
 * - Common style patterns (shadows, containers, titles)
 * 
 * All styles follow Material Design principles and provide a cohesive
 * visual experience across the application.
 */

import { StyleSheet } from 'react-native';

/**
 * Application color palette
 * 
 * @property {string} primary - Primary brand color
 * @property {string} secondary - Secondary accent color
 * @property {string} background - Main background color
 * @property {string} white - Pure white color
 * @property {string} dark - Dark text color
 * @property {string} gray - Medium gray color
 * @property {string} danger - Error/danger color
 */
export const colors = {
  primary: '#6200ee',
  secondary: '#03dac6',
  background: '#f5f5f5',
  white: '#ffffff',
  dark: '#121212',
  gray: '#888888',
  danger: '#b00020',
};

/**
 * Standard spacing values for consistent layout
 * 
 * @property {number} sm - Small spacing (8px)
 * @property {number} md - Medium spacing (16px)
 * @property {number} lg - Large spacing (24px)
 */
export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
};

/**
 * Global style patterns used throughout the application
 * 
 * @property {Object} shadow - Cross-platform shadow styling
 * @property {Object} container - Standard container layout
 * @property {Object} title - Standard title text styling
 */
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