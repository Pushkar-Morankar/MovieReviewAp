import { DrawerScreenProps } from '@react-navigation/drawer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

// --- AUTH STACK ---
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// --- MOVIE STACK ---
export type MovieStackParamList = {
  MovieList: undefined;
  MovieDetails: { movieId: number };
  AddMovie: undefined;
  EditMovie: { movieId: number };
};

// --- PROFILE STACK ---
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};

// --- APP DRAWER (THE MAIN NAVIGATOR) ---
export type AppDrawerParamList = {
  Home: NavigatorScreenParams<MovieStackParamList>;

  // "ProfileStack" is a drawer item that contains the ENTIRE ProfileStack.
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};



// Auth Screens
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

// Movie Screens
export type MovieListScreenProps = NativeStackScreenProps<MovieStackParamList, 'MovieList'>;
export type MovieDetailsScreenProps = NativeStackScreenProps<MovieStackParamList, 'MovieDetails'>;
export type AddMovieScreenProps = NativeStackScreenProps<MovieStackParamList, 'AddMovie'>;
export type EditMovieScreenProps = NativeStackScreenProps<MovieStackParamList, 'EditMovie'>;

// Profile Screens
export type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;
export type EditProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;