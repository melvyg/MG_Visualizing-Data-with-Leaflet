// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var tectonicPlatesUrl = 
"https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    var earthquakes = L.geoJson(earthquakeData, {

        onEachFeature: function (feature, layer){
          layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },

        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng, {
                radius: feature.properties.mag*30000,
                fillColor: earthquakeColor(feature.properties.mag),
                fillOpacity: .6,
                color: "white  ",
                weight: .5
          })
        }
      });

    createMap(earthquakes);
}

function earthquakeColor(mag) {
    return mag > 5 ? '#FE6C00' :
           mag > 4  ? '#FCB230' :
           mag > 3 ? '#ECC918' :
           mag > 2 ? '#FCE46C' :
           mag > 1   ? '#F6E488' :
                      '#58D68D';
}

function createMap(earthquakes) {

    // Define satellite, streetmap, and darkmap layers
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

    // Define a baseMaps object to hold our base layers 
    var baseMaps = {
        "Satellite Map": satellitemap,
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Define layer group to combine tectonic plate markings into one layer
    var tectPlates = new L.layerGroup ();

    d3.json(tectonicPlatesUrl, function (data) {
        L.geoJson(data, {
            color: "gold",
            weight: 2
        })
        .addTo(tectPlates);
    })

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        "Tectonic Plates" : tectPlates
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [31.7, -7.09],
        zoom: 3,
        layers: [satellitemap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control
        .layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

    // Create legend for magnitude levels
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        mag_level = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag_level.length; i++) {
        div.innerHTML +=
            '<i style="background:' + earthquakeColor(mag_level[i] + 1) + '"></i> ' +
            mag_level[i] + (mag_level[i + 1 ] ? '&ndash;' + mag_level[i + 1] + '<br>' : '+');
    }
        return div;
    };

    legend.addTo(myMap);
}
