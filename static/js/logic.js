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
    zoom: 3,
    layers: [greyscale, waterColor, topMap, defaultMap]
  });

  // add the default map to the map
  defaultMap.addTo(myMap);

  //add the layer control 
  L.control 
    .layers(baseMap)
    .addTo(myMap);

  //create the info for the overlay of the earthquakes
  let earthquakes = new L.layerGroup();

  //get the data for the earthquakes and populate the layergroup
  //call teh USGS GeoJson API
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(
    function(earthquakeData){
    //console.log(earthquakeData); 
    //plot circles where radius is dependent on the magnitude and color is dependent on the depth  
    }
  );