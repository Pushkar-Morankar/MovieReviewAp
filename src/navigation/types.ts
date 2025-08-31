/**
 * @fileoverview Navigation type definitions for React Navigation
 * 
 * This file defines TypeScript types for navigation parameters and screen props
 * across different navigation stacks in the Movie Review App:
 * - Authentication stack (Login/Register)
 * - Movie management stack (List/Details/Add/Edit)
 * - Profile management stack (Profile/Edit)
 * - Main app drawer navigation
 * 
 * Uses React Navigation v6 types for type-safe navigation.
 */

import { DrawerScreenProps } from '@react-navigation/drawer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

// --- AUTH STACK ---
/**
 * Parameter list for the authentication navigation stack
 * Contains screens for user login and registration
 */
export type AuthStackParamList = {
  /** Login screen with no required parameters */
  Login: undefined;
  /** Registration screen with no required parameters */
  Register: undefined;
};

// --- MOVIE STACK ---
/**
 * Parameter list for the movie management navigation stack
 * Contains screens for movie listing, details, creation, and editing
 */
export type MovieStackParamList = {
  /** Movie list screen with no required parameters */
  MovieList: undefined;
  /** Movie details screen requiring a movie ID parameter */
  MovieDetails: { movieId: number };
  /** Add new movie screen with no required parameters */
  AddMovie: undefined;
  /** Edit existing movie screen requiring a movie ID parameter */
  EditMovie: { movieId: number };
};

// --- PROFILE STACK ---
/**
 * Parameter list for the profile management navigation stack
 * Contains screens for viewing and editing user profile
 */
export type ProfileStackParamList = {
  /** Profile view screen with no required parameters */
  Profile: undefined;
  /** Profile editing screen with no required parameters */
  EditProfile: undefined;
};

// --- APP DRAWER (THE MAIN NAVIGATOR) ---
/**
 * Parameter list for the main app drawer navigation
 * Contains nested stack navigators for different app sections
 */
export type AppDrawerParamList = {
  /** Home section containing the movie management stack */
  Home: NavigatorScreenParams<MovieStackParamList>;

  /** Profile section containing the profile management stack */
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Auth Screens
/**
 * Props type for the Login screen component
 */
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

/**
 * Props type for the Register screen component
 */
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

// Movie Screens
/**
 * Props type for the MovieList screen component
 */
export type MovieListScreenProps = NativeStackScreenProps<MovieStackParamList, 'MovieList'>;

/**
 * Props type for the MovieDetails screen component
 */
export type MovieDetailsScreenProps = NativeStackScreenProps<MovieStackParamList, 'MovieDetails'>;

/**
 * Props type for the AddMovie screen component
 */
export type AddMovieScreenProps = NativeStackScreenProps<MovieStackParamList, 'AddMovie'>;

/**
 * Props type for the EditMovie screen component
 */
export type EditMovieScreenProps = NativeStackScreenProps<MovieStackParamList, 'EditMovie'>;

// Profile Screens
/**
 * Props type for the Profile screen component
 */
export type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

/**
 * Props type for the EditProfile screen component
 */
export type EditProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;