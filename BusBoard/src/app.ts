import express from "express";
import getBuses from "./getBuses";
import getBusStops from "./getBusStops";

const app = express();
const port = 3000;

type ErrorMessage = {
  message: string;
};

app.use("/", express.static("src/public"));

app.get("/departureBoards", (req, res) => {
  const errorMessage: ErrorMessage = {
    message: "Empty postcode",
  };
  res.status(400).send(errorMessage);
});

app.get("/departureBoards/:postCode", async (req, res) => {
  const { postCode } = req.params;

  try {
    const busStops = await getBusStops(postCode);

    const busRequests = busStops.map((busStop) => getBuses(busStop.naptanId));

    const busInfo = await Promise.all(busRequests);
    var obj = {};

    busStops.forEach((busStop, i) => {
      obj = {
        ...obj,
        [`${busStop.commonName} ${busStop.stopLetter ?? ""}`.trim()]:
          busInfo[i],
      };
    });
    res.json(obj);
  } catch (err) {
    const { status, data } = err.response;
    const errorMessage: ErrorMessage = {
      message: data.message || data.error,
    };
    res.status(status).send(errorMessage);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
