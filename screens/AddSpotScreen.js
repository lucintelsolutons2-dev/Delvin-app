import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pill from '../components/Pill';
import { CATEGORIES, CITIES, VIBES } from '../constants/spots';
import { COLORS } from '../constants/theme';
import { useGuide } from '../context/GuideContext';

const COSTS = ['Free', '£', '££', '£££'];
const CATEGORY_EMOJI = {
  'Street Art': '🎨',
  'Hidden Garden': '🌿',
  Market: '🍴',
  Viewpoint: '🏙️',
  Experience: '🕯️',
  Café: '☕',
};

export default function AddSpotScreen({ navigation }) {
  const { activeCity, addUserSpot } = useGuide();
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [vibe, setVibe] = useState(null);
  const [cost, setCost] = useState('Free');

  const handleSubmit = () => {
    if (!name.trim() || !area.trim() || !description.trim() || !category) {
      Alert.alert('Missing info', 'Please fill in name, area, description and category.');
      return;
    }
    addUserSpot({
      cityId: activeCity,
      name: name.trim(),
      area: area.trim(),
      description: description.trim(),
      category,
      vibe: vibe ?? 'Quirky',
      cost,
      emoji: CATEGORY_EMOJI[category] ?? '📍',
    });
    Alert.alert('✅ Spot added', `${name.trim()} now appears in the ${
      CITIES.find((c) => c.id === activeCity)?.name ?? ''
    } list.`, [{ text: 'Nice!', onPress: () => navigation.goBack() }]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add a Spot</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Spot Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. The Lido Café Rooftop"
          placeholderTextColor={COLORS.textLight}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Area / Neighbourhood *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Bermondsey, SE1"
          placeholderTextColor={COLORS.textLight}
          value={area}
          onChangeText={setArea}
        />

        <Text style={styles.label}>Category *</Text>
        <View style={styles.pillGrid}>
          {CATEGORIES.map((cat) => (
            <Pill
              key={cat}
              label={cat}
              selected={category === cat}
              onPress={() => setCategory(cat)}
            />
          ))}
        </View>

        <Text style={styles.label}>Vibe</Text>
        <View style={styles.pillGrid}>
          {VIBES.map((v) => (
            <Pill key={v} label={v} selected={vibe === v} onPress={() => setVibe(v)} />
          ))}
        </View>

        <Text style={styles.label}>Cost</Text>
        <View style={styles.pillGrid}>
          {COSTS.map((c) => (
            <Pill key={c} label={c} selected={cost === c} onPress={() => setCost(c)} />
          ))}
        </View>

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What makes this spot special? Any tips for visiting?"
          placeholderTextColor={COLORS.textLight}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Add Spot →</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Saved locally to your device. In the final app, submissions would be reviewed before going live.
        </Text>
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
  backBtn: { width: 70 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  headerSpacer: { width: 70 },
  formContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 52 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMid,
    marginBottom: 8,
    marginTop: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textDark,
  },
  textArea: { height: 100, paddingTop: 12 },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 26,
  },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 14,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
