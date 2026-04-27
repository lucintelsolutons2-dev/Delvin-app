import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pill from '../components/Pill';
import SpotCard from '../components/SpotCard';
import { CATEGORIES, CITIES } from '../constants/spots';
import { COLORS } from '../constants/theme';
import { useGuide } from '../context/GuideContext';
import { filterSpots, paginate, sortSpots } from '../lib/filterSort';

const SORTS = [
  { id: 'name', label: 'A → Z' },
  { id: 'category', label: 'Category' },
  { id: 'cost', label: 'Cost' },
];

const PAGE_SIZE = 5;

export default function SpotsListScreen({ navigation }) {
  const { allSpots, activeCity, guide } = useGuide();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);

  const cityName = CITIES.find((c) => c.id === activeCity)?.name ?? '';

  const filtered = useMemo(
    () => sortSpots(filterSpots(allSpots, { cityId: activeCity, category, query }), sortBy),
    [allSpots, activeCity, category, query, sortBy]
  );

  const visible = paginate(filtered, page, PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.cityLabel}>📍 {cityName}</Text>
          <Text style={styles.headerTitle}>Hidden Spots</Text>
        </View>
        <TouchableOpacity
          style={styles.myGuideBtn}
          onPress={() => navigation.navigate('MyGuide')}
        >
          <Text style={styles.myGuideBtnText}>
            ★ {Object.keys(guide).length}
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search by name, area, vibe..."
        placeholderTextColor={COLORS.textLight}
        value={query}
        onChangeText={(t) => {
          setQuery(t);
          setPage(1);
        }}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />

      <View style={styles.filterRow}>
        <FlatList
          horizontal
          data={[null, ...CATEGORIES]}
          keyExtractor={(item, idx) => item ?? `all-${idx}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          renderItem={({ item }) => (
            <Pill
              label={item ?? 'All'}
              selected={category === item}
              onPress={() => {
                setCategory(item);
                setPage(1);
              }}
            />
          )}
        />
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort:</Text>
        {SORTS.map((s) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => setSortBy(s.id)}
            style={styles.sortBtn}
          >
            <Text style={[styles.sortText, sortBy === s.id && styles.sortTextActive]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.count}>{filtered.length} found</Text>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SpotCard
            spot={item}
            saved={Boolean(guide[item.id])}
            visited={guide[item.id]?.visited}
            onPress={() => navigation.navigate('SpotDetail', { spotId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No spots match.</Text>
            <Text style={styles.emptyText}>Try clearing the filter or search.</Text>
          </View>
        }
        ListFooterComponent={
          <>
            {hasMore && (
              <TouchableOpacity
                style={styles.loadMore}
                onPress={() => setPage((p) => p + 1)}
              >
                <Text style={styles.loadMoreText}>Show more</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.addCard}
              onPress={() => navigation.navigate('AddSpot')}
            >
              <Text style={styles.addCardPlus}>＋</Text>
              <Text style={styles.addCardText}>Know a hidden spot? Add it</Text>
            </TouchableOpacity>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  back: { fontSize: 22, color: COLORS.primary, fontWeight: '600', width: 24 },
  cityLabel: { fontSize: 13, color: COLORS.textLight, marginBottom: 2 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textDark },
  myGuideBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  myGuideBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  search: {
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
    color: COLORS.textDark,
  },
  filterRow: { marginTop: 12 },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 4,
  },
  sortLabel: { fontSize: 12, color: COLORS.textLight, marginRight: 4 },
  sortBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  sortText: { fontSize: 12, color: COLORS.textMid, fontWeight: '500' },
  sortTextActive: { color: COLORS.primary, fontWeight: '700' },
  count: { marginLeft: 'auto', fontSize: 11, color: COLORS.textLight },
  listContent: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 30 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 36, marginBottom: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  emptyText: { fontSize: 13, color: COLORS.textLight },
  loadMore: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadMoreText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 18,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addCardPlus: { fontSize: 20, color: COLORS.primary, marginRight: 8 },
  addCardText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
});
