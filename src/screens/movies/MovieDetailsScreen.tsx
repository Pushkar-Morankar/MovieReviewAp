/**
 * @fileoverview Detailed movie information and review management screen
 * 
 * This screen displays comprehensive movie details and provides:
 * - Full movie information (poster, title, description, cast, director)
 * - User review submission and editing capabilities
 * - Review display for all users with owner-specific actions
 * - Movie editing and deletion for movie owners
 * - Dynamic header buttons based on user permissions
 * - Rating modal integration for review management
 * 
 * Integrates with MovieContext for data management and AuthContext
 * for user permission checking and review ownership.
 */

import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useMovieContext } from '../../context/MovieContext';
import { useAuth } from '../../context/AuthContext';
import { MovieDetailsScreenProps } from '../../navigation/types';
import { Review } from '../../types';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import RatingModal from '../../components/modals/RatingModal';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Movie details screen component
 * 
 * Features include:
 * - Complete movie information display
 * - User review management (add, edit, delete)
 * - Owner-specific movie actions (edit, delete)
 * - Dynamic header configuration
 * - Review listing with user permissions
 * - Loading states and error handling
 * 
 * @param {MovieDetailsScreenProps} props - Navigation and route props
 * @returns {JSX.Element} Rendered movie details screen
 */
const MovieDetailsScreen: React.FC<MovieDetailsScreenProps> = ({ route, navigation }) => {
  const { movieId } = route.params;
  const { user } = useAuth();
  const {
    movie,
    isLoading,
    fetchMovieById,
    addReview,
    deleteMovie,
    deleteReview,
    updateReview
  } = useMovieContext();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userReview = movie?.user_review;

  // Fetch movie data when the screen loads or movieId changes
  useEffect(() => {
    fetchMovieById(movieId);
  }, [movieId]);

  // Handler for deleting the entire movie
  const handleDeleteMovie = () => {
    Alert.alert(
      'Delete Movie',
      'Are you sure you want to permanently delete this movie?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async () => {
            try {
              await deleteMovie(movieId);
              Alert.alert('Success', 'The movie has been deleted.');
              navigation.goBack(); // Navigate back to the movie list
            } catch (error) {
              Alert.alert('Error', 'Could not delete the movie.');
            }
          }
        },
      ]
    );
  };

  // Dynamically set the header buttons based on movie ownership
  useLayoutEffect(() => {
    if (movie && user) {
      const isMovieOwner = user.id === movie.created_by;
      navigation.setOptions({
        title: movie.title, // Set the title here as well
        headerRight: () => (
          isMovieOwner && (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditMovie', { movieId: movie.id })}
                style={styles.headerButton}
              >
                <Icon name="pencil" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteMovie}
                style={styles.headerButton}
              >
                <Icon name="delete" size={24} color={colors.danger} />
              </TouchableOpacity>
            </View>
          )
        ),
      });
    }
  }, [navigation, movie, user]); // Re-run effect if any of these dependencies change

  const handleReviewSubmit = async (values: { rating: number; comment: string }) => {
    setIsSubmitting(true);
    try {
      if (userReview) {
        await updateReview(userReview.id, values, movieId);
        Alert.alert('Success', 'Your review has been updated!');
      } else {
        await addReview(movieId, values);
        Alert.alert('Success', 'Your review has been submitted!');
      }
      setModalVisible(false);
    } catch (err: any) {
      const responseData = err.response?.data;
      const errorMessage = responseData ? Object.values(responseData).flat().join('\n') : 'An error occurred.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = (review: Review) => {
    Alert.alert('Delete Review', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: async () => {
        try {
          await deleteReview(review.id, movieId);
          Alert.alert('Success', 'Your review has been deleted.');
        } catch (error) {
          Alert.alert('Error', 'Could not delete the review.');
        }
      }},
    ]);
  };

  // Show a loading indicator while the movie data is being fetched
  if (isLoading || !movie) {
    return <Loading />;
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <Image source={{ uri: movie.poster }} style={styles.poster} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.info}>
            {movie.release_date} • {movie.genres.map(g => g.label).join(', ')} • {movie.duration} min
          </Text>
          <Text style={styles.description}>{movie.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Director</Text>
            <Text>{movie.director}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <Text>{movie.cast}</Text>
          </View>

          <View style={styles.actionButtonContainer}>
            {userReview ? (
              <Button
                title="Edit Your Review"
                onPress={() => setModalVisible(true)}
              />
            ) : (
              <Button
                title="Rate this Movie"
                onPress={() => setModalVisible(true)}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {movie.reviews && movie.reviews.length > 0 ? (
              movie.reviews.map(review => {
                const isReviewOwner = user && user.id === review.user;
                return (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewRating}>Rating: {review.rating}/5</Text>
                      {isReviewOwner && (
                        <TouchableOpacity onPress={() => handleDeleteReview(review)}>
                          <Icon name="delete" size={22} color={colors.danger} />
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text>{review.comment}</Text>
                    <Text style={styles.reviewUser}>- {review.user_name}</Text>
                  </View>
                );
              })
            ) : (
              <Text>No reviews yet.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <RatingModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleReviewSubmit}
        isLoading={isSubmitting}
        initialValues={userReview ? { rating: userReview.rating, comment: userReview.comment || '' } : undefined}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  poster: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.dark,
  },
  info: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.dark,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    paddingBottom: 4,
    color: colors.dark,
  },
  actionButtonContainer: {
    marginVertical: 16,
  },
  reviewCard: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    ...globalStyles.shadow,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewRating: {
    fontWeight: 'bold',
    color: colors.dark,
  },
  reviewUser: {
    fontStyle: 'italic',
    textAlign: 'right',
    marginTop: 8,
    fontSize: 12,
    color: colors.gray,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginHorizontal: 12,
  },
});

export default MovieDetailsScreen;