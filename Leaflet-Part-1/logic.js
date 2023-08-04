// api query 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl).then(function (data) {
 createFeatures(data.features);
});

// marker size
function markerSize(magnitude) {
 return magnitude * 2000;
};

// color
function chooseColor(depth){
 if (depth < 10) return "#00FF00";
 else if (depth < 30) return "greenyellow";
 else if (depth < 50) return "yellow";
 else if (depth < 70) return "orange";
 else if (depth < 90) return "orangered";
 else return "#FF0000";
};
function createFeatures(earthquakeData) {
//on Each
 function onEachFeature(feature, layer){
    layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}`);
  }

 // variable array
 var earthquakes = L.geoJSON(earthquakeData, {
 onEachFeature: onEachFeature,

 // point to Layer
 pointToLayer: function(feature, latlng) {

  // marker style
  var markers = {
  radius: markerSize(feature.properties.mag),
  fillColor: chooseColor(feature.geometry.coordinates[2]),
  fillOpacity: 0.7,
  color: "black",
  stroke: true,
  weight: 0.5
  }
  return L.circle(latlng,markers);
 }
 });

 // create Map
 createMap(earthquakes);
};

function createMap(earthquakes) {

 // tile
 var gray = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}', {
 attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
 tileSize: 512,
 maxZoom: 18,
 zoomOffset: -1,
 style: 'mapbox/light-v11'
 });

 // my Map
 var myMap = L.map("map", {
 center: [
  37.09, -95.71
 ],
 zoom: 10,
 layers: [gray, earthquakes]
 });

 // Add legend
 var legend = L.control({position: "bottomright"});
 legend.onAdd = function() {
 var div = L.DomUtil.create("div", "info legend"),
 depth = [-10, 10, 30, 50, 70, 90];

 div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

 for (var i = 0; i < depth.length; i++) {
  div.innerHTML +=
  '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
 }
 return div;
 };
 legend.addTo(myMap)
};