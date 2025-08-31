import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import { globalStyles,colors, spacing } from '../../styles/globalStyles';

const Loading: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default Loading;