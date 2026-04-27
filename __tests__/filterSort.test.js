const { filterSpots, sortSpots, paginate } = require('../lib/filterSort');

const SAMPLE = [
  { id: '1', cityId: 'london', name: 'Beta',  category: 'Café',         area: 'Soho',        description: 'roasted beans',     vibe: 'Foodie',   cost: '£' },
  { id: '2', cityId: 'london', name: 'Alpha', category: 'Hidden Garden', area: 'Holland',     description: 'cherry blossoms',   vibe: 'Peaceful', cost: 'Free' },
  { id: '3', cityId: 'london', name: 'Gamma', category: 'Viewpoint',     area: 'City',        description: '360 view rooftop',  vibe: 'Scenic',   cost: '££' },
  { id: '4', cityId: 'lisbon', name: 'Delta', category: 'Market',        area: 'Cais',        description: 'food stalls',       vibe: 'Foodie',   cost: '£££' },
];

describe('filterSpots', () => {
  test('filters by city', () => {
    const out = filterSpots(SAMPLE, { cityId: 'lisbon' });
    expect(out.map((s) => s.id)).toEqual(['4']);
  });

  test('filters by category within a city', () => {
    const out = filterSpots(SAMPLE, { cityId: 'london', category: 'Café' });
    expect(out.map((s) => s.id)).toEqual(['1']);
  });

  test('search matches across multiple fields, case-insensitive', () => {
    expect(filterSpots(SAMPLE, { cityId: 'london', query: 'CHERRY' }).map((s) => s.id)).toEqual(['2']);
    expect(filterSpots(SAMPLE, { cityId: 'london', query: 'rooftop' }).map((s) => s.id)).toEqual(['3']);
    expect(filterSpots(SAMPLE, { cityId: 'london', query: 'soho' }).map((s) => s.id)).toEqual(['1']);
  });

  test('empty / whitespace query is ignored', () => {
    expect(filterSpots(SAMPLE, { cityId: 'london', query: '   ' })).toHaveLength(3);
  });

  test('returns empty array when nothing matches', () => {
    expect(filterSpots(SAMPLE, { cityId: 'london', query: 'zzz' })).toEqual([]);
  });
});

describe('sortSpots', () => {
  test('sorts by name A→Z', () => {
    const out = sortSpots(SAMPLE.slice(0, 3), 'name');
    expect(out.map((s) => s.name)).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  test('sorts by category alphabetically', () => {
    const out = sortSpots(SAMPLE.slice(0, 3), 'category');
    expect(out.map((s) => s.category)).toEqual(['Café', 'Hidden Garden', 'Viewpoint']);
  });

  test('sorts by cost: Free < £ < ££ < £££', () => {
    const out = sortSpots(SAMPLE, 'cost');
    expect(out.map((s) => s.cost)).toEqual(['Free', '£', '££', '£££']);
  });

  test('does not mutate input', () => {
    const before = SAMPLE.map((s) => s.id);
    sortSpots(SAMPLE, 'name');
    expect(SAMPLE.map((s) => s.id)).toEqual(before);
  });
});

describe('paginate', () => {
  const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  test('page 1 returns first PAGE_SIZE items', () => {
    expect(paginate(xs, 1, 3)).toEqual([1, 2, 3]);
  });
  test('subsequent pages accumulate (Show-more model)', () => {
    expect(paginate(xs, 2, 3)).toEqual([1, 2, 3, 4, 5, 6]);
  });
  test('caps at array length', () => {
    expect(paginate(xs, 99, 3)).toEqual(xs);
  });
});
