const COST_RANK = { Free: 0, '£': 1, '££': 2, '£££': 3 };

function filterSpots(spots, { cityId, category, query }) {
  const q = (query == null ? '' : query).trim().toLowerCase();
  let list = spots.filter((s) => s.cityId === cityId);
  if (category) list = list.filter((s) => s.category === category);
  if (q) {
    list = list.filter((s) =>
      [s.name, s.area, s.description, s.vibe, s.category]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }
  return list;
}

function sortSpots(spots, sortBy) {
  const copy = spots.slice();
  copy.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    if (sortBy === 'cost') {
      const ar = COST_RANK[a.cost];
      const br = COST_RANK[b.cost];
      return (ar == null ? 99 : ar) - (br == null ? 99 : br);
    }
    return 0;
  });
  return copy;
}

function paginate(items, page, pageSize) {
  return items.slice(0, page * pageSize);
}

module.exports = { COST_RANK, filterSpots, sortSpots, paginate };
