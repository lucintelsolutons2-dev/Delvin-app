const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const GUIDE_KEY = '@citydrop:guide:v1';
const USER_SPOTS_KEY = '@citydrop:userSpots:v1';
const CITY_KEY = '@citydrop:activeCity:v1';

async function loadGuide() {
  try {
    const raw = await AsyncStorage.getItem(GUIDE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

async function saveGuide(guide) {
  try {
    await AsyncStorage.setItem(GUIDE_KEY, JSON.stringify(guide));
  } catch (e) {}
}

async function loadUserSpots() {
  try {
    const raw = await AsyncStorage.getItem(USER_SPOTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

async function saveUserSpots(spots) {
  try {
    await AsyncStorage.setItem(USER_SPOTS_KEY, JSON.stringify(spots));
  } catch (e) {}
}

async function loadActiveCity() {
  try {
    const v = await AsyncStorage.getItem(CITY_KEY);
    return v || 'london';
  } catch (e) {
    return 'london';
  }
}

async function saveActiveCity(cityId) {
  try {
    await AsyncStorage.setItem(CITY_KEY, cityId);
  } catch (e) {}
}

module.exports = {
  loadGuide,
  saveGuide,
  loadUserSpots,
  saveUserSpots,
  loadActiveCity,
  saveActiveCity,
};
