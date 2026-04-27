import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SpotCard from '../components/SpotCard';
import { CITIES } from '../constants/spots';
import { COLORS } from '../constants/theme';
import { useGuide } from '../context/GuideContext';
import { buildGuideEntries } from '../lib/guideReducers';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'To visit' },
  { id: 'visited', label: 'Visited' },
];

export default function MyGuideScreen({ navigation }) {
  const { guide, allSpots, removeFromGuide } = useGuide();
  const [filter, setFilter] = useState('all');

  const items = useMemo(
    () => buildGuideEntries(guide, allSpots, { filter }),
    [guide, allSpots, filter]
  );

  const totals = useMemo(() => {
    const all = Object.values(guide);
    return {
      total: all.length,
      visited: all.filter((e) => e.visited).length,
    };
  }, [guide]);

  const cityBreakdown = useMemo(() => {
    const counts = {};
    items.forEach(({ spot }) => {
      counts[spot.cityId] = (counts[spot.cityId] || 0) + 1;
    });
    return Object.entries(counts).map(([cityId, count]) => {
      const city = CITIES.find((c) => c.id === cityId);
      return `${city?.emoji ?? ''} ${city?.name ?? cityId}: ${count}`;
    });
  }, [items]);

  const confirmRemove = (spot) => {
    Alert.alert('Remove from guide?', spot.name, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFromGuide(spot.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Guide</Text>
        <View style={{ width: 56 }} />
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statBlock}>
          <Text style={styles.statNum}>{totals.total}</Text>
          <Text style={styles.statLabel}>saved</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statNum}>{totals.visited}</Text>
          <Text style={styles.statLabel}>visited</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statNum}>
            {totals.total === 0 ? '—' : Math.round((totals.visited / totals.total) * 100) + '%'}
          </Text>
          <Text style={styles.statLabel}>complete</Text>
        </View>
      </View>

      {cityBreakdown.length > 0 && (
        <Text style={styles.breakdown}>{cityBreakdown.join('  ·  ')}</Text>
      )}

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterTab, filter === f.id && styles.filterTabActive]}
            onPress={() => setFilter(f.id)}
          >
            <Text
              style={[styles.filterText, filter === f.id && styles.filterTextActive]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.spot.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SpotCard
            spot={item.spot}
            saved
            visited={item.entry.visited}
            onPress={() => navigation.navigate('SpotDetail', { spotId: item.spot.id })}
            onLongPress={() => confirmRemove(item.spot)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📖</Text>
            <Text style={styles.emptyTitle}>Your guide is empty.</Text>
            <Text style={styles.emptyText}>
              Tap ★ on any spot to start building your personal city guide.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('SpotsList')}
            >
              <Text style={styles.emptyBtnText}>Browse spots</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: { color: COLORS.primary, fontSize: 15, fontWeight: '600', width: 56 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statBlock: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  statNum: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  breakdown: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMid,
    marginTop: 10,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 6,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 13, color: COLORS.textMid, fontWeight: '500' },
  filterTextActive: { color: COLORS.white, fontWeight: '700' },
  list: { paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 20 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  emptyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyBtnText: { color: COLORS.white, fontWeight: '700' },
});
