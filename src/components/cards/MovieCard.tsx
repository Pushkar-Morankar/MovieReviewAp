import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { Movie } from '../../types';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

/**
 * A card component to display movie information in a list.
 * It is wrapped in a touchable component to handle navigation.
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