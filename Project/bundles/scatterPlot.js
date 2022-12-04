import { colorRanges } from "./constants.js";
import {
  bubblePlotLabels,
  camalize,
  getColorScale,
  getSizeScale,
} from "./utils.js";
export const scatterPlot = (data, widthProp, heightProp, groupBy) => {
  d3.select("#barChart").selectAll("*").remove();
  var margin = { top: 40, right: 10, bottom: 40, left: 30 },
    width = widthProp - margin.left - margin.right,
    height = heightProp - margin.top - margin.bottom;
  var svg = d3
    .select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // console.log(time, groupBy);

  var bar_chart_data = [];
  data.forEach(function (d) {
    Array.from(d.value.grouped, ([key, values]) => {
      bar_chart_data.push({
        date: d.key,
        key: key,
        sum: values.length,
        values: values,
      });
    });
  });
  // console.log(bar_chart_data);
  const maxSum = d3.max(bar_chart_data.map((d) => d.sum));
  const minSum = d3.min(bar_chart_data.map((d) => d.sum));

  const allKeys = new Set();
  bar_chart_data.forEach((d) => allKeys.add(d.key));
  //   X axis
  var x = d3
    .scaleTime()
    .domain([new Date(0, 0, 1), new Date(1, 0, 0)])
    .range([22, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(
      d3.axisBottom(x).tickFormat(function (date) {
        return d3.timeFormat("%b")(date);
      })
    );

  // Add Y axis
  var y = d3.scaleLog().domain([minSum, maxSum]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y)).attr("marker-end", "url(#arrow)");
  // Add Z axis for bubble size

  var z = getSizeScale([minSum, maxSum]);
  // Add color Scale
  var colScale = getColorScale(allKeys);
  const tooltip = d3
    .select("#barChart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  var mouseover = function (event, d) {
    tooltip
      .html("Strikes: " + d.sum + "<br>" + groupBy + ": " + d.key + "<br>")
      .style("opacity", 1);
    d3.selectAll(".dot").style("opacity", 0.1);
    d3.selectAll("." + camalize(d.key)).style("opacity", 1);
  };
  const mousemove = function (event, d) {
    tooltip
      .style("transform", "translateY(33%)")
      .style("left", event.x + 20 + "px")
      .style("top", event.y + 60 + "px");
  };
  const mouseleave = function (event, d) {
    d3.selectAll(".dot").style("opacity", 1);
    tooltip.style("opacity", 0);
  };
  const drawPlot = () => {
    var g = svg.selectAll("mybar").data(bar_chart_data).enter().append("g");
    g.append("circle")
      .attr("class", function (d) {
        return "dot " + camalize(d.key);
      })
      .attr("cx", function (d) {
        return x(new Date(d.date)) - x(new Date(0, 1, 0));
      })
      .attr("cy", function (d) {
        return height;
      })
      .attr("r", (d) => z(d.sum))
      .attr("fill", (d) => colScale(d.key))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
    svg
      .selectAll("circle")
      .transition()
      .duration(800)
      .attr("cy", function (d) {
        return y(d.sum);
      })
      .attr("r", (d) => z(d.sum))
      .delay(function (d, i) {
        return i * 1;
      });
  };
  drawPlot();
  bubblePlotLabels(
    width,
    heightProp,
    [minSum, maxSum],
    [4, 40],
    [minSum, maxSum / 2, maxSum],
    allKeys
  );
};
