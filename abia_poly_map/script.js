//============================================================
// MAPBOX ACCESS TOKEN
//============================================================

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2hpZ2J1MjAyNiIsImEiOiJjbXI0ajc3bTkwZjRnMnlzZG1wbXlnbjhrIn0.gMAQ6mpltGk8-7UHiZ2xVA";

//============================================================
// CREATE MAP
//============================================================

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [7.3625, 5.1284],
    zoom: 17
});

//============================================================
// NAVIGATION CONTROLS
//============================================================

map.addControl(new mapboxgl.NavigationControl(), "top-left");

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

//============================================================
// GEOCODER
//============================================================

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
    placeholder: "Search for places",
    proximity: {
        longitude: 7.3625,
        latitude: 5.1284
    }
});

map.addControl(geocoder, "top-left");

//============================================================
// MAP LOAD
//============================================================

map.on("load", () => {

    //--------------------------------------------------------
    // BUILDINGS
    //--------------------------------------------------------

    map.addSource("abpol_buildings", {
        type: "geojson",
        data: "data/abpol_buildings.geojson"
    });

    map.addLayer({
        id: "abpol_buildings",
        type: "fill",
        source: "abpol_buildings",

        paint: {

            "fill-color": [

                "match",
                ["get", "Type"],

                "Bungalow", "rgb(130,208,196)",

                "One_Deck", "rgb(254,255,163)",

                "Two_Deck", "rgb(181,181,225)",

                "Three_Deck", "rgb(255,117,101)",

                "Galery_Deck", "rgb(122,167,211)",

                "rgba(180,180,180,0.5)"
            ],

            "fill-outline-color": "rgba(80,80,80,0.4)"

        }

    });

    //--------------------------------------------------------
    // FIELDS
    //--------------------------------------------------------

    map.addSource("abpol_fields", {
        type: "geojson",
        data: "data/abpol_fields.geojson"
    });

    map.addLayer({

        id: "abpol_fields",

        type: "fill",

        source: "abpol_fields",

        paint: {

            "fill-color": [

                "match",
                ["get", "Name"],

                "School_Field", "rgb(140,214,100)",

                "Basketball_Court", "rgb(236,142,208)",

                "VolleyBall_Pitch", "rgb(240,240,240)",

                "rgba(180,180,180,0.5)"

            ],

            "fill-outline-color": "rgba(80,80,80,0.4)"

        }

    });

    //--------------------------------------------------------
    // PERIMETER
    //--------------------------------------------------------

    map.addSource("abpol_perimeter", {
        type: "geojson",
        data: "data/abpol_perimeter.geojson"
    });

    map.addLayer({

        id: "abpol_perimeter",

        type: "line",

        source: "abpol_perimeter",

        paint: {

            "line-color": "rgb(8,8,87)",

            "line-width": 3

        }

    });

    //--------------------------------------------------------
    // LEGEND
    //--------------------------------------------------------

    const legendItems = [

        { name: "Bungalow", color: "rgb(130,208,196)" },

        { name: "One Deck", color: "rgb(254,255,163)" },

        { name: "Two Deck", color: "rgb(181,181,225)" },

        { name: "Three Deck", color: "rgb(255,117,101)" },

        { name: "Gallery Deck", color: "rgb(122,167,211)" },

        { name: "School Field", color: "rgb(140,214,100)" },

        { name: "Basketball Court", color: "rgb(236,142,208)" },

        { name: "Volleyball Pitch", color: "rgb(240,240,240)" }

    ];

    const legend = document.getElementById("legend");

    legend.innerHTML = "<h3>Legend</h3>";

    legendItems.forEach(item => {

        const row = document.createElement("div");

        const key = document.createElement("span");

        key.className = "legend-key";

        key.style.backgroundColor = item.color;

        const value = document.createElement("span");

        value.textContent = item.name;

        row.appendChild(key);

        row.appendChild(value);

        legend.appendChild(row);

    });

    //--------------------------------------------------------
    // HOVER SOURCE
    //--------------------------------------------------------

    map.addSource("hover", {

        type: "geojson",

        data: {

            type: "FeatureCollection",

            features: []

        }

    });

    map.addLayer({

        id: "features-hover",

        type: "line",

        source: "hover",

        paint: {

            "line-color": "#080857",

            "line-width": 4

        }

    });

    //--------------------------------------------------------
    // HOVER INTERACTION
    //--------------------------------------------------------

    map.on("mousemove", (event) => {

        const features = map.queryRenderedFeatures(event.point, {

            layers: [

                "abpol_buildings",

                "abpol_fields"

            ]

        });

        if (features.length) {

            const feature = features[0];

            let html = `<h3>${feature.properties.Name}</h3>`;

            if (feature.layer.id === "abpol_buildings") {

                html += `<strong>Type:</strong> ${feature.properties.Type}`;

            }

            document.getElementById("pd").innerHTML = html;

        }

        else {

            document.getElementById("pd").innerHTML =
                "<p>Hover over the features!</p>";

        }

        map.getCanvas().style.cursor =
            features.length ? "pointer" : "";

        map.getSource("hover").setData({

            type: "FeatureCollection",

            features: features.map(f => ({

                type: "Feature",

                geometry: f.geometry

            }))

        });

    });

});