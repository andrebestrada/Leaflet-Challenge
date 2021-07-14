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
})

default_map.addTo(myMap);


var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

var baseMaps = {
  Grayscale: default_map,
  Outdoors: color_map
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

// const colormap = d3.scale.linear()
//   .domain([0, 5])
//   .range(["yellow", "red"]);


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data=>{
  console.log(data)
  console.log(data.features)

    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.mag * 5,
          fillColor: fillColor(feature.properties.mag),
          color: '#000000',
          fillOpacity: 1,
          weight: 0.6
          
        })
      }
      
    
      }).addTo(myMap);


})


// Loop through the countries array
countries.forEach((country)=>{

  L.circleMarker(country.location,{
    color:"white",
    fillColor: "blue",
    fillOpacity:0.7,
    radius: country.points / 8
  }).bindPopup(`<h1>${country.name}</h1> <hr> Points: ${country.points}`)
  .addTo(myMap);

})
