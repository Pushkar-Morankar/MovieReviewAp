import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../common/Input';
import Button from '../common/Button';
import StarRating from '../common/StarRating';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

interface RatingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (values: { rating: number; comment: string }) => void;
  isLoading: boolean;
  initialValues?: { rating: number; comment: string };
}

const RatingSchema = Yup.object().shape({
  rating: Yup.number()
    .required('Rating is required')
    .min(1, 'Please select at least one star')
    .max(5, 'Rating must be between 1 and 5'),
  comment: Yup.string(),
});

const RatingModal: React.FC<RatingModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  isLoading,
  initialValues = { rating: 0, comment: '' }
}) => {
  return (
    <Modal
      isVisible={isVisible} 
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {initialValues.rating > 0 ? 'Update your Review' : 'Rate this Movie'}
        </Text>
        <Formik
          initialValues={initialValues}
          validationSchema={RatingSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <>
              <Text style={styles.label}>Rating</Text>
              <StarRating
                rating={values.rating}
                onRatingChange={(newRating) => setFieldValue('rating', newRating)}
              />
              {touched.rating && errors.rating && (
                  <Text style={styles.errorText}>{errors.rating}</Text>
              )}

              <Input
                label="Comment (Optional)"
                onChangeText={handleChange('comment')}
                onBlur={handleBlur('comment')}
                value={values.comment}
                error={errors.comment}
                touched={touched.comment}
                multiline
              />
              <Button title="Submit Review" onPress={() => handleSubmit()} loading={isLoading} />
            </>
          )}
        </Formik>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: colors.white,
    padding: 22,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 5,
  },
  errorText: {
    textAlign: 'center',
    color: colors.danger,
    fontSize: 12,
    marginBottom: 10,
  },
});

export default RatingModal;