import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'small' | 'medium' | 'large';
}

export const Avatar: React.FC<AvatarProps> = ({name, color, size = 'medium'}) => {
  const getInitials = () => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 64;
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 24;
      default:
        return 18;
    }
  };

  const containerSize = getSize();
  const fontSize = getFontSize();

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor: color,
        },
      ]}>
      <Text style={[styles.initials, {fontSize}]}>{getInitials()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});