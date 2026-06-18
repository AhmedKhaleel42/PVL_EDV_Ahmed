// Cesium 3D-Webkarte - PVL EDV (SS 2026)

import {
  Ion,
  Viewer,
  Terrain,
  Cesium3DTileset,
  Cartesian3,
  Math as CesiumMath,
  Color,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cesium3DTileStyle,
  ShadowMode,
  JulianDate,
} from "cesium";

import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";

// Konfiguration: Token + Asset-ID
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZjFlM2FiMC1kNTFlLTQ4ZmMtOGVlNy05ZDQzZTRhNjlkNGMiLCJpZCI6NDQ2MzE3LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODE4MDU1ODJ9.7xrk177eXPxjQK28JizgT265-SgMTnSa5KgCd0Por3E";
const BUILDINGS_ASSET_ID = 4959158;

// Viewer + World Terrain
const viewer = new Viewer("cesiumContainer", {
  terrain: Terrain.fromWorldTerrain(),
  timeline: true,
  animation: true,
  baseLayerPicker: true,
  geocoder: true,
  shouldAnimate: true,
});
viewer.scene.globe.enableLighting = true;
viewer.shadows = true;

// Gebaeude (3D Tiles) laden
let buildingTileset;
try {
  buildingTileset = await Cesium3DTileset.fromIonAssetId(BUILDINGS_ASSET_ID, {
    shadows: ShadowMode.ENABLED,
  });
  viewer.scene.primitives.add(buildingTileset);
  await viewer.zoomTo(buildingTileset);
} catch (error) {
  console.error("Tileset konnte nicht geladen werden:", error);
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(9.179, 48.776, 2500),
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-35),
      roll: 0,
    },
  });
}

// Maus ueber Gebaeude: hervorheben + Infos zeigen
const HIGHLIGHT = { feature: undefined, original: new Color() };
const infoBox = document.getElementById("infoBox");
const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

handler.setInputAction((movement) => {
  if (HIGHLIGHT.feature) {
    HIGHLIGHT.feature.color = HIGHLIGHT.original;
    HIGHLIGHT.feature = undefined;
  }

  const picked = viewer.scene.pick(movement.endPosition);
  if (picked && picked.getProperty) {
    HIGHLIGHT.feature = picked;
    Color.clone(picked.color, HIGHLIGHT.original);
    picked.color = Color.YELLOW.withAlpha(0.6);

    const names = picked.getPropertyIds ? picked.getPropertyIds() : [];
    let html = "<strong>Gebaeude</strong><br/>";
    for (const name of names.slice(0, 8)) {
      html += `${name}: ${picked.getProperty(name)}<br/>`;
    }
    infoBox.innerHTML = names.length ? html : "<strong>Gebaeude</strong>";
    infoBox.style.display = "block";
  } else {
    infoBox.style.display = "none";
  }
}, ScreenSpaceEventType.MOUSE_MOVE);

// Toolbar-Buttons
document.getElementById("btnLighting").addEventListener("click", () => {
  viewer.scene.globe.enableLighting = !viewer.scene.globe.enableLighting;
});

document.getElementById("btnShadows").addEventListener("click", () => {
  viewer.shadows = !viewer.shadows;
});

// Gebaeude nach Hoehe einfaerben
let styled = false;
document.getElementById("btnStyle").addEventListener("click", () => {
  if (!buildingTileset) return;
  styled = !styled;
  buildingTileset.style = styled
    ? new Cesium3DTileStyle({
        color: {
          conditions: [
            ["${Height} >= 30", "color('purple')"],
            ["${Height} >= 20", "color('red')"],
            ["${Height} >= 10", "color('orange')"],
            ["true", "color('lightyellow')"],
          ],
        },
      })
    : undefined;
});

// Sonnenstand auf Mittag
document.getElementById("btnNoon").addEventListener("click", () => {
  viewer.clock.currentTime = JulianDate.fromIso8601("2026-06-21T12:00:00Z");
});

// Zurueck zu den Gebaeuden fliegen
document.getElementById("btnHome").addEventListener("click", () => {
  if (buildingTileset) viewer.zoomTo(buildingTileset);
});
