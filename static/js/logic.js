// store , get, and create
var queryURL = "https://earthquake.usgs.gov/quakeData/feed/v1.0/summary/all_month.geojson";
d3.json(queryURL).then(function(data){
  create(data.features);
 }); 
function create(earthquakes, platesData){

  // pop-up
  function onEachFeature(feature, layer){
    layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}`);
  }

  // layer 1
  function createCircleMarker(feature, latlng){
   let options = {
    radius:feature.properties.mag*5,
    fillColor: color(feature.properties.mag),
    color: color(feature.properties.mag),
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.35
   } 
   return L.circleMarker(latlng,options);
  }
  // variable / createMap
  let quakeData = L.geoJSON(earthquakes, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });
  createMap(quakeData);
}

// Circles color palette based on mag (feature) data marker: data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. quakeData with higher magnitudes should appear larger, and quakeData with greater depth should appear darker in color.
function color(mag){
  switch(true){
    case(1.0 <= mag && mag <= 2.5):
      return "#0071BC"; // Strong blue
    case (2.5 <= mag && mag <=4.0):
      return "#35BC00";
    case (4.0 <= mag && mag <=5.5):
      return "#BCBC00";
    case (5.5 <= mag && mag <= 8.0):
      return "#BC3500";
    case (8.0 <= mag && mag <=20.0):
      return "#BC0000";
    default:
      return "#E2FFAE";
  }
}

// Create map legend to provide context for map data
let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [1.0, 2.5, 4.0, 5.5, 8.0];
  var labels = [];
  var legendInfo = "<h4>Magnitude</h4>";

  div.innerHTML = legendInfo

  // go through each magnitude item to label and color the legend
  // push to labels array as list item
  for (var i = 0; i < grades.length; i++) {
     labels.push('<ul style="background-color:' + color(grades[i] + 1) + '"> <span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</span></ul>');
    }

   // add each label list item to the div under the <ul> tag
   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  
  return div;
 };


// Create map
function createMap(quakeData) {
 // Define outdoors and graymap layers
 let streetstylemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 20,
  id: "outdoors-v11",
  accessToken: API_KEY
 })

 let graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 20,
  id: "light-v10",
  accessToken: API_KEY
 });

 // Define a baseMaps object to hold our base layers
 let baseMaps = {
  "Outdoors": streetstylemap,
  "Grayscale": graymap
 };

 // Create overlay object to hold our overlay layer
 let overlayMaps = {
  quakeData: quakeData
 };

 // Create our map, giving it the streetmap and quakeData layers to display on load
 let myMap = L.map("map", {
  center: [
   39.8282, -98.5795
  ],
  zoom: 4,
  layers: [streetstylemap, quakeData]
 });
 // Add the layer control to the map
 L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
 }).addTo(myMap);
 legend.addTo(myMap);
}