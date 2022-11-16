// Create the tile layer that will be the background of our map.
var defaultMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

//greyscale layer
var greyscale = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

//water color layer
var waterColor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 1,
  maxZoom: 16,
  ext: 'jpg'
});

let topMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//create basemap
let baseMap = {
  GreyScale: greyscale,
  "Water Color": waterColor,
  "Topography": topMap,
  Default: defaultMap
};

// Create a map object
var myMap = L.map("map", {
  center: [36.7783, -119.4179],
  zoom: 5,
  layers: [greyscale, waterColor, topMap, defaultMap]
});

// add the default map to the map
defaultMap.addTo(myMap);

//create the info for the overlay of the earthquakes
let earthquakes = new L.layerGroup();

//get the data for the earthquakes and populate the layergroup
//call teh USGS GeoJson API
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(
  function(earthquakeData){
  console.log(earthquakeData); 
  //plot circles where radius is dependent on the magnitude 
  //and color is dependent on the depth
  function dataColor(depth){
      if (depth > 90)
        return "red";
      else if(depth > 70)
        return "#fc4903";
      else if (depth > 50)
        return "#fc8403";
      else if (depth > 30)
        return "#fcad03";
      else if (depth > 10)
        return "#cafc03";
      else  
        return "green";
    } 
    
    // make a function that determines the size of the readius
    function radiusSize(mag){
        if (mag == 0)
          return 1; //make sure that a 0 mag earthquake shows up
        else  
          return mag*5; //make sure that the circle is pronounced
    }

    //add on to teh style for each data point
    function dataStyle(feature)
    {
      return {
        opacity: 0.5,
        fillOpacity: 0.5,
        fillColor: dataColor(feature.geometry.coordinates[2]), //use index 2 for depth
        color: "000000", //black outline
        radius: radiusSize(feature.properties.mag), //grabs the magnitude
        weight: 0.5,
        stroke: true
      }
    }

    //add the GeoJson Data
    L.geoJson(earthquakeData, {
      // make each feature a maerker that is on the map, each marker is a circle
      pointToLayer: function(feature, latLng) {
        return L.circleMarker(latLng);
      },
      //set the style for each marker
      style: dataStyle, //calls the data style function and passes in the earthquake data
      //add popups
      onEachFeature: function(feature, layer) {
          layer.bindPopup('Magnitude: <b>${feature.properties.mag}</b><br> Depth: <b>${feature.geometry.coordinates[2]}</b><br>Location:<b>${feature.properties.place}</b>');
      }
    }).addTo(earthquakes);
  }
);

 //add the earthquake layer to the map
 earthquakes.addTo(myMap);

 //add the overlay for the earthquakes
 let overlays = {
    "Earthquake Data": earthquakes
 };

 //add the layer control 
L.control 
.layers(baseMap, overlays)
.addTo(myMap);

//add the legend to the map
let legend = L.control({
    position: "bottomright"
});

//add the properties for the legned
legend.onAdd = function() {
  //div for the legned to appear in the page
  let div = L.DomUtil.create('div', 'info lengend');

  //set up the intervals
  let intervals = [-10, 10, 30, 50, 70, 90];
  //set the colors for the intervals
  let colors = [
    "green",
    "#cafc03",
    "#fcad03",
    "#fc8403",
    "#fc4903",
    "red"
  ];
//loop through the intervals and the colors and generate a label
//with a colored square for each interval
for(var i = 0; i < intervals.length; i++)
{
  //inner html that sets the square for each interval and label
  div.innerHTML += "<i style='background: "
    + colors[i]
    + "'></i> "
    + intervals[i]
    + (intervals[i+1] ? "km-" + intervals [i+1] + "km<br>" : "+");
}
return div;
};

//add the legend to the map
legend.addTo(myMap);