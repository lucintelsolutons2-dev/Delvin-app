function toggleSaved(prev, spot, now) {
  const ts = now == null ? Date.now() : now;
  const next = Object.assign({}, prev);
  if (next[spot.id]) {
    delete next[spot.id];
  } else {
    next[spot.id] = { savedAt: ts, visited: false, note: '' };
  }
  return next;
}

function setVisited(prev, id, visited) {
  if (!prev[id]) return prev;
  return Object.assign({}, prev, { [id]: Object.assign({}, prev[id], { visited }) });
}

function setNote(prev, id, note) {
  if (!prev[id]) return prev;
  return Object.assign({}, prev, { [id]: Object.assign({}, prev[id], { note }) });
}

function removeFromGuide(prev, id) {
  if (!prev[id]) return prev;
  const next = Object.assign({}, prev);
  delete next[id];
  return next;
}

function addUserSpot(prev, spot, now) {
  const ts = now == null ? Date.now() : now;
  return [Object.assign({}, spot, { id: 'user-' + ts, userAdded: true }), ...prev];
}

function buildGuideEntries(guide, allSpots, opts) {
  const filter = (opts && opts.filter) || 'all';
  return Object.entries(guide)
    .map(([id, entry]) => {
      const spot = allSpots.find((s) => s.id === id);
      return spot ? { spot, entry } : null;
    })
    .filter(Boolean)
    .filter(({ entry }) => {
      if (filter === 'todo') return !entry.visited;
      if (filter === 'visited') return entry.visited;
      return true;
    })
    .sort((a, b) => b.entry.savedAt - a.entry.savedAt);
}

module.exports = {
  toggleSaved,
  setVisited,
  setNote,
  removeFromGuide,
  addUserSpot,
  buildGuideEntries,
};
