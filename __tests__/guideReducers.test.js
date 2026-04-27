const {
  toggleSaved,
  setVisited,
  setNote,
  removeFromGuide,
  addUserSpot,
  buildGuideEntries,
} = require('../lib/guideReducers');

const spot = (id) => ({ id, name: `Spot ${id}`, cityId: 'london', category: 'Café', area: '', description: '', vibe: 'Foodie', cost: '£' });

describe('toggleSaved', () => {
  test('adds an entry when none exists', () => {
    const out = toggleSaved({}, spot('a'), 1000);
    expect(out).toEqual({ a: { savedAt: 1000, visited: false, note: '' } });
  });

  test('removes an entry that already exists', () => {
    const start = { a: { savedAt: 1, visited: true, note: 'x' } };
    expect(toggleSaved(start, spot('a'))).toEqual({});
  });

  test('does not mutate the input object', () => {
    const start = {};
    const out = toggleSaved(start, spot('a'));
    expect(start).toEqual({});
    expect(out).not.toBe(start);
  });
});

describe('setVisited', () => {
  test('flips visited true', () => {
    const start = { a: { savedAt: 1, visited: false, note: '' } };
    expect(setVisited(start, 'a', true)).toEqual({ a: { savedAt: 1, visited: true, note: '' } });
  });

  test('returns same reference when entry does not exist (no-op)', () => {
    const start = { a: { savedAt: 1, visited: false, note: '' } };
    expect(setVisited(start, 'missing', true)).toBe(start);
  });

  test('preserves other fields', () => {
    const start = { a: { savedAt: 5, visited: false, note: 'remember' } };
    expect(setVisited(start, 'a', true).a).toEqual({ savedAt: 5, visited: true, note: 'remember' });
  });
});

describe('setNote', () => {
  test('updates the note', () => {
    const start = { a: { savedAt: 1, visited: false, note: '' } };
    expect(setNote(start, 'a', 'go sunday').a.note).toBe('go sunday');
  });
  test('clears the note when given empty string', () => {
    const start = { a: { savedAt: 1, visited: false, note: 'old' } };
    expect(setNote(start, 'a', '').a.note).toBe('');
  });
  test('no-op for missing entry', () => {
    const start = { a: { savedAt: 1, visited: false, note: '' } };
    expect(setNote(start, 'missing', 'x')).toBe(start);
  });
});

describe('removeFromGuide', () => {
  test('removes an existing entry', () => {
    const start = { a: { savedAt: 1, visited: false, note: '' }, b: { savedAt: 2, visited: false, note: '' } };
    expect(removeFromGuide(start, 'a')).toEqual({ b: { savedAt: 2, visited: false, note: '' } });
  });
  test('no-op for missing id', () => {
    const start = { a: { savedAt: 1, visited: false, note: '' } };
    expect(removeFromGuide(start, 'zzz')).toBe(start);
  });
});

describe('addUserSpot', () => {
  test('prepends, generates id, marks userAdded', () => {
    const draft = { name: 'Mine', cityId: 'london', category: 'Café', area: '', description: '', vibe: 'Foodie', cost: 'Free', emoji: '☕' };
    const out = addUserSpot([], draft, 1234);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('user-1234');
    expect(out[0].userAdded).toBe(true);
    expect(out[0].name).toBe('Mine');
  });
  test('preserves existing user spots and prepends the new one', () => {
    const existing = [{ id: 'user-1', name: 'Old', userAdded: true }];
    const out = addUserSpot(existing, { name: 'New' }, 9999);
    expect(out.map((s) => s.id)).toEqual(['user-9999', 'user-1']);
  });
});

describe('buildGuideEntries', () => {
  const allSpots = [spot('a'), spot('b'), spot('c')];
  const guide = {
    a: { savedAt: 100, visited: true,  note: '' },
    b: { savedAt: 200, visited: false, note: '' },
    c: { savedAt: 300, visited: false, note: '' },
  };

  test('joins guide with spots and sorts most-recently-saved first', () => {
    const out = buildGuideEntries(guide, allSpots);
    expect(out.map(({ spot }) => spot.id)).toEqual(['c', 'b', 'a']);
  });

  test('filters to todo (unvisited)', () => {
    const out = buildGuideEntries(guide, allSpots, { filter: 'todo' });
    expect(out.map(({ spot }) => spot.id)).toEqual(['c', 'b']);
  });

  test('filters to visited', () => {
    const out = buildGuideEntries(guide, allSpots, { filter: 'visited' });
    expect(out.map(({ spot }) => spot.id)).toEqual(['a']);
  });

  test('drops orphaned guide entries whose spot was deleted', () => {
    const orphaned = { ...guide, ghost: { savedAt: 999, visited: false, note: '' } };
    const out = buildGuideEntries(orphaned, allSpots);
    expect(out.map(({ spot }) => spot.id)).toEqual(['c', 'b', 'a']);
  });
});
