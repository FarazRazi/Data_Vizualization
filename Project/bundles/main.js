// import _data from "./birdstrikes.json" assert { type: "json" };
import { treeChart } from "./hierarchy.js";
import { scatterPlot } from "./scatterPlot.js";
import { bubblePlotLabels, camalize, sizeLabels } from "./utils.js";
var groupBy = "Time of day";

export const highlight = function (e, d) {
  document.getElementById("Origin State").click();
  d3.selectAll(".dot").style("opacity", 0.1);
  d3.selectAll("." + camalize(d.data[0])).style("opacity", 1);
  e.stopPropagation();
};
export const noHighlight = function (d) {
  console.log("no highlight");
  d3.selectAll(".dot").style("opacity", 1);
};
let options = document.querySelectorAll(".setGroupBtn");

function unselectAll() {
  for (let i = 0; i < options.length; i++) {
    options[i].style.boxShadow =
      " transparent 0 0 0 3px, rgba(18, 18, 18, 0.1) 0 6px 20px";
  }
}
const calculateData = (_data, time, groupBy) => {
  const nestedData = d3
    .nest()
    .key(function (d) {
      const [year, month, day] = d["Flight Date"].split("-").slice();
      if (time === "months") {
        const date = new Date(0, month, 0);
        // console.log(date);
        return date;
      } else if (time === "years") {
        const date = new Date(year, month, 0);
        // console.log(date);
        return date;
      }
    })
    .sortKeys(d3.ascending)
    .rollup(function (leaves) {
      return {
        grouped: d3.group(leaves, (d) => {
          return d[groupBy];
        }),
        costs: d3.group(leaves, (d) => {
          return d["Cost Total $"];
        }),
      };
    })
    .entries(_data);
  const groupedData = [];
  const allKeys = new Set();
  nestedData.forEach(function (d) {
    const costArray = Array.from(d.value.costs);
    Array.from(d.value.grouped, ([key, values], index) => {
      allKeys.add(key);
      groupedData.push({
        date: d.key,
        key: key,
        sum: values.length,
        values: values,
        cost: costArray[index] ? costArray[index][0] : "0",
      });
    });
  });

  const maxSum = d3.max(groupedData.map((d) => d.sum));
  const minSum = d3.min(groupedData.map((d) => d.sum));
  const maxCost = d3.max(groupedData.map((d) => parseInt(d.cost)));
  const minCost = d3.min(groupedData.map((d) => parseInt(d.cost)));
  const x = groupedData.map(function (d) {
    return new Date(d.date);
  });
  let maxDate, minDate;
  if (time === "months") {
    maxDate = new Date(1, 0, 0);
    minDate = new Date(0, 0, 0);
  } else {
    [minDate, maxDate] = d3.extent(x);
  }
  return {
    groupedData: groupedData,
    allKeys: allKeys,
    maxSum: maxSum,
    minSum: minSum,
    maxCost: maxCost,
    minCost: minCost,
    startDate: minDate,
    endDate: maxDate,
  };
};
d3.csv("./birdstrikes.csv").then((_data) => {
  let time = "months";
  let i;
  const width = 700;
  const height = 350;

  const data = calculateData(_data, time, groupBy);
  scatterPlot(data, width, height, groupBy);
  bubblePlotLabels(
    "labels",
    width,
    height - 50,
    [data.minCost, data.maxCost],
    data.allKeys
  );
  sizeLabels(
    "sizeLabels",
    [data.minCost, data.maxCost],
    [data.minCost, data.maxCost / 2, data.maxCost]
  );

  options.forEach((option) => {
    option.addEventListener("click", setGroupBy);
  });
  console.log(data.startDate, data.endDate);
  const numberOfYears = d3.timeYear.count(data.startDate, data.endDate);
  const timeScale = d3
    .scaleTime()
    .domain([data.startDate, data.endDate])
    .range([0, numberOfYears]);

  const div = document.getElementById("timeSlider");
  var valUp = 0;
  console.log(numberOfYears);
  d3.select("#timeSlider")
    .append("input")
    .attr("type", "range")
    .attr("min", 0)
    .attr("max", numberOfYears);

  const date = timeScale.invert();

  function setGroupBy(e) {
    unselectAll();
    groupBy = e.srcElement.id;
    this.style.boxShadow = "tomato 0 0 0 3px";
    const data = calculateData(_data, time, groupBy);
    scatterPlot(data, width, height, groupBy);
    bubblePlotLabels(
      "labels",
      width,
      height - 50,
      [data.minCost, data.maxCost],
      data.allKeys
    );
  }

  //console.log(loadedData);    //Printing all data on console
  const loadedData = _data.map((d) => {
    // console.log(d);
    return { originState: d["Origin State"], airportName: d["Airport Name"] };
  });

  let groupedData = d3.rollup(
    loadedData,
    (v) => v.length,
    (d) => d.originState,
    (d) => d.airportName
  );
  let root = d3.hierarchy(groupedData);
  console.log(root);
  var svg = treeChart("treeChart", root, data.allKeys, 800, 1000);
});
