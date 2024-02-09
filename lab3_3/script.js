// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1Ijoibmppa2VjIiwiYSI6ImNscmdmdmZqcTAxb2kyam1rNTl1N2wzemgifQ.66TD2YnVptsfg1ybTTn4jg";

const map = new mapboxgl.Map({
  container: "map", // container element id
  style: "mapbox://styles/mapbox/light-v10",
  center: [-0.089932, 51.514442],
  zoom: 14
});

const data_url =
  "https://api.mapbox.com/datasets/v1/njikec/clsdgejvs00w61nl0o0cemrpu/features?access_token=pk.eyJ1Ijoibmppa2VjIiwiYSI6ImNscmdmdmZqcTAxb2kyam1rNTl1N2wzemgifQ.66TD2YnVptsfg1ybTTn4jg";

let filterMonth; // Define filterMonth variable outside the event listener
let filterType = ["!=", ["get", "Crime type"], "placeholder"]; // Define filterType with default value

map.on("load", () => {
  map.addLayer({
    id: "crimes",
    type: "circle",
    source: {
      type: "geojson",
      data: data_url
    },
    paint: {
      "circle-radius": 10,
      "circle-color": "#eb4d4b",
      "circle-opacity": 0.9
    }
  });

  // Slider interaction code goes below
  document.getElementById("slider").addEventListener("input", (event) => {
    // Get the month value from the slider
    const month = parseInt(event.target.value);

    // Get the correct format for the data
    const formatted_month = "2021-" + ("0" + month).slice(-2);

    // Update filterMonth
    filterMonth = ["==", ["get", "Month"], formatted_month];

    // Set the map filter
    map.setFilter("crimes", ["all", filterMonth, filterType]);

    // Update text in the UI
    document.getElementById("active-month").innerText = month;
  });

  // Radio button interaction code goes below
  document.getElementById("filters").addEventListener("change", (event) => {
    const type = event.target.value;
    console.log(type);

    // Update the map filter
    if (type == "all") {
      filterType = ["!=", ["get", "Crime type"], "placeholder"];
    } else if (type == "shoplifting") {
      filterType = ["==", ["get", "Crime type"], "Shoplifting"];
    } else if (type == "bike") {
      filterType = ["==", ["get", "Crime type"], "Bicycle theft"];
    } else if (type == "robbery") {
      filterType = ["==", ["get", "Crime type"], "Robbery"];
    } else if (type == "drugs") {
      filterType = ["==", ["get", "Crime type"], "Drugs"];
    } else {
      console.log("error");
      return; // Exit the function if there's an error
    }
    map.setFilter("crimes", ["all", filterMonth, filterType]);
  });
});