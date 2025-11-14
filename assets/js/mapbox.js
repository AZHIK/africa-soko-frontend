const MAPBOX_TOKEN = "pk.eyJ1IjoiZmFuZXZlc2FsIiwiYSI6ImNtZWNpcnUzOTBuNWsya3Njc2NkeWwwa2YifQ._LFk6HbPjUmwy4sHnpH0jA";

async function getDrivingDistanceKm(start, end) {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(url);

  if (!data.routes || data.routes.length === 0)
    throw new Error("No route found");

  const distanceMeters = data.routes[0].distance;
  return distanceMeters / 1000; // km
}

(async () => {
  const from = [-6.787682,39.130098]; // Dar es Salaam (lat, lng)
  const to = [-6.790388,39.201878];

  const dist = await getDrivingDistanceKm(from, to);
  console.log("Road distance:", dist.toFixed(2), "km");
})();