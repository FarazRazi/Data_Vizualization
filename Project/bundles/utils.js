import { colorRanges } from "./constants.js";

export const getColorScale = (allKeys) =>
  d3.scaleOrdinal().domain(allKeys).range(colorRanges);

export const getSizeScale = (domain) =>
  d3.scaleLinear().domain(domain).range([4, 40]);

export const camalize = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};
export const sizeLabels = (chartId, domain, valuesToShow) => {
  d3.select("#" + chartId)
    .selectAll("*")
    .remove();

  var svg = d3.select("#" + chartId).append("svg");
  var width = 300;
  var height = 300;
  var xCircle = width * 0.5;
  var xLabel = width * 0.8;
  var yCircle = height * 0.3;
  // Add legend: circles
  var valuesToShow = valuesToShow;
  var size = getSizeScale(domain); // Size in pixel

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
      return d + " $";
    })
    .style("font-size", 10)
    .attr("alignment-baseline", "middle");

  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("text")
    .attr("x", xCircle - 90)
    .attr("y", yCircle + 20)
    .text("Total strike costs = others + repair ")
    .style("font-size", 10)
    .attr("alignment-baseline", "middle");
};
export const bubblePlotLabels = (
  chartId,
  widthProp,
  heightProp,
  domain,
  allgroups
) => {
  var height = heightProp - 100;
  var width = 220;
  d3.select("#" + chartId)
    .selectAll("*")
    .remove();
  var svg = d3
    .select("#" + chartId)
    .append("svg")
    .attr("height", 600);
  // The scale you use for bubble size
  var size = getSizeScale(domain); // Size in pixel
  //   console.log(size(valuesToShow[2]));
  var xKeys = width * 0.1;

  var highlight = function (e, d) {
    d3.selectAll(".dot").style("opacity", 0.1);
    d3.selectAll("." + camalize(d)).style("opacity", 1);
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
      return "dot " + camalize(d);
    })
    .attr("cx", function (d, i) {
      return xKeys * (i % 2 ? 1 : 10);
    })
    .attr("cy", function (d, i) {
      return ((i + 1) % 2 ? i + 1 : i) * size * 0.5;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 5)
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
    .attr("x", function (d, i) {
      return xKeys * (i % 2 ? 1.7 : 10.7);
    })
    .attr("y", function (d, i) {
      return ((i + 1) % 2 ? i + 1 : i) * size * 0.5;
    })
    .style("fill", function (d) {
      return myColor(d);
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("font-size", "12")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);
};
