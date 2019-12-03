// Store our API endpoint inside queryUrl 
var springsURL = "https://raw.githubusercontent.com/juliasweet/TheThrilloftheChase/master/TreasureMap/convertcsv.geojson?token=ALYAINPOB5KHRY5NWL2M4GC5YIZWE";
var canyonsURL = "https://raw.githubusercontent.com/juliasweet/TheThrilloftheChase/master/TreasureMap/convertcsv2.geojson?token=ALYAINPOB5KHRY5NWL2M4GC5YIZWE";

// Create layers for layergroup

var springs = new L.LayerGroup();

d3.json(springsURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(springsURL) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup with name and state of spring
    function onEachFeature(feature, layer) {
        layer.bindPopup(feature.properties.SpringName +
            "<hr><p>" + feature.properties.State);
    }

    function style(feature, layer) {
        return {
            opacity: 0.5,
            radius: 5,
            weight: 1,
            color: "black",
            fillColor: "red",
            fillOpacity: 0.5
        }
    }


    var hotSprings = L.geoJSON(springsURL, {
        pointToLayer: function(_geometry, coordinates) {
            return L.circleMarker(coordinates);
        },
        onEachFeature: onEachFeature,
        style: style
    }).addTo(springs);

    // Sending our hotSprings layer to the createMap function
    createMap(springs);
}

var canyons = new L.LayerGroup();
// // Perform a GET request to the query URL
d3.json(canyonsURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures2 function
    createFeatures2(data.features);
});

function createFeatures2(canyonsURL) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup with name and state of canyon
    function onEachFeature(feature, layer) {
        layer.bindPopup(feature.properties.Canyon +
            "<hr><p>" + feature.properties.State);
    }

    function style(feature, layer) {
        return {
            opacity: 0.5,
            radius: 5,
            weight: 1,
            color: "black",
            fillColor: "yellow",
            fillOpacity: 0.5
        }
    }
    // Create a GeoJSON layer containing the features array on the data objects
    // Run the onEachFeature function once for each piece of data in the array
    var canyon = d3.json(canyonsURL, {
        pointToLayer: function(_geometry, coordinates) {
            return L.circleMarker(coordinates);
        },
        onEachFeature: onEachFeature,
        style: style
    }).addTo(canyons);

}

function createMap() {

    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openelevationmap.org/\">Openelevationmap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var pirates = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openelevationmap.org/\">Openelevationmap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.pirates",
        accessToken: API_KEY
    });

    var terrain = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openelevationmap.org/\">Openelevationmap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.mapbox-terrain-v2",
        accessToken: API_KEY
    });

    var terrain_rgb = L.tileLayer("https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openelevationmap.org/\">Openelevationmap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.mapbox-terrain-rgb",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        // "Elevation Map": elevationmap,
        "Satellite": satellite,
        "Terrain": terrain,
        "Treasure": pirates,
        "Shadow": terrain_rgb
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Hot Springs": springs,
        "Canyons": canyons
    };

    // Create our map, giving it the satellite and hotSprings layers to display on load
    var myMap = L.map("map", {
        center: [
            44.2643, -109.7879
        ],
        zoom: 5,
        layers: [satellite, springs]
    });


    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true,
        position: 'bottomright'
    }).addTo(myMap);


}