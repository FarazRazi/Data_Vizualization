// import _data from "./birdstrikes.json" assert { type: "json" };
import { scatterPlot } from "./scatterPlot.js";
d3.csv("./birdstrikes.csv").then((_data) => {
  // console.log("Data Added", _data);
  let groupBy = "months";
  // console.log("flight Data", _data[0]["Flight Date"]);
  scatterPlot(_data, 680, 360, groupBy);
  const toggleTime = () => {
    if (groupBy === "months") groupBy = "years";
    else groupBy = "months";
    scatterPlot(_data, 680, 360, groupBy);
  };
  // toggleTime();
  let x = document.getElementById("demo");
  x.addEventListener("click", toggleTime);
});
