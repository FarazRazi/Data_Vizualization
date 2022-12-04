// import _data from "./birdstrikes.json" assert { type: "json" };
import { scatterPlot } from "./scatterPlot.js";
const calculateData = (_data, time, groupBy) =>
  d3
    .nest()
    .key(function (d) {
      if (time === "months") {
        const date = new Date(
          0,
          d["Flight Date"].split("-").slice(1, 2).join("-"),
          15
        );
        // console.log(date);
        return date;
      } else if (time === "years") {
        const date = new Date(
          d["Flight Date"].split("-").slice(0, 1).join("-"),
          d["Flight Date"].split("-").slice(1, 2).join("-"),
          1
        );
        // console.log(date);
        return date;
      }
    })
    .sortKeys(d3.ascending)
    .rollup(function (leaves) {
      return {
        sum: d3.sum(leaves, function (d) {
          return 1;
        }),
        // state: d3.group(leaves, (d) => {
        //   return d["Origin State"];
        // }),
        grouped: d3.group(leaves, (d) => {
          return d[groupBy];
        }),
      };
    })
    .entries(_data);
d3.csv("./birdstrikes.csv").then((_data) => {
  let groupBy = "Time of day";
  let time = "months";
  let options = document.querySelectorAll(".setGroupBtn");
  let i;
  function unselectAll() {
    for (i = 0; i < options.length; i++) {
      options[i].style.boxShadow =
        " transparent 0 0 0 3px, rgba(18, 18, 18, 0.1) 0 6px 20px";
    }
  }
  options.forEach((option) => {
    option.addEventListener("click", setGroupBy);
  });
  function setGroupBy(e) {
    unselectAll();
    this.style.boxShadow = "tomato 0 0 0 3px";
    groupBy = e.srcElement.id;
    scatterPlot(calculateData(_data, time, groupBy), 560, 360, groupBy);
  }
});
