// import _data from "./birdstrikes.json" assert { type: "json" };
import { scatterPlot } from "./scatterPlot.js";
d3.csv("./birdstrikes.csv").then((_data) => {
  let groupBy = "Time of day";
  scatterPlot(_data, 680, 360, groupBy, "months");
  function setGroupBy(e) {
    // console.log(e.srcElement.id);
    groupBy = e.srcElement.id;
    scatterPlot(_data, 680, 360, groupBy, "months");
  }
  let grpbtn = document.getElementsByClassName("setGroupBtn");
  Array.from(grpbtn).forEach(function (element) {
    element.addEventListener("click", setGroupBy);
  });
});
