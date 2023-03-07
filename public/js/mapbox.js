/* eslint-disable */

// console.log('hello from the client side');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations); 

mapboxgl.accessToken =
'pk.eyJ1IjoieWxldmVudGhhbCIsImEiOiJjbGVyYncweWQwMTVwM3ZxeHQydWprc3hqIn0.WfcuEzVTsVOBFYn-K8Rh8Q';


var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/yleventhal/clercrhxo006e01ne8b7vxehm',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    zoom: 10,
    // interactive: false
});


    const bounds = new mapboxgl.LngLatBounds();
  
    locations.forEach(loc => {
      // Create marker
      const el = document.createElement('div');
      el.className = 'marker';
  
      // Add marker markers are defined in css
      new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat(loc.coordinates)
        .addTo(map);
  
      // Add popup
      new mapboxgl.Popup({
        offset: 30
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);
  
      // Extend map bounds to include current location
      bounds.extend(loc.coordinates)
    });

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
      }
    });
  
  