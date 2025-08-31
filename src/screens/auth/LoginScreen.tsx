/**
 * @fileoverview User authentication login screen
 * 
 * This screen provides the login interface for existing users with:
 * - Email and password input fields
 * - Form validation using Yup and Formik
 * - Authentication state management via AuthContext
 * - Error handling and user feedback
 * - Navigation to registration screen
 * - Loading states during authentication
 * 
 * Uses global styles and common components for consistent UI.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import { LoginSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { LoginScreenProps } from '../../navigation/types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

/**
 * Screen for user login.
 * @param {LoginScreenProps} props - Navigation props.
 * @returns The login screen component.
 */
const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Welcome Back!</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          setIsLoading(true);
          try {
            await login(values);
          } catch (error: any) {
            Alert.alert('Login Failed', error.response?.data?.detail || 'An unexpected error occurred.');
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Input
              label="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={errors.email}
              touched={touched.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={errors.password}
              touched={touched.password}
              secureTextEntry
            />
            <Button title="Login" onPress={() => handleSubmit()} loading={isLoading} />
          </>
        )}
      </Formik>
       <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    linkText: {
        textAlign: 'center',
        color: colors.primary,
        marginTop: 15,
    }
})

export default LoginScreen;