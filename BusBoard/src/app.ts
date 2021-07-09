import express from "express";
import getBuses from "./getBuses";
import getBusStops from "./getBusStops";

const app = express();
const port = 3000;

app.use('/', express.static('src'));

app.get("/departureBoards/:postCode", async (req, res) => {
  const { postCode } = req.params;
  const busStops = await getBusStops(postCode);

  const busRequests = busStops.map((busStop) => getBuses(busStop.naptanId));

  const busInfo = await Promise.all(busRequests);

  var obj = {};

  busStops.forEach((busStop, i) => {
    obj = {
      ...obj,
      [`${busStop.commonName} ${busStop.stopLetter ?? ""}`.trim()]: busInfo[i],
    };
  });

  res.json(obj);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
