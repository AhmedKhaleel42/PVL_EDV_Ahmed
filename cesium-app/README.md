# Cesium 3D-Webkarten-Anwendung (PVL EDV, SS 2026)

3D-Webkarte mit [CesiumJS](https://cesium.com/platform/cesiumjs/) und [Vite](https://vitejs.dev/).
Zeigt CityGML-Gebaeude (als 3D Tiles aus Cesium Ion) zusammen mit dem Cesium World Terrain.

## Voraussetzungen

- Node.js 24+
- Ein Cesium-Ion-Konto (kostenlos): https://ion.cesium.com

## Konfiguration

In `src/main.js` zwei Werte eintragen:

```js
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZjFlM2FiMC1kNTFlLTQ4ZmMtOGVlNy05ZDQzZTRhNjlkNGMiLCJpZCI6NDQ2MzE3LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODE4MDU1ODJ9.7xrk177eXPxjQK28JizgT265-SgMTnSa5KgCd0Por3E";
const BUILDINGS_ASSET_ID = 4959158; // Asset-ID des konvertierten CityGML-Datensatzes
```

## Lokal starten

```bash
npm install
npm run dev      # http://localhost:5173
```

## Produktions-Build

```bash
npm run build
npm run preview
```

## Deployment (GitHub Pages)

Push auf den `main`-Branch loest den Workflow `.github/workflows/deploy.yml` aus.
In den Repo-Einstellungen unter **Settings -> Pages -> Build and deployment**
als Source **GitHub Actions** auswaehlen.

## Features

- Cesium World Terrain
- CityGML-Gebaeude als 3D Tiles
- Maus ueber Gebaeude: Hervorhebung + Eigenschaften (Info-Box)
- Toolbar: Beleuchtung, Schatten, Einfaerben nach Hoehe, Sonnenstand, Kamera-Flug
