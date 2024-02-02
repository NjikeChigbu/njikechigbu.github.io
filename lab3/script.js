// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1Ijoibmppa2VjIiwiYSI6ImNscmdmdmZqcTAxb2kyam1rNTl1N2wzemgifQ.66TD2YnVptsfg1ybTTn4jg";

// Define a map object by initializing a Map from Mapbox
const map = new mapboxgl.Map({
  container: "map",
  // Replace YOUR_STYLE_URL with your style URL.
  style: "mapbox://styles/njikec/clrw6xis3007l01ph6x11auuq"
});

// Add a mousemove event listener to the map
map.on("mousemove", (event) => {
  const features = map.queryRenderedFeatures(event.point, {
    layers: ["abpol-buildings", "abpol-fields"]
  });

  // Display information in the 'pd' element based on the hovered feature
  document.getElementById("pd").innerHTML = features.length
    ? `<h3>Name: ${features[0].properties.Name}</h3>` +
      (features[0].layer.id === "abpol-buildings"
        ? `<strong><p>Type: ${features[0].properties.Type}</strong></p>`
        : "")
    : `<p>Hover over the features!</p>`;

  // Check if features are present to change cursor style
  map.getCanvas().style.cursor = features.length ? "pointer" : "";
});

// Add a load event listener to the map
map.on("load", () => {
  const layers = [
    { name: "Bungalow", color: "#8dd3c7" },
    { name: "One Deck", color: "#ffffb3" },
    { name: "Two Deck", color: "#bebada" },
    { name: "Three Deck", color: "#fb8072" },
    { name: "Gallery Deck", color: "#80b1d3" },
    { name: "School Field", color: "#a1d76a" },
    { name: "Basketball Court", color: "#e9a3c9" },
    { name: "Volleyball Pitch", color: "#f7f7f7" }
  ];

  // Create legend
  const legend = document.getElementById("legend");

  layers.forEach((layer) => {
    const item = document.createElement("div");
    const key = document.createElement("span");
    key.className = "legend-key";
    key.style.backgroundColor = layer.color;

    const value = document.createElement("span");
    value.innerHTML = `${layer.name}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  });

  // Check if the "hover" source already exists before adding it
  if (!map.getSource("hover")) {
    map.addSource("hover", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] }
    });
  }

  // Check if the "features-hover" layer already exists before adding it
  if (!map.getLayer("features-hover")) {
    map.addLayer({
      id: "features-hover",
      type: "line",
      source: "hover",
      layout: {},
      paint: {
        "line-color": "#080857",
        "line-width": 4
      }
    });
  }

  // Now, inside the load event, you can set up the mousemove event listener
  map.on("mousemove", (event) => {
    const featurez = map.queryRenderedFeatures(event.point, {
      layers: ["abpol-buildings", "abpol-fields"]
    });

    // Display information in the 'pd' element based on the hovered feature
    document.getElementById("pd").innerHTML = featurez.length
      ? `<h3>Name: ${featurez[0].properties.Name}</h3>` +
        (featurez[0].layer.id === "abpol-buildings"
          ? `<strong><p>Type: ${featurez[0].properties.Type}</strong></p>`
          : "")
      : `<p>Hover over the features!</p>`;

    map.getSource("hover").setData({
      type: "FeatureCollection",
      features: featurez.map(function (f) {
        return { type: "Feature", geometry: f.geometry };
      })
    });

    // Check if features are present to change cursor style
    map.getCanvas().style.cursor = featurez.length ? "pointer" : "";
  });
});

// Adding Navigation controls
// Add Navigation Control
map.addControl(new mapboxgl.NavigationControl(), "top-left");

// Add Geolocate Control for finding the current location
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-left"
);

// Adding a geocoder search control
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for places",
  proximity: {
    longitude: 7.3625,
    latitude: 5.1284
  }
});

map.addControl(geocoder, "top-left");