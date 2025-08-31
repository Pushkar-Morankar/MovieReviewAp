// src/screens/auth/RegisterScreen.tsx

import React, { useState } from 'react';
// CORRECTED: Import SafeAreaView and ScrollView
import { View, Text, Alert, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import { RegisterSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { RegisterScreenProps } from '../../navigation/types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

/**
 * Screen for new user registration.
 * @param {RegisterScreenProps} props - Navigation props.
 * @returns The register screen component.
 */
const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  return (
    // UPDATED: Wrap with SafeAreaView for proper spacing
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={globalStyles.container}>
        <Text style={globalStyles.title}>Create Account</Text>
        <Formik
          initialValues={{
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            password_confirm: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values) => {
            setIsLoading(true);
            try {
              await register(values);
            } catch (error: any) {
              // --- START: IMPROVED ERROR HANDLING ---

              // 1. Log the entire error object to your terminal/console. THIS IS THE MOST IMPORTANT STEP.
              console.error("REGISTRATION FAILED:", JSON.stringify(error, null, 2));

              let errorMessage = 'An unexpected error occurred. Please try again.';

              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const responseData = error.response.data;
                if (typeof responseData === 'object' && responseData !== null) {
                    // Handle Django's typical {field: [errors]} format
                    errorMessage = Object.values(responseData).flat().join('\n');
                } else if (responseData) {
                    // Handle other error formats (e.g., a simple string)
                    errorMessage = responseData.detail || responseData;
                }
              } else if (error.request) {
                // The request was made but no response was received
                // This is a network error.
                errorMessage = 'Could not connect to the server. Please check your network connection.';
              } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = error.message;
              }

              Alert.alert('Registration Failed', errorMessage);
              // --- END: IMPROVED ERROR HANDLING ---
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {/* Formik content remains the same... */}
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <Input
                label="Username"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                error={errors.username}
                touched={touched.username}
              />
              <Input
                label="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                error={errors.email}
                touched={touched.email}
                keyboardType="email-address"
              />
              <Input
                label="First Name"
                onChangeText={handleChange('first_name')}
                onBlur={handleBlur('first_name')}
                value={values.first_name}
                error={errors.first_name}
                touched={touched.first_name}
              />
              <Input
                label="Last Name"
                onChangeText={handleChange('last_name')}
                onBlur={handleBlur('last_name')}
                value={values.last_name}
                error={errors.last_name}
                touched={touched.last_name}
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
              <Input
                label="Confirm Password"
                onChangeText={handleChange('password_confirm')}
                onBlur={handleBlur('password_confirm')}
                value={values.password_confirm}
                error={errors.password_confirm}
                touched={touched.password_confirm}
                secureTextEntry
              />
              <Button title="Register" onPress={() => handleSubmit()} loading={isLoading} />
            </>
          )}
        </Formik>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Style for the new SafeAreaView wrapper
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  linkText: {
    textAlign: 'center',
    color: colors.primary,
    marginTop: 15,
    marginBottom: 30,
  }
});

export default RegisterScreen;