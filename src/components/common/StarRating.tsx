import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalStyles,colors,spacing } from '../../styles/globalStyles';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxStars?: number;
}

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