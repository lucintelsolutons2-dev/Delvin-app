import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SEED_SPOTS } from '../constants/spots';
import { COLORS } from '../constants/theme';
import * as R from '../lib/guideReducers';
import {
  loadActiveCity,
  loadGuide,
  loadUserSpots,
  saveActiveCity,
  saveGuide,
  saveUserSpots,
} from '../storage/guide';

const GuideContext = createContext(null);

export function GuideProvider({ children }) {
  const [guide, setGuide] = useState({});
  const [userSpots, setUserSpots] = useState([]);
  const [activeCity, setActiveCity] = useState('london');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [g, u, c] = await Promise.all([loadGuide(), loadUserSpots(), loadActiveCity()]);
      if (cancelled) return;
      setGuide(g);
      setUserSpots(u);
      setActiveCity(c);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrated) saveGuide(guide);
  }, [guide, hydrated]);

  useEffect(() => {
    if (hydrated) saveUserSpots(userSpots);
  }, [userSpots, hydrated]);

  useEffect(() => {
    if (hydrated) saveActiveCity(activeCity);
  }, [activeCity, hydrated]);

  const allSpots = useMemo(() => [...SEED_SPOTS, ...userSpots], [userSpots]);

  const isSaved = useCallback((id) => Boolean(guide[id]), [guide]);

  const toggleSaved = useCallback((spot) => {
    setGuide((prev) => R.toggleSaved(prev, spot));
  }, []);

  const setVisited = useCallback((id, visited) => {
    setGuide((prev) => R.setVisited(prev, id, visited));
  }, []);

  const setNote = useCallback((id, note) => {
    setGuide((prev) => R.setNote(prev, id, note));
  }, []);

  const removeFromGuide = useCallback((id) => {
    setGuide((prev) => R.removeFromGuide(prev, id));
  }, []);

  const addUserSpot = useCallback((spot) => {
    setUserSpots((prev) => R.addUserSpot(prev, spot));
  }, []);

  const value = {
    hydrated,
    guide,
    allSpots,
    activeCity,
    setActiveCity,
    isSaved,
    toggleSaved,
    setVisited,
    setNote,
    removeFromGuide,
    addUserSpot,
  };

  return (
    <GuideContext.Provider value={value}>
      {hydrated ? children : (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      )}
    </GuideContext.Provider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function useGuide() {
  const ctx = useContext(GuideContext);
  if (!ctx) throw new Error('useGuide must be used inside GuideProvider');
  return ctx;
}
