// import _data from "./birdstrikes.json" assert { type: "json" };
import { scatterPlot } from "./scatterPlot.js";
d3.csv("./birdstrikes.csv").then((_data) => {
  console.log("Data Added", _data);
  console.log("flight Data", _data[0]["Flight Date"]);
  scatterPlot(_data, 680, 360);
});
