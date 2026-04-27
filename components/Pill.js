import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';

export default function Pill({ label, selected, onPress, tone = 'light' }) {
  const isDark = tone === 'dark';
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.pill,
        isDark ? styles.pillDark : styles.pillLight,
        selected && (isDark ? styles.pillDarkSelected : styles.pillLightSelected),
      ]}
    >
      <Text
        style={[
          styles.text,
          isDark ? styles.textDark : styles.textLight,
          selected && (isDark ? styles.textDarkSelected : styles.textLightSelected),
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillLight: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  pillLightSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillDark: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  pillDarkSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
  textLight: {
    color: COLORS.textMid,
  },
  textLightSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  textDark: {
    color: COLORS.white,
  },
  textDarkSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
