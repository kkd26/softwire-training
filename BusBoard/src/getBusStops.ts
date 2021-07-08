import axios from "axios";

interface Location {
  longitude: number;
  latitude: number;
}

const stopTypes: string[] = [
  "NaptanBusCoachStation",
  "NaptanBusWayPoint",
  "NaptanOnstreetBusCoachStopCluster",
  "NaptanOnstreetBusCoachStopPair",
  "NaptanPrivateBusCoachTram",
  "NaptanPublicBusCoachTram",
];

async function getLocation(postCode: string) {
  const URL = `https://api.postcodes.io/postcodes/${postCode}`;
  const { data } = await axios.get<{ result: Location }>(URL);

  const { longitude, latitude } = data.result;

  return { longitude, latitude };
}

interface BusStop {
  naptanId: string;
  commonName: string;
}

export default async function getBusStops(
  postCode: string,
  radius: number = 200,
  num: number = 2
) {
  const { longitude: lon, latitude: lat } = await getLocation(postCode);
  const URL = `https://api.tfl.gov.uk/StopPoint`;
  const { data } = await axios.get<{ stopPoints: BusStop[] }>(URL, {
    params: { stopTypes: stopTypes.join(","), radius, lat, lon },
  });

  return data.stopPoints.slice(0, num);
}
