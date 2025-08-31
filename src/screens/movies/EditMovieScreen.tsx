/**
 * @fileoverview Movie editing screen with pre-populated form and genre management
 * 
 * This screen provides a comprehensive interface for editing existing movies with:
 * - Pre-populated form fields with current movie data
 * - Movie information editing (title, description, director, cast, duration)
 * - Genre selection and removal with visual pill display
 * - Release date and poster URL editing
 * - Form validation using Yup and Formik
 * - Genre selection modal with available genre filtering
 * - Error handling and user feedback
 * - Navigation back to movie details on success
 * 
 * Integrates with movieService for data fetching and MovieContext for updates.
 * Uses global genres data for consistent genre management throughout the app.
 */

import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MovieStackParamList } from '../../navigation/types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useMovieContext } from '../../context/MovieContext';
import * as movieService from '../../service/movieService';
import { ALL_GENRES } from '../../data/genres';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

type EditMovieScreenProps = NativeStackScreenProps<MovieStackParamList, 'EditMovie'>;

/**
 * Movie editing screen component
 * 
 * Features include:
 * - Pre-populated form with existing movie data
 * - Comprehensive movie information editing
 * - Dynamic genre management with visual feedback
 * - Form validation and error display
 * - Genre selection modal with filtering
 * - Loading states during data fetch and submission
 * - Success/error handling with user feedback
 * 
 * @param {EditMovieScreenProps} props - Navigation and route props
 * @returns {JSX.Element} Rendered edit movie screen
 */
const EditMovieScreen: React.FC<EditMovieScreenProps> = ({ route, navigation }) => {
  const { movieId } = route.params;
  const { updateMovie } = useMovieContext();
  const [movieForEdit, setMovieForEdit] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        const movieData = await movieService.getMovieById(movieId);
        setMovieForEdit(movieData);
      } catch (error) {
        Alert.alert("Error", "Could not fetch movie details for editing.");
        navigation.goBack();
      }
    };
    loadMovieData();
  }, [movieId]);

  useLayoutEffect(() => {
    if (movieForEdit) {
      navigation.setOptions({ title: `Edit "${movieForEdit.title}"` });
    }
  }, [navigation, movieForEdit]);

  if (!movieForEdit) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={globalStyles.container}>
        <Formik
          initialValues={{
            title: movieForEdit.title || '',
            description: movieForEdit.description || '',
            genres: movieForEdit.genres.map((g: any) => g.id) || [],
            release_date: movieForEdit.release_date || '',
            duration: String(movieForEdit.duration) || '',
            director: movieForEdit.director || '',
            cast: movieForEdit.cast || '',
            poster_url: movieForEdit.poster || '',
          }}
          enableReinitialize
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Title is required'),
            description: Yup.string().required('Description is required'),
            genres: Yup.array().of(Yup.number()).min(1, 'At least one genre is required').required('Genre is required'),
            release_date: Yup.date().required('Release date is required'),
            duration: Yup.number().positive('Duration must be positive').required('Duration is required'),
            director: Yup.string().required('Director is required'),
            cast: Yup.string().required('Cast is required'),
            poster_url: Yup.string().url('Please enter a valid URL').required('Poster URL is required'),
          })}
          onSubmit={async (values) => {
            setIsLoading(true);
            try {
              await updateMovie(movieId, values);
              Alert.alert('Success', 'Movie updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : 'Could not update the movie.';
              Alert.alert('Error', errorMessage);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {

            const availableGenres = ALL_GENRES.filter(
              (g) => !values.genres.includes(g.id)
            );

            return (
              <>
                <Input label="Title" onChangeText={handleChange('title')} onBlur={handleBlur('title')} value={values.title} error={errors.title} touched={touched.title} />
                <Input label="Description" onChangeText={handleChange('description')} onBlur={handleBlur('description')} value={values.description} error={errors.description} touched={touched.description} multiline />
                <Input label="Release Date (YYYY-MM-DD)" onChangeText={handleChange('release_date')} onBlur={handleBlur('release_date')} value={values.release_date} error={errors.release_date} touched={touched.release_date} />
                <Input label="Poster Image URL" onChangeText={handleChange('poster_url')} onBlur={handleBlur('poster_url')} value={values.poster_url} error={errors.poster_url} touched={touched.poster_url} keyboardType="url" />
                <Input label="Duration (minutes)" onChangeText={handleChange('duration')} onBlur={handleBlur('duration')} value={values.duration} error={errors.duration} touched={touched.duration} keyboardType="numeric" />
                <Input label="Director" onChangeText={handleChange('director')} onBlur={handleBlur('director')} value={values.director} error={errors.director} touched={touched.director} />
                <Input label="Cast (comma separated)" onChangeText={handleChange('cast')} onBlur={handleBlur('cast')} value={values.cast} error={errors.cast} touched={touched.cast} />

                <View style={styles.genreContainer}>
                  <Text style={styles.label}>Genres</Text>
                  <View style={styles.genrePillsContainer}>
                    {/* --- FIX for Error 1: Explicitly type genreId --- */}
                    {values.genres.map((genreId: number) => {
                       const genre = ALL_GENRES.find((g) => g.id === genreId);
                       if (!genre) return null;
                       return (
                        <View key={genreId} style={styles.genrePill}>
                          <Text style={styles.genrePillText}>{genre.label}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              // --- FIX for Error 2: Explicitly type id ---
                              const newGenres = values.genres.filter((id: number) => id !== genreId);
                              setFieldValue('genres', newGenres);
                            }}
                          >
                            <Icon name="close-circle" size={18} color={colors.white} />
                          </TouchableOpacity>
                        </View>
                      )
                    })}
                  </View>
                  <Button
                    title="Add Genre"
                    onPress={() => setModalVisible(true)}
                  />
                  {touched.genres && errors.genres && <Text style={styles.errorText}>{errors.genres as string}</Text>}
                </View>

                <Button title="Update Movie" onPress={() => handleSubmit()} loading={isLoading} />

                <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.modal}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select a Genre</Text>
                    <FlatList
                      data={availableGenres}
                      keyExtractor={(item) => String(item.id)}
                      style={styles.modalList}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={styles.modalItem} onPress={() => { setFieldValue('genres', [...values.genres, item.id]); setModalVisible(false); }}>
                          <Text>{item.label}</Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={<Text style={styles.emptyListText}>All genres have been selected.</Text>}
                    />
                    <Button title="Cancel" onPress={() => setModalVisible(false)} />
                  </View>
                </Modal>
              </>
            );
          }}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  genreContainer: { marginBottom: 15 },
  label: { fontSize: 14, color: colors.dark, marginBottom: 5 },
  genrePillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, minHeight: 48, borderWidth: 1, borderColor: colors.gray, borderRadius: 8, padding: 5 },
  genrePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 15, paddingVertical: 5, paddingHorizontal: 10, margin: 4 },
  genrePillText: { color: colors.white, marginRight: 5 },
  errorText: { marginTop: 5, color: colors.danger, fontSize: 12 },
  modal: { margin: 0, justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 22, borderRadius: 4, width: '90%', maxHeight: '70%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  modalList: { flexGrow: 1, marginBottom: 10 },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  emptyListText: { textAlign: 'center', padding: 20, color: colors.gray },
});

export default EditMovieScreen;