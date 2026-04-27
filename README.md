# CityDrop

An Expo Snack mobile app that takes a curated list of hidden city spots and lets you transform it into a personal city guide — saving favourites, ticking spots off as you visit, attaching private notes, and contributing your own.

## What it does

- **Information given:** a JSON list of hand-picked hidden spots across multiple cities (cafés, viewpoints, gardens, markets, street art, experiences).
- **Transformed into:** a personal, persistent city guide unique to the user.
- **Enrichment:** save / unsave, mark visited, add private notes, see progress stats, contribute new spots.

## Navigation

`Splash` → `SpotsList` → `SpotDetail` → `MyGuide` → `AddSpot`

All screens live in their own files under `screens/`. Reusable UI is under `components/`.

## Browsing

The list screen supports:

- Free-text **search** (name / area / vibe / description)
- **Category filter** pills
- **Sort** by name, category, or cost
- **Paging** ("Show more" — 5 at a time)

## Persistence

User data persists across app launches using `@react-native-async-storage/async-storage`:

- `@citydrop:guide:v1` — saved spots + visited state + notes
- `@citydrop:userSpots:v1` — spots added by the user
- `@citydrop:activeCity:v1` — last selected city

Hydration and writes are handled centrally in `context/GuideContext.js`.

## Project structure

```
App.js                       # navigation container + providers
index.js                     # Expo entry
constants/
  theme.js                   # colour + spacing tokens
  spots.js                   # seed data (cities, categories, vibes, JSON spot list)
storage/
  guide.js                   # AsyncStorage helpers
context/
  GuideContext.js            # global guide state, hydration, mutators
components/
  Pill.js                    # reusable pill button (light/dark tones)
  SpotCard.js                # list card with saved/visited badges
screens/
  SplashScreen.js            # hero + city picker + entry CTA
  SpotsListScreen.js         # search / filter / sort / paged list
  SpotDetailScreen.js        # full info, save toggle, visited switch, note
  MyGuideScreen.js           # saved-only view, stats, todo/visited filter
  AddSpotScreen.js           # form to contribute a spot (saved locally)
```

## Rules followed

- React Native only, runs as an Expo Snack.
- Initial data is hard-wired JSON in `constants/spots.js` — no auth, no external service.
- No signup / register flow.
- Multi-file structure — App.js only wires up the navigator and providers.
- All persistence is via AsyncStorage.
