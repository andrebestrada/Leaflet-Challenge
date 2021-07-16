console.log("Its alive")

// Create a map object
var myMap = L.map("map", {
  center: [28, -100],
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

var earthquakes = new L.LayerGroup();

var baseMaps = {
  Grayscale: default_map,
  Darkscale: dark_map,
  Outdoors: color_map,
  Satellite: satellite_map
};

var overlays = {
  "Earthquakes": earthquakes,
};


L.control.layers(baseMaps, overlays,{collapsed:false}).addTo(myMap);

function fillColor(depth) {
  switch (true) {
  case depth > 90:
    return "#ea2c2c";
  case depth > 70:
    return "#ea822c";
  case depth > 50:
    return "#ee9c00";
  case depth > 30:
    return "#eecc00";
  case depth > 10:
    return "#d4ee00";
  default:
    return "#98ee00";
  }
}


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data=>{
  // console.log(data)

    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.mag * 5,
          fillColor: fillColor(feature.geometry.coordinates[2]),
          color: '#000000',
          fillOpacity: 1,
          weight: 0.6 
        })
      },

      onEachFeature: function(feature, layer) {
        layer.bindPopup("<strong>Date:</strong> "+ (new Date(feature.properties.time))
        .toLocaleString("en-US", {month: "long"}+{day: "numeric"}+{year: "numeric"})+"<br><strong>Location:</strong> " + feature.properties.place + "<hr>Magnitude: " + feature.properties.mag +"<br>Depth: " + feature.geometry.coordinates[2]);
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
  
      var grades = [0, 10, 30, 50, 70, 90];
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


// Create beatiful title WORLD EARTHQUAKES
var marker = new L.marker([17, -132], { opacity: 0 }); //opacity may be set to zero
marker.bindTooltip("Earthquakes World map", {permanent: true, noWrap: true,className: 'leaflet-tooltip-1',offset: [0, 0] });
marker.addTo(myMap);
var marker = new L.marker([14, -132], { opacity: 0 }); //opacity may be set to zero
marker.bindTooltip("USGS Last Week Data", {permanent: true, noWrap: true,className: 'leaflet-tooltip-2',offset: [0, 0] });
marker.addTo(myMap);


// Hide titles when zooming out
var lastZoom;
myMap.on('zoomend', function() {
  var zoom = myMap.getZoom();

  console.log(zoom)

  if (zoom < 5 && (!lastZoom || lastZoom >= 5)) {
    myMap.eachLayer(function(l) {
      if (l.getTooltip) {
        var toolTip = l.getTooltip();
        if (toolTip) {
          this.myMap.closeTooltip(toolTip);
        }
      }
    });
  } else if (zoom >= 5 && (!lastZoom || lastZoom < 5)) {
    myMap.eachLayer(function(l) {
      if (l.getTooltip) {
        var toolTip = l.getTooltip();
        marker.addTo(myMap);
        if (toolTip) {
          this.myMap.addLayer(toolTip);
          marker.addTo(myMap);
        }
      }
    });
  }
  lastZoom = zoom;
})
