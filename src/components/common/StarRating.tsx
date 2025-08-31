/**
 * @fileoverview Interactive star rating component for movie reviews
 * 
 * This component provides a visual star rating interface with:
 * - Interactive star selection (1-5 stars by default)
 * - Visual feedback with filled/outline star states
 * - Callback function for rating changes
 * - Configurable maximum number of stars
 * 
 * Used throughout the app for rating movies and displaying existing ratings.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

/**
 * Props interface for the StarRating component
 * 
 * @interface StarRatingProps
 * @property {number} rating - Current rating value (1-5)
 * @property {(rating: number) => void} onRatingChange - Callback function when rating changes
 * @property {number} [maxStars] - Maximum number of stars to display (defaults to 5)
 */
interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxStars?: number;
}

/**
 * Interactive star rating component
 * 
 * Features include:
 * - Visual star representation with filled/outline states
 * - Touch interaction for rating selection
 * - Configurable star count (defaults to 5 stars)
 * - Consistent theming using primary color
 * - Responsive layout with proper spacing
 * 
 * @param {StarRatingProps} props - Component properties
 * @returns {JSX.Element} Rendered star rating component
 */
const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxStars = 5,
}) => {
  const starArray = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {starArray.map((starNumber) => (
        <TouchableOpacity
          key={starNumber}
          onPress={() => onRatingChange(starNumber)}
        >
          <Icon
            name={starNumber <= rating ? 'star' : 'star-outline'}
            size={40}
            color={colors.primary}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default StarRating;