# Recomind — AI Recommendation Engine

A responsive recommendation dashboard inspired by Netflix and Amazon. Recomind demonstrates personalized discovery, user taste analysis, recommendation history, and three recommendation strategies.

## Features

- User profile analysis with interest signals and confidence score
- Personalized movie and series recommendations
- Content-based, collaborative, and hybrid recommendation modes
- Search and movie/series filters
- Like and save interactions
- Recommendation history with activity filters
- JSON history export
- Local browser persistence with `localStorage`
- Model insights and settings pages
- Responsive desktop and mobile layout

## Run locally

No build tools or dependencies are required.

1. Download or clone the repository.
2. Open `index.html` in a modern browser.

For the best development experience, serve the folder with any static file server or use the VS Code Live Server extension.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Application markup and dashboard views |
| `styles.css` | Responsive visual styling |
| `app.js` | Recommendation data, filtering, model switching, and interactions |

## Note

This is a frontend prototype using seeded catalog data and browser storage. A production recommendation platform would connect these interfaces to authentication, a database, live catalog data, and trained machine-learning models.
