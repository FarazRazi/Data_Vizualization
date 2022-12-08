import {
  bubblePlotLabels,
  camalize,
  getColorScale,
  getSizeScale,
  sizeLabels,
} from "./utils.js";

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
export const treeChart = (chartId, root, data, widthProp, heightProp) => {
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
    .force("charge", d3.forceManyBody().strength(-100))
    .force("x", d3.forceX(400))
    .force("y", d3.forceY(200));
  var margin = { top: 40, right: 40, bottom: 40, left: 40 },
    width = widthProp - margin.left - margin.right,
    height = heightProp - margin.top - margin.bottom;
  var svg = d3
    .select("#" + chartId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("cursor", "move");
  bubblePlotLabels(
    svg,
    width,
    height - 50,
    [data.minCost, data.maxCost],
    data.allKeys
  );
  sizeLabels(
    svg,
    [data.minSum, data.maxSum],
    [data.minSum, data.maxSum / 2, data.maxSum]
  );
  svg = svg.merge(svg);
  let g = svg.append("g");

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
  const selectNode = (e, d) => {
    d3.selectAll(".dot").style("opacity", 0.1);
    d3.selectAll("." + camalize(d.data[0])).each(function (l) {
      this.classList.toggle("clicked");
    });
    d3.selectAll(".clicked").style("opacity", 1);
    console.log("Clicked On");
    e.stopPropagation();
  };
  document.onclick = function (event) {
    console.log("Clicked Outside");
    d3.selectAll(".dot").style("opacity", 1);
  };
  const highlight = function (e, d) {
    if (d.children) {
      //parent
      tooltip
        .html("Grouped By State " + ": " + d.data[0] + "<br>")
        .style("opacity", 1);
    } else {
      tooltip
        .html(
          "Strikes: " +
            d.data[1] +
            "<br>" +
            "Grouped By" +
            ": " +
            d.data[0] +
            "<br>"
        )
        .style("opacity", 1);
    }
    // document.getElementById("Origin State").click();
    // d3.selectAll(".dot").style("opacity", 0.1);
    // d3.selectAll("." + camalize(d.data[0])).style("opacity", 1);
    // e.stopPropagation();
  };
  const moveHighlight = function (event, d) {
    tooltip
      .style("transform", "translateY(33%)")
      .style("left", event.x + 20 + "px")
      .style("top", event.y + 60 + "px");
  };
  const noHighlight = function (d) {
    // console.log("no highlight");
    // d3.selectAll(".dot").style("opacity", 1);
    tooltip.style("opacity", 0);
  };
  const link = g
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line");
  const node = g
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
    .on("click", selectNode)
    .on("mouseover", highlight)
    .on("mousemove", moveHighlight)
    .on("mouseleave", noHighlight)
    .call(drag(simulation));
  node.append("title").text((d) => d.data[0]);
  // console.log(allkeys);
  var colScale = getColorScale(data.allKeys);
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
  //add zoom capabilities
  let zoomHandler = d3.zoom().on("zoom", zoomAction);
  //Zoom functions
  function zoomAction(e) {
    g.attr(
      "transform",
      `translate(${e.transform.x}, ${e.transform.y})` +
        "scale(" +
        e.transform.k +
        ")"
    );
  }
  zoomHandler(svg);
  return svg.node();
};
