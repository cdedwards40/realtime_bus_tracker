// add your own access token
mapboxgl.accessToken = accessToken;

// This is the map instance
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-71.104081, 42.365554],
  zoom: 12,
});

let busData = [];

async function updateBusInfo() {
  // clear out existing bus data
  busData = [];

  // fetch new data
  let response = await fetch('https://api-v3.mbta.com/vehicles');
  let data = await response.json();
  return data.data;
}

function formatBusData(data) {  
  data.forEach(x => {
    busData.push({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [x.attributes.longitude, x.attributes.latitude]
      },
      "properties": {
        "name": x.attributes.label,
        "status": x.attributes.current_status
      }
    })
  })
}

function setMarkerColor(status) {
  switch (status) {
    case "IN_TRANSIT_TO":
      return "#2dc937";
    case "STOPPED_AT":
      return "#cc3232";
    case "INCOMING_AT":
      return "#e7b416";
  }
}

function update() {
  updateBusInfo()
  .then(data => {
    formatBusData(data)
    busData.forEach(x => {
      let marker = new mapboxgl.Marker({
        color: setMarkerColor(x.properties.status)
      })
      .setLngLat(x.geometry.coordinates)
      .addTo(map)
    })
  })
}

update()