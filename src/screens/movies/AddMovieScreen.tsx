import React, { useState } from 'react';
import {
  View, ScrollView, Alert, Text, StyleSheet, TouchableOpacity, FlatList,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AddMovieScreenProps } from '../../navigation/types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import * as movieService from '../../service/movieService';
import { ALL_GENRES } from '../../data/genres';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

const AddMovieScreen: React.FC<AddMovieScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={globalStyles.container}>
        <Formik
          initialValues={{
            title: '',
            description: '',
            genres: [] as number[],
            release_date: '',
            duration: '',
            director: '',
            cast: '',
            poster_url: '', // New field for the image URL
          }}
          validateOnMount={false}
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Title is required'),
            description: Yup.string().required('Description is required'),
            genres: Yup.array().of(Yup.number()).min(1, 'At least one genre is required').required('Genre is required'),
            release_date: Yup.date().required('Release date is required'),
            duration: Yup.number().positive('Duration must be a positive number').required('Duration is required'),
            director: Yup.string().required('Director is required'),
            cast: Yup.string().required('Cast is required'),
            poster_url: Yup.string().url('Please enter a valid URL').required('Poster URL is required'),
          })}
          onSubmit={async (values) => {
            setIsLoading(true);
            try {
              // Send the 'values' object directly as JSON
              await movieService.createMovie(values);
              Alert.alert('Success', 'Movie added successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
            } catch (error: any) {
              // Prettier error display
              const errorData = error.response?.data;
              let errorMessage = 'Could not add the movie. An unknown error occurred.';
              if (errorData) {
                errorMessage = Object.entries(errorData)
                  .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)
                  .join('\n');
              }
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
                <Input
                  label="Poster Image URL"
                  onChangeText={handleChange('poster_url')}
                  onBlur={handleBlur('poster_url')}
                  value={values.poster_url}
                  error={errors.poster_url}
                  touched={touched.poster_url}
                  keyboardType="url"
                  autoCapitalize="none"
                />
                <Input label="Duration (minutes)" onChangeText={handleChange('duration')} onBlur={handleBlur('duration')} value={values.duration} error={errors.duration} touched={touched.duration} keyboardType="numeric" />
                <Input label="Director" onChangeText={handleChange('director')} onBlur={handleBlur('director')} value={values.director} error={errors.director} touched={touched.director} />
                <Input label="Cast (comma separated)" onChangeText={handleChange('cast')} onBlur={handleBlur('cast')} value={values.cast} error={errors.cast} touched={touched.cast} />

                <View style={styles.genreContainer}>
                  <Text style={styles.label}>Genres</Text>
                  <View style={styles.genrePillsContainer}>
                    {values.genres.map((genreId) => {
                       const genre = ALL_GENRES.find((g) => g.id === genreId);
                       if (!genre) return null;
                       return (
                        <View key={genreId} style={styles.genrePill}>
                          <Text style={styles.genrePillText}>{genre.label}</Text>
                          <TouchableOpacity onPress={() => setFieldValue('genres', values.genres.filter((id) => id !== genreId))}>
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

                <Button title="Add Movie" onPress={() => handleSubmit()} loading={isLoading} />

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

export default AddMovieScreen;