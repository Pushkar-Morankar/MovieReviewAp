import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';

// The navigation prop is now from the ProfileStack, allowing navigation to EditProfile
type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  /**
   * Handles the logout process with a confirmation dialog.
   */
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => logout() }
      ]
    );
  };

  // This should not happen if the user is logged in, but it's a safe fallback.
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data found. Please log in again.</Text>
        <Button title="Go to Login" onPress={() => logout()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View style={styles.profileHeader}>
            {user.profile_picture ? (
                <Image source={{ uri: user.profile_picture }} style={styles.avatar} />
            ) : (
                <View style={styles.avatarPlaceholder}>
                    <Icon name="account" size={60} color={colors.primary} />
                </View>
            )}
            <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.actions}>
            {/* This button now correctly navigates to the EditProfile screen */}
            <Button
              title="Edit Profile"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <Button title="Logout" onPress={handleLogout} />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
      alignItems: 'center',
      marginBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: '#e0e0e0', // Add a background color for placeholder
  },
  avatarPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.gray,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
  },
  username: {
      fontSize: 16,
      color: colors.primary,
      marginVertical: 4,
  },
  email: {
    fontSize: 16,
    color: colors.gray,
  },
  actions: {
      width: '80%',
  }
});

export default ProfileScreen;