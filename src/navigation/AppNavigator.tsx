import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerActions, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppDrawerParamList, MovieStackParamList, ProfileStackParamList } from './types';
import MovieListScreen from '../screens/movies/MovieListScreen';
import MovieDetailsScreen from '../screens/movies/MovieDetailsScreen';
import AddMovieScreen from '../screens/movies/AddMovieScreen';
import EditMovieScreen from '../screens/movies/EditMovieScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import { globalStyles,colors } from '../styles/globalStyles';

const Drawer = createDrawerNavigator<AppDrawerParamList>();
const MovieStack = createNativeStackNavigator<MovieStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const createDrawerButton = (navigation: NavigationProp<any>) => (
  <TouchableOpacity
    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    style={{ marginLeft: 15 }}
  >
    <Icon name="menu" size={25} color={colors.dark} />
  </TouchableOpacity>
);

const MovieStackNavigator: React.FC = () => {
  return (
    <MovieStack.Navigator>
      <MovieStack.Screen
        name="MovieList"
        component={MovieListScreen}
        options={({ navigation }) => ({
          title: 'Movies',
          headerLeft: () => createDrawerButton(navigation as any),
        })}
      />
      <MovieStack.Screen name="MovieDetails" component={MovieDetailsScreen} />
      <MovieStack.Screen name="AddMovie" component={AddMovieScreen} options={{ title: 'Add a New Movie' }}/>
      <MovieStack.Screen name="EditMovie" component={EditMovieScreen} options={{ title: 'Edit Movie' }} />
    </MovieStack.Navigator>
  );
};

const ProfileStackNavigator: React.FC = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: 'My Profile',
          headerLeft: () => createDrawerButton(navigation as any),
        })}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
    </ProfileStack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="Home"
        component={MovieStackNavigator}
        options={{ title: 'Movies' }}
      />
      <Drawer.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigator;