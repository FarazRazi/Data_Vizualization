import data from "./flare.json" assert { type: "json" };

// console.log("Data: ", data);
console.log("Script Started");

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 90, left: 40 },
  width = 1080 - margin.left - margin.right,
  height = 720 - margin.top - margin.bottom;
// console.log("Margin: ", margin);

// append the svg object to the body of the page
var svg = d3
  .select("#radialTree")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
const traverseTree = (node, x, y, parent) => {
  if (node.children && node.children.length === 0) {
    addNode(mid, y);
    return;
  } else {
    // add Vertical Scale
    var mid = 0;
    var xValue = 0;
    for (var i = 0; node.children && i < node.children.length; i++) {
      mid += 10;
    }
    for (var i = 0; node.children && i < node.children.length; i++) {
      xValue += 20;
      traverseTree(node.children[i], x + xValue, y + 30, {
        name: node.data.name,
        parent: null,
        x: mid,
        y: y,
      });
    }
    addNode(mid, y);
    addPath([
      [parent ? parent.x : mid, parent ? parent.y : y],
      [mid, y],
    ]);
    return;
  }
};
// var tooltip = d3
//   .select("#radialTree")
//   .append("div")
//   .style("opacity", 0)
//   .attr("class", "tooltip")
//   .style("background-color", "white")
//   .style("border", "solid")
//   .style("border-width", "2px")
//   .style("border-radius", "5px")
//   .style("padding", "5px")
//   .style("position", "absolute");
// var mouseover = function (d) {
//   var data = d3.select(this).datum();
//   console.log(data);
//   tooltip.html("Name: " + data.name + "<br>").style("opacity", 1);
// };
// const mousemove = function (event, d) {
//   tooltip
//     .style("transform", "translateY(-33%)")
//     .style("left", event.x / 2 + "px")
//     .style("top", event.y / 2 + "px");
// };
// const mouseleave = function (event, d) {
//   tooltip.style("opacity", 0);
// };

const addNode = (x, y, data) => {
  var g = svg
    .selectAll("#radialTree")
    .data([{ x: x, y: y, data: data }])
    .enter()
    .append("g");
  g.append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", 3);
  // .on("mouseover", mouseover)
  // .on("mousemove", mousemove)
  // .on("mouseleave", mouseleave);
};
const addPath = (p) => {
  // console.log(p);
  var line = d3.line();
  svg
    .selectAll("radialTree")
    .data(p)
    .enter()
    .append("path")
    .attr("class", "line") // Assign a class for styling
    .attr("d", line(p));
};
let sample = d3.hierarchy(data);

// console.log(sample);
var tree = traverseTree(sample, 10, 10);
function* visit_iterative(tree) {
  const pending = [{ x: 0, y: 250, node: tree }];
  addNode(0, 250);
  while (pending.length > 0) {
    const { x, y, node } = pending.shift();
    var j = 0;
    yield { x, y, node };
    if (node.children)
      for (const child of node.children) {
        j += 10;
        //Check Overlap
        // pending.map((prev) => {
        //   if (prev?.x >= x) j += 10;
        // });
        pending.push({
          x: j,
          y: y + 60,
          node: child,
        });
        addNode(j, y + 60, node.data);
        addPath([
          [x, y],
          [j, y + 60],
        ]);
      }
  }
}
var tree = [];

for (const item of visit_iterative(sample)) {
  const { path, node } = item;
  tree.push(item);
  // console.log(
  //   `${["{root}", ...path, node.id].join(" > ")}: child_count=${
  //     node.children.length
  //   }`
  // );
}
console.log(tree);
