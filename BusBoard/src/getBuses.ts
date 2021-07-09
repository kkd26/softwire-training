import axios from "axios";

interface BusInfo {
  expectedArrival: string;
  lineName: string;
  destinationName: string;
}

export default async function getBuses(
  stopId: string,
  num: number = 5
): Promise<BusInfo[]> {
  const URL = `https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals`;
  const { data } = await axios.get<BusInfo[]>(URL);

  return data
    .sort((a, b) => {
      return a.expectedArrival.localeCompare(b.expectedArrival);
    })
    .slice(0, num)
    .map((busInfo) => {
      const { expectedArrival, lineName, destinationName } = busInfo;
      return { expectedArrival, lineName, destinationName };
    });
}
