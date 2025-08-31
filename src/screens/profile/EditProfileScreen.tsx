import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { globalStyles } from '../../styles/globalStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';

type EditProfileProps = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

const EditProfileSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  // You could add username validation if your backend allows it
  // username: Yup.string().min(3, 'Username is too short').required('Username is required'),
});

const EditProfileScreen: React.FC<EditProfileProps> = ({ navigation }) => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // If for some reason there is no user, don't render the form.
  if (!user) {
    // Optionally, navigate back or show a message
    return null;
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Formik
        // Pre-populate the form with the current user's data from the AuthContext
        initialValues={{
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          // username: user.username || '',
        }}
        validationSchema={EditProfileSchema}
        onSubmit={async (values) => {
          setIsLoading(true);
          const formData = new FormData();

          // Append all form values to the FormData object
          // We use FormData to be consistent with the backend, which can handle file uploads
          Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
});
          
          // NOTE: If you were adding a profile picture, you would
          // use a library like react-native-image-picker and append
          // the image file to formData here.

          try {
            await updateProfile(formData);
            Alert.alert('Success', 'Your profile has been updated.', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          } catch (error: any) {
            const errorData = error.response?.data;
            let errorMessage = 'Could not update profile. An unknown error occurred.';
            if (errorData) {
              errorMessage = Object.entries(errorData)
                .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)
                .join('\n');
            }
            Alert.alert('Error', errorMessage);
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
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
            {/* Example of a disabled field:
            <Input
              label="Username (cannot be changed)"
              value={values.username}
              editable={false} // Make the field non-editable
            />
            */}
            <View style={styles.buttonContainer}>
              <Button title="Save Changes" onPress={() => handleSubmit()} loading={isLoading} />
            </View>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
  }
})

export default EditProfileScreen;