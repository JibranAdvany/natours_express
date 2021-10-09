export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamlicmFuYWR2YW5pIiwiYSI6ImNrdWlnM3lkNTA5bTcycG82cXpkMXdsNWoifQ.oxEgYcLmONJkBCbVD2L4Kw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jibranadvani/ckuihvsdod24419nswn1bdjm0',
    scrollZoom: false,
    // center: [-118.113491, 34.1111745],
    // zoom: 10,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Add a marker
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
