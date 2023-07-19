// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Create a tile layer using a base map (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

// Fetch the earthquake data from a URL
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson')
  .then(response => response.json())
  .then(data => {
    // Iterate over the features
    data.features.forEach(function(feature) {
      // Extract the coordinates, magnitude, and depth
      var coordinates = feature.geometry.coordinates;
      var lat = coordinates[1];
      var lng = coordinates[0];
      var magnitude = feature.properties.mag;
      var depth = coordinates[2];

      // Create a marker for each earthquake
      var marker = L.circleMarker([lat, lng], {
        radius: getMarkerSize(magnitude),
        fillColor: getMarkerColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      // Add a popup with earthquake information
      marker.bindPopup('<strong>' + feature.properties.title + '</strong><br>Magnitude: ' + magnitude + '<br>Depth: ' + depth);
    });
  })
  .catch(error => {
    console.log('Error fetching earthquake data:', error);
  });

// Create a legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend');
  var depths = [0, 10, 30, 50, 70, 100];
  var labels = ['<strong>Depth (km)</strong>'];
  
  for (var i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getMarkerColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }
  div.innerHTML = labels.join('<br>') + div.innerHTML;
  
  return div;
};

legend.addTo(map);
