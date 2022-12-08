import { camalize, getColorScale } from "./utils.js";

export const radialPlot = (dataG, _data, chartId, widthProp, heightProp) => {
  const grouped = d3.rollup(
    _data,
    (v) => v.length,
    (d) => d["Origin State"],
    (d) => d["Airport Name"],
    (d) => d["Aircraft Make Model"],
    (d) => d["Cost Total $"]
  );
  let root = d3.hierarchy(grouped);
  let createRadialTree = function (input) {
    d3.select("#" + chartId)
      .selectAll("*")
      .remove();
    var margin = { top: 40, right: 40, bottom: 40, left: 40 },
      width = widthProp - margin.left - margin.right,
      height = heightProp - margin.top - margin.bottom;
    var svg = d3
      .select("#" + chartId)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(
        d3.zoom().on("zoom", function (e) {
          svg.attr("transform", e.transform);
        })
      )
      .append("g");

    // Add color Scale
    var colScale = getColorScale(dataG.allKeys);
    //Legends
    svg
      .append("circle")
      .attr("cx", 35)
      .attr("cy", 30)
      .attr("r", 4)
      .style("fill", "black");

    svg
      .append("circle")
      .attr("cx", 35)
      .attr("cy", 40)
      .attr("r", 4)
      .style("fill", "#92DCE5");

    svg
      .append("circle")
      .attr("cx", 35)
      .attr("cy", 50)
      .attr("r", 4)
      .style("fill", "#077187");

    svg
      .append("circle")
      .attr("cx", 35)
      .attr("cy", 60)
      .attr("r", 4)
      .style("fill", "#360568");

    svg
      .append("circle")
      .attr("cx", 35)
      .attr("cy", 70)
      .attr("r", 4)
      .style("fill", "#BF9ACA");

    svg
      .append("text")
      .attr("x", 40)
      .attr("y", 30)
      .text("Root")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle")
      .attr("position", "fixed");
    svg
      .append("text")
      .attr("x", 40)
      .attr("y", 40)
      .text("States")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 40)
      .attr("y", 50)
      .text("Airport Name")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 40)
      .attr("y", 60)
      .text("Aircraft Model")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 40)
      .attr("y", 70)
      .text("Total Cost")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");

    ///Legends
    let diameter = height * 0.75;
    let radius = diameter / 2;

    let tree = d3
      .tree()
      .size([2 * Math.PI, radius])
      .separation(function (a, b) {
        return (a.parent == b.parent ? 1 : 2) / a.depth;
      });

    let data = d3.hierarchy(input);

    let treeData = tree(data);

    let nodes = treeData.descendants();
    let links = treeData.links();

    let graphGroup = svg
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    graphGroup
      .selectAll(".link")
      .data(links)
      .join("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkRadial()
          .angle((d) => d.x)
          .radius((d) => d.y)
      );

    const tooltip = d3
      .select("#" + chartId)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute");
    const highlight = function (e, d) {
      if (d.children) {
        //parent
        tooltip
          .html("Grouped By " + ": " + d.data.data[0] + "<br>")
          .style("opacity", 1);
      } else {
        tooltip.html("Strikes: " + d.data[1] + "<br>").style("opacity", 1);
      }
      // document.getElementById("Origin State").click();
      d3.selectAll(".dot").style("opacity", 0.1);
      d3.selectAll("." + camalize(d.data.data[0])).style("opacity", 1);
      e.stopPropagation();
    };
    const moveHighlight = function (event, d) {
      tooltip
        .style("transform", "translateY(33%)")
        .style("left", event.x + 20 + "px")
        .style("top", event.y + 60 + "px");
    };
    const noHighlight = function (d) {
      // console.log("no highlight");
      d3.selectAll(".dot").style("opacity", 1);
      tooltip.style("opacity", 0);
    };
    let node = graphGroup
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return `rotate(${(d.x * 180) / Math.PI - 90})` + `translate(${d.y}, 0)`;
      })
      .append("circle")
      .attr("class", (d) => {
        if (d.data[0]) return "dot " + camalize(d.data[0]);
      })
      .attr("r", 3)
      .on("mouseover", highlight)
      .on("mousemove", moveHighlight)
      .on("mouseleave", noHighlight)
      //   .attr("fill", (d) => colScale(d.data[0]));
      .attr("fill", function (d) {
        if (d.depth == 1) {
          return "#92DCE5";
        } else if (d.depth == 2) {
          return "#077187";
        } else if (d.depth == 3) {
          return "#360568";
        } else if (d.depth == 4) {
          return "#BF9ACA";
        }
      });

    ////////////appending names
    node.append("title").text((d) => {
      if (!d.children) return `${d.data.data[0]}`;
      else {
        return `${d.data.data[0]}`;
      }
    });
  };

  ///////////calling create node
  createRadialTree(root);
};
