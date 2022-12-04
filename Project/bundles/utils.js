import { colorRanges } from "./constants.js";

export const getColorScale = (allKeys) =>
  d3.scaleOrdinal().domain(allKeys).range(colorRanges);

export const getSizeScale = (domain) =>
  d3.scaleLinear().domain(domain).range([4, 40]);

export const bubblePlotLabels = (
  widthProp,
  heightProp,
  domain,
  range,
  valuesToShow,
  allgroups
) => {
  var height = heightProp;
  var width = 260;
  var svg = d3
    .select("#barChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // The scale you use for bubble size
  var size = getSizeScale(domain); // Size in pixel
  //   console.log(size(valuesToShow[2]));
  var xKeys = width * 0.2;
  var yKeys = height * 0.4;
  var xCircle = width * 0.5;
  var xLabel = width * 0.8;
  var yCircle = height * 0.8;
  // Add legend: circles
  var valuesToShow = valuesToShow;
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("circle")
    .attr("cx", xCircle)
    .attr("cy", function (d) {
      return yCircle - size(d);
    })
    .attr("r", function (d) {
      return size(d);
    })
    .style("fill", "none")
    .attr("stroke", "black");

  // Add legend: segments
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("line")
    .attr("x1", function (d) {
      return xCircle + size(d);
    })
    .attr("x2", xLabel)
    .attr("y1", function (d) {
      return yCircle - size(d);
    })
    .attr("y2", function (d) {
      return yCircle - size(d);
    })
    .attr("stroke", "black")
    .style("stroke-dasharray", "2,2");

  // Add legend: labels
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("text")
    .attr("x", xLabel)
    .attr("y", function (d) {
      return yCircle - size(d);
    })
    .text(function (d) {
      return d;
    })
    .style("font-size", 10)
    .attr("alignment-baseline", "middle");

  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("text")
    .attr("x", xCircle - 45)
    .attr("y", yCircle + 10)
    .text("Bubble size Chart")
    .style("font-size", 10)
    .attr("alignment-baseline", "middle");

  var highlight = function (e, d) {
    console.log(d.replace(" ", "."));
    d3.selectAll(".dot").style("opacity", 0.1);
    d3.selectAll("." + d.replace(" ", ".")).style("opacity", 1);
  };
  var noHighlight = function (d) {
    d3.selectAll(".dot").style("opacity", 1);
  };

  const myColor = getColorScale(allgroups);
  // Add one dot in the legend for each name.
  var size = 20;
  svg
    .selectAll("legend")
    .data(allgroups)
    .enter()
    .append("circle")
    .attr("class", function (d) {
      return "dot " + d;
    })
    .attr("cx", xKeys)
    .attr("cy", function (d, i) {
      return 10 + i * (size + 5);
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 4)
    .style("fill", function (d) {
      return myColor(d);
    })
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);

  // Add labels beside legend dots
  svg
    .selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
    .attr("x", xKeys * 1.2)
    .attr("y", function (d, i) {
      return i * (size + 5) + size / 2;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d) {
      return myColor(d);
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);
};
