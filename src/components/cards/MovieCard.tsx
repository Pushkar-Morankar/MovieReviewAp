/**
 * @fileoverview Movie card component for displaying movie information in lists
 * 
 * This component provides a consistent card interface for movie listings with:
 * - Movie poster image with placeholder fallback
 * - Movie title, genres, and release date
 * - Touch interaction for navigation to movie details
 * - Consistent styling using global theme colors
 * - Shadow effects and rounded corners for modern UI
 * 
 * Used in movie lists and search results throughout the app.
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { Movie } from '../../types';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

/**
 * Props interface for the MovieCard component
 * 
 * @interface MovieCardProps
 * @property {Movie} movie - Movie object containing all movie information
 * @property {() => void} onPress - Function to call when card is pressed
 */
interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

/**
 * Movie card component for displaying movie information in lists
 * 
 * Features include:
 * - Movie poster display with placeholder fallback
 * - Movie title with line clamping for consistent layout
 * - Genre display as comma-separated list
 * - Release date information
 * - Touch interaction with scale animation
 * - Consistent styling using global theme colors
 * 
 * Wrapped in a touchable component to handle navigation to movie details.
 * 
 * @param {MovieCardProps} props - Component properties
 * @returns {JSX.Element} Rendered movie card component
 */
const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  return (
    <TouchableScale style={styles.card} onPress={onPress} activeScale={0.98}>
      <Image
        source={{ uri: movie.poster }}
        style={styles.poster}
        defaultSource={require('../../assets/placeholder.jpeg')}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
        <Text style={styles.genre}>{movie.genres.map(g => g.label).join(', ')}</Text>
        <Text style={styles.details}>Release: {movie.release_date}</Text>
      </View>
    </TouchableScale>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    ...globalStyles.shadow,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  genre: {
    fontSize: 14,
    color: colors.primary,
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  details: {
    fontSize: 12,
    color: colors.gray,
  },
});

export default MovieCard;