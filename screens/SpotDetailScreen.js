import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { useGuide } from '../context/GuideContext';

export default function SpotDetailScreen({ route, navigation }) {
  const { spotId } = route.params;
  const { allSpots, guide, toggleSaved, setVisited, setNote } = useGuide();
  const spot = allSpots.find((s) => s.id === spotId);
  const entry = guide[spotId];
  const saved = Boolean(entry);
  const [draftNote, setDraftNote] = useState(entry?.note ?? '');

  if (!spot) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 20 }}>Spot not found.</Text>
      </SafeAreaView>
    );
  }

  const handleSaveToggle = () => {
    toggleSaved(spot);
    if (saved) setDraftNote('');
  };

  const handleNoteBlur = () => {
    if (saved) setNote(spot.id, draftNote);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Spot Details</Text>
        <View style={{ width: 56 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{spot.emoji}</Text>
          <Text style={styles.name}>{spot.name}</Text>
          <Text style={styles.meta}>
            {spot.area} · {spot.category}
          </Text>
          <View style={styles.tagRow}>
            <Text style={styles.vibe}>{spot.vibe}</Text>
            <Text style={styles.cost}>{spot.cost}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>About</Text>
        <Text style={styles.description}>{spot.description}</Text>

        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnSaved]}
          onPress={handleSaveToggle}
        >
          <Text style={[styles.saveText, saved && styles.saveTextSaved]}>
            {saved ? '★ Saved to your guide' : '☆ Save to my guide'}
          </Text>
        </TouchableOpacity>

        {saved && (
          <View style={styles.savedPanel}>
            <View style={styles.visitedRow}>
              <View>
                <Text style={styles.visitedLabel}>Visited</Text>
                <Text style={styles.visitedSub}>Tick once you’ve been</Text>
              </View>
              <Switch
                value={Boolean(entry?.visited)}
                onValueChange={(v) => setVisited(spot.id, v)}
                trackColor={{ false: COLORS.border, true: COLORS.success }}
              />
            </View>

            <Text style={styles.sectionLabel}>Your private note</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="e.g. go on a Sunday morning, ask for Maria"
              placeholderTextColor={COLORS.textLight}
              value={draftNote}
              onChangeText={setDraftNote}
              onBlur={handleNoteBlur}
              multiline
            />
            <Text style={styles.noteHint}>Saved locally on this device.</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.fakeMap}
          onPress={() =>
            Alert.alert(
              '🗺️ Map view',
              'In the final app, this opens an interactive map pinned to the spot with directions and nearby saved places.'
            )
          }
        >
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapLabel}>View on map</Text>
          <Text style={styles.mapSub}>Opens directions in the final app</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: { color: COLORS.primary, fontSize: 15, fontWeight: '600', width: 56 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  body: { padding: 20, paddingBottom: 60 },
  hero: { alignItems: 'center', marginBottom: 18 },
  heroEmoji: { fontSize: 64, marginBottom: 8 },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  meta: { fontSize: 13, color: COLORS.textMid, marginBottom: 10 },
  tagRow: { flexDirection: 'row', gap: 8 },
  vibe: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '700',
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cost: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    backgroundColor: '#E7EAF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMid,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 14,
    marginBottom: 8,
  },
  description: { fontSize: 15, lineHeight: 22, color: COLORS.textDark },
  saveBtn: {
    marginTop: 22,
    paddingVertical: 15,
    borderRadius: 32,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  saveBtnSaved: { backgroundColor: COLORS.successLight },
  saveText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  saveTextSaved: { color: COLORS.success },
  savedPanel: {
    marginTop: 18,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  visitedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  visitedLabel: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  visitedSub: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  noteInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 70,
    textAlignVertical: 'top',
    fontSize: 14,
    color: COLORS.textDark,
  },
  noteHint: { fontSize: 11, color: COLORS.textLight, marginTop: 6 },
  fakeMap: {
    marginTop: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 22,
    alignItems: 'center',
  },
  mapIcon: { fontSize: 26, marginBottom: 4 },
  mapLabel: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  mapSub: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
});
