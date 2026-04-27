jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((k) => Promise.resolve(store[k] ?? null)),
      setItem: jest.fn((k, v) => {
        store[k] = v;
        return Promise.resolve();
      }),
      __reset: () => {
        store = {};
      },
    },
  };
});

const AsyncStorage = require('@react-native-async-storage/async-storage').default;
const {
  loadGuide,
  saveGuide,
  loadUserSpots,
  saveUserSpots,
  loadActiveCity,
  saveActiveCity,
} = require('../storage/guide');

beforeEach(() => {
  AsyncStorage.__reset();
  jest.clearAllMocks();
});

describe('storage/guide', () => {
  test('loadGuide returns {} when nothing stored', async () => {
    expect(await loadGuide()).toEqual({});
  });

  test('saveGuide → loadGuide round-trips', async () => {
    const data = { a: { savedAt: 1, visited: true, note: 'hi' } };
    await saveGuide(data);
    expect(await loadGuide()).toEqual(data);
  });

  test('loadGuide swallows JSON parse errors and returns {}', async () => {
    await AsyncStorage.setItem('@citydrop:guide:v1', 'not-json{{');
    expect(await loadGuide()).toEqual({});
  });

  test('loadUserSpots returns [] when nothing stored', async () => {
    expect(await loadUserSpots()).toEqual([]);
  });

  test('saveUserSpots → loadUserSpots round-trips', async () => {
    const spots = [{ id: 'user-1', name: 'X', userAdded: true }];
    await saveUserSpots(spots);
    expect(await loadUserSpots()).toEqual(spots);
  });

  test('loadActiveCity defaults to london', async () => {
    expect(await loadActiveCity()).toBe('london');
  });

  test('saveActiveCity → loadActiveCity round-trips', async () => {
    await saveActiveCity('lisbon');
    expect(await loadActiveCity()).toBe('lisbon');
  });
});
