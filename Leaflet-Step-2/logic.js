// Create a map object
var myMap = L.map("map", {
  center: [28.5994, -105.6731],
  zoom: 5
});

// Adding tile layer
var default_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var color_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var dark_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
});

var satellite_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});


dark_map.addTo(myMap);


var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

var baseMaps = {
  Grayscale: default_map,
  Darkscale: dark_map,
  Outdoors: color_map,
  Satellite: satellite_map
};

var overlays = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicplates
};


L.control.layers(baseMaps, overlays,{collapsed:false}).addTo(myMap);

function fillColor(magnitude) {
  switch (true) {
  case magnitude > 5:
    return "#ea2c2c";
  case magnitude > 4:
    return "#ea822c";
  case magnitude > 3:
    return "#ee9c00";
  case magnitude > 2:
    return "#eecc00";
  case magnitude > 1:
    return "#d4ee00";
  default:
    return "#98ee00";
  }
}

d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(data=>{
  L.geoJson(data,{
    color: "#007fff",
    weight: 10
  }).addTo(tectonicplates)

  tectonicplates.addTo(myMap)
});

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data=>{
  console.log(data)
  console.log(data.features.geometry)

    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.mag * 5,
          fillColor: fillColor(feature.properties.mag),
          color: '#000000',
          fillOpacity: 1,
          weight: 0.6 
        })
      },

      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
      
    }).addTo(earthquakes);

    earthquakes.addTo(myMap);

    // Add legend 
    var legend = L.control({
      position: "bottomright"
    });
  
    legend.onAdd = function() {
      var div = L
        .DomUtil
        .create("div", "info legend");
  
      var grades = [0, 1, 2, 3, 4, 5];
      var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
  
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    legend.addTo(myMap);

  
});



