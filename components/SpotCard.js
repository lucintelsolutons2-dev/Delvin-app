import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/theme';

export default function SpotCard({ spot, saved, visited, onPress, onLongPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, visited && styles.cardVisited]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.82}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.emoji}>{spot.emoji}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {spot.name}
          </Text>
          <View style={styles.badges}>
            {saved && <Text style={styles.saved}>★</Text>}
            {visited && <Text style={styles.visited}>✓</Text>}
          </View>
        </View>
        <Text style={styles.meta}>
          {spot.area} · {spot.category} · {spot.cost}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {spot.description}
        </Text>
        <View style={styles.tagRow}>
          <Text style={styles.vibe}>{spot.vibe}</Text>
          {spot.userAdded && <Text style={styles.userTag}>Added by you</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardVisited: {
    opacity: 0.66,
  },
  iconWrap: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.accentLight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
    flexShrink: 0,
  },
  emoji: { fontSize: 24 },
  body: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  saved: {
    color: COLORS.accent,
    fontSize: 16,
  },
  visited: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 5,
  },
  desc: {
    fontSize: 13,
    color: COLORS.textMid,
    lineHeight: 18,
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  vibe: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '700',
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  userTag: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
    backgroundColor: '#E7EAF6',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
