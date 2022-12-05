import { highlight, noHighlight } from "./main.js";
import { camalize, getColorScale, getSizeScale } from "./utils.js";

const drag = (simulation) => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};
export const treeChart = (chartId, root, allkeys, widthProp, heightProp) => {
  d3.select("#" + chartId)
    .selectAll("*")
    .remove();

  const links = root.links();
  const nodes = root.descendants();
  const z = getSizeScale([0, 1000]);
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(100)
        .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("x", d3.forceX(400))
    .force("y", d3.forceY(300));
  var margin = { top: 20, right: 40, bottom: 40, left: 20 },
    width = widthProp - margin.left - margin.right,
    height = heightProp - margin.top - margin.bottom;
  var svg = d3
    .select("#" + chartId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line");
  const node = svg
    .append("g")
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("class", (d) => {
      if (d.data[0]) return "dot " + camalize(d.data[0]);
    })
    .attr("fill", (d) => (d.children ? "#000" : "#fff"))
    .attr("stroke", (d) => (d.children ? "#fff" : "#000"))
    .attr("r", (d) => (d.children ? 10 : z(d.data[1])))
    .on("click", highlight)
    // .on("click", noHighlight)
    .call(drag(simulation));
  document.onclick = function (event) {
    noHighlight();
  };
  node.append("title").text((d) => d.data[0]);
  var colScale = getColorScale(allkeys);
  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    node
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("fill", (d) => {
        return colScale(d.data[0]);
      });
  });
  //   simulation.stop();
  return svg.node();
};
