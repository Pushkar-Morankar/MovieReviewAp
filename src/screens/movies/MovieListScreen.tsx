import React, { useCallback, useLayoutEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  Button as RNButton,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useMovieContext } from '../../context/MovieContext';
import { MovieListScreenProps } from '../../navigation/types';
import MovieCard from '../../components/cards/MovieCard';
import Loading from '../../components/common/Loading';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';


const ListFooterComponent: React.FC<{ isFetchingMore: boolean }> = ({ isFetchingMore }) => {
  // If we are not fetching more data, we must return null to render nothing.
  if (!isFetchingMore) {
    return null;
  }

  // If we are fetching more data, we return the ActivityIndicator wrapped in a View.
  return (
    <View style={styles.footer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

/**
 * The main screen that displays a list of all movies with infinite scroll functionality.
 */
const MovieListScreen: React.FC<MovieListScreenProps> = ({ navigation }) => {
  const {
    movies,
    isListLoading,   
    error,
    fetchMovies,     
    isFetchingMore,  
    fetchMoreMovies  
  } = useMovieContext();

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RNButton
          title="Add"
          onPress={() => navigation.navigate('AddMovie')}
          color={colors.primary}
        />
      ),
    });
  }, [navigation]);

  // Show a full-screen loading indicator only on the very first load.
  if (isListLoading) {
    return <Loading />;
  }
  
  // Show a full-screen error message if the initial fetch fails.
  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
        <RNButton title="Retry" onPress={fetchMovies} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
          />
        )}
        // --- Infinite Scroll Configuration ---
        onEndReached={fetchMoreMovies}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<ListFooterComponent isFetchingMore={isFetchingMore} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  footer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieListScreen;