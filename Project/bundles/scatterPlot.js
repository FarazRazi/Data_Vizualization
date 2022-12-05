import { colorRanges } from "./constants.js";
import {
  bubblePlotLabels,
  camalize,
  getColorScale,
  getSizeScale,
} from "./utils.js";
export const scatterPlot = (data, widthProp, heightProp, groupBy) => {
  d3.select("#barChart").selectAll("*").remove();
  var margin = { top: 20, right: 40, bottom: 40, left: 40 },
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

  //   X axis
  // console.log(data);
  var x = d3
    .scaleTime()
    .domain([new Date(data.startDate), new Date(data.endDate)])
    .range([20, width]);
  const xAxis = svg
    .append("g")
    .attr("transform", "translate(40," + height + ")")
    .call(
      d3.axisBottom(x).tickFormat(function (date) {
        return d3.timeFormat("%b")(date);
      })
    );
  svg
    .append("text")
    .attr("class", "main")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 36)
    .text("Time (months/years)");
  // Add Y axis
  var y = d3
    .scaleLog()
    .domain([data.minSum, data.maxSum])
    .range([height - 10, margin.top]);
  const yAxis = svg
    .append("g")
    .call(d3.axisLeft(y))
    .attr("transform", "translate(50, 0)")
    .attr("marker-end", "url(#arrow)");
  svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Frequency of Bird Strickes (number)");
  // Add Z axis for bubble size
  var z = getSizeScale([data.minCost, data.maxCost]);
  // Add color Scale
  var colScale = getColorScale(data.allKeys);

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = svg
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

  // Create the scatter variable: where both the circles and the brush take place
  var scatter = svg.append("g").attr("clip-path", "url(#clip)");

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
  // var line = d3
  //   .line()
  //   .x(function (d) {
  //     return x(new Date(d.time)) - x(new Date(0, 1, 0));
  //   })
  //   .y(function (d) {
  //     return y(d.value);
  //   });
  // A function that update the chart for given boundaries

  const drawPlot = () => {
    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    var zoom = d3
      .zoom()
      .scaleExtent([0.7, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", updateChart);

    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    svg
      .append("rect")
      .attr("width", width + margin.right)
      .attr("height", height + margin.bottom)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("transform", "translate(" + margin.right + ",0)")
      .call(zoom);
    // now the user can zoom and it will trigger the function called updateChart

    var g = scatter
      .selectAll("mybar")
      .data(data.groupedData)
      .enter()
      .append("g");
    g.append("circle")
      .attr("class", function (d) {
        return "dot " + camalize(d.key);
      })
      .attr("cx", function (d) {
        return x(new Date(d.date));
      })
      .attr("cy", function (d) {
        return height;
      })
      .attr("r", (d) => z(0))
      .attr("fill", (d) => colScale(d.key))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
    scatter
      .selectAll("circle")
      .transition()
      .duration(800)
      .attr("cy", function (d) {
        return y(d.sum);
      })
      .attr("r", (d) => z(d.cost))
      .delay(function (d, i) {
        return i * 1;
      });
    function updateChart(e) {
      // recover the new scale
      var newX = e.transform.rescaleX(x);
      var newY = e.transform.rescaleY(y);
      // update axes with these new boundaries
      xAxis.call(d3.axisBottom(newX));
      yAxis.call(d3.axisLeft(newY));
      // update circle position
      scatter
        .selectAll("circle")
        .attr("cx", function (d) {
          return newX(new Date(d.date));
        })
        .attr("cy", function (d) {
          return newY(d.sum);
        })
        .attr("fill", (d) => colScale(d.key))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    }
  };
  drawPlot();
};
