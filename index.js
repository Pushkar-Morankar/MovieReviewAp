/**
 * @fileoverview React Native application entry point
 * 
 * This file serves as the main entry point for the Movie Review App:
 * - Imports React Native gesture handler for navigation
 * - Registers the main App component with React Native
 * - Sets up the application name from app.json configuration
 * 
 * This is the first file executed when the app starts.
 * 
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
