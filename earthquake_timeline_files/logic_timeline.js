// Store our API endpoint inside queryUrl
var tectonicPlatesUrl = 
"https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


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
    "Tectonic Plates" : tectPlates
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [31.7, -7.09],
    zoom: 3,
    layers: [satellitemap],
    maxBounds: [[90,-180], [-90, 180]]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control
    .layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

function eqfeed_callback(data){
    var getInterval = function(quake) {
        // earthquake data only has a time, so we'll use that as a "start"
        // and the "end" will be that + some value based on magnitude
        // 18000000 = 30 minutes, so a quake of magnitude 5 would show on the
        // map for 150 minutes or 2.5 hours
        return {
            start: quake.properties.time,
            end:   quake.properties.time + quake.properties.mag * 1800000
        };
        };
        var timelineControl = L.timelineSliderControl({
        formatOutput: function(date) {
            return new Date(date).toString();
        }
        });
        var timeline = L.timeline(data, {
        getInterval: getInterval,
        pointToLayer: function(data, latlng){
            var hue_min = 120;
            var hue_max = 0;
            var hue = data.properties.mag / 10 * (hue_max - hue_min) + hue_min;
            return L.circleMarker(latlng, {
            radius: data.properties.mag * 3,
            color: "hsl("+hue+", 100%, 50%)",
            fillColor: "hsl("+hue+", 100%, 50%)"
            }).bindPopup('<a href="'+data.properties.url+'">click for more info</a>');
        }
        });
        timelineControl.addTo(myMap);
        timelineControl.addTimelines(timeline);
        timeline.addTo(myMap);
}

