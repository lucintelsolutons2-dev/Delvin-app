import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pill from '../components/Pill';
import { CITIES } from '../constants/spots';
import { COLORS } from '../constants/theme';
import { useGuide } from '../context/GuideContext';

export default function SplashScreen({ navigation }) {
  const { activeCity, setActiveCity, guide } = useGuide();
  const savedCount = Object.keys(guide).length;
  const activeCityName = CITIES.find((c) => c.id === activeCity)?.name ?? '—';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.heroSection}>
        <Text style={styles.emoji}>🌍</Text>
        <Text style={styles.appName}>CityDrop</Text>
        <Text style={styles.tagline}>Discover cities like a local.</Text>
        <Text style={styles.subTagline}>
          Browse hidden spots, save the ones you love, and tick them off as you visit.
        </Text>
      </View>

      <View style={styles.citiesContainer}>
        <Text style={styles.label}>Pick a city</Text>
        <View style={styles.cityRow}>
          {CITIES.map((city) => (
            <Pill
              key={city.id}
              tone="dark"
              label={`${city.emoji}  ${city.name}`}
              selected={activeCity === city.id}
              onPress={() => setActiveCity(city.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('SpotsList')}
        >
          <Text style={styles.ctaText}>Explore {activeCityName} →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guideButton}
          onPress={() => navigation.navigate('MyGuide')}
        >
          <Text style={styles.guideText}>
            📖 My Guide {savedCount > 0 ? `(${savedCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
  },
  heroSection: { alignItems: 'center' },
  emoji: { fontSize: 64, marginBottom: 18 },
  appName: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.accent,
    marginBottom: 10,
  },
  subTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 12,
  },
  citiesContainer: { alignItems: 'center' },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  bottomSection: { alignItems: 'center' },
  ctaButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 17,
    paddingHorizontal: 48,
    borderRadius: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
  },
  ctaText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '700',
  },
  guideButton: { paddingVertical: 10 },
  guideText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
});
