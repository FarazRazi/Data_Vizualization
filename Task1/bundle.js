import students from "./students.json" assert { type: "json" };

// console.log("Students Added", students);
// console.log("Script Started");

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 90, left: 40 },
  width = 720 - margin.left - margin.right,
  height = 480 - margin.top - margin.bottom;
// console.log("Margin: ", margin);

// append the svg object to the body of the page
var svg = d3
  .select("#barChart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
// X axis
var x = d3
  .scaleBand()
  .range([0, width])
  .domain(
    students
      // sort by creation date
      .sort((a, b) =>
        a.create_time > b.create_time
          ? 1
          : b.create_time > a.create_time
          ? -1
          : 0
      )
      .map((d) => d.name)
  )
  .padding(0.2);

svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end")
  .attr("marker-end", "url(#arrow)");

svg
  .append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width - 200)
  .attr("y", height + 80)
  .text("Students Sorted by Creation Date");
svg
  .append("path")
  .attr(
    "d",
    `m ${width - 150} ${
      height + 75
    } c 0 -2 0 -4 -2 -6 c 4 4 10 6 14 7 c -4 1 -10 3 -14 7 c 2 -2 2 -4 2 -6 l -40 0 l 0 -2 l 40 0`
  )
  .attr("stroke", "black");

// Add Y axis
var y = d3.scaleLinear().domain([0, 4]).range([height, 0]);
var y2 = d3.scaleLinear().domain([0, 100]).range([height, 0]);
svg.append("g").call(d3.axisLeft(y)).attr("marker-end", "url(#arrow)");
svg
  .append("path")
  .attr("transform", "rotate(-90, -50,60)")
  .attr(
    "d",
    `m ${-150} ${75} c 0 -2 0 -4 -2 -6 c 4 4 10 6 14 7 c -4 1 -10 3 -14 7 c 2 -2 2 -4 2 -6 l -40 0 l 0 -2 l 40 0`
  )
  .attr("stroke", "black");
svg
  .append("text")
  .attr("class", "x label")
  .attr("transform", "rotate(-90, -50,60)")
  .attr("text-anchor", "end")
  .attr("x", -200)
  .attr("y", 85)
  .text("GPA");

var tooltip = d3
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

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function (d) {
  // console.log(d);
  // console.log(d3.select(this).datum());
  var data = d3.select(this).datum();
  tooltip
    .html(
      "Name: " +
        data.name +
        "<br>" +
        "GPA: " +
        data.gpa +
        "<br>" +
        "Interest: " +
        data.interests.map((item) => " " + item) +
        "<br>" +
        "Created On: " +
        data.create_time
    )
    .style("opacity", 1);
};
var mouseover2 = function (d) {
  // console.log(d);
  // console.log(d3.select(this).datum());
  var data = d3.select(this).datum();
  tooltip
    .html(
      "Name: " +
        data.name +
        "<br>" +
        "Age: " +
        data.age +
        "<br>" +
        "Favorites: <br>" +
        "Color: " +
        data.favorites.color +
        "<br>" +
        "Sport: " +
        data.favorites.sport +
        "<br>" +
        "Food: " +
        data.favorites.food +
        "<br>"
    )
    .style("opacity", 1);
};
const mousemove = function (event, d) {
  tooltip
    .style("transform", "translateY(-33%)")
    .style("left", event.x / 2 + "px")
    .style("top", event.y / 2 + "px");
};
const mouseleave = function (event, d) {
  tooltip.style("opacity", 0);
};

// Bars
svg
  .selectAll("mybar")
  .data(students)
  .enter()
  .append("rect")
  .attr("x", function (d) {
    return x(d.name);
  })
  .attr("width", x.bandwidth())
  .attr("fill", "#69b3a2")
  // no bar at the beginning thus:
  .attr("height", function (d) {
    return height - y(0);
  }) // always equal to 0
  .attr("y", function (d) {
    return y(0);
  })
  .attr("class", function (d) {
    var s = "bar ";
    if (d.gpa > 3) {
      return s + "bar1";
    } else if (d.gpa > 2) {
      return s + "bar2";
    } else {
      return s + "bar3";
    }
  })
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);

// labels on the bar chart
svg
  .selectAll("mybar")
  .data(students)
  .enter()
  .append("text")
  .attr("dy", "1.3em")
  .attr("x", function (d) {
    return x(d.name) + x.bandwidth() / 2;
  })
  .attr("y", function (d) {
    return y(d.gpa);
  })
  .attr("text-anchor", "middle")
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "black")
  .text(function (d) {
    return d.gpa;
  });

var line = d3
  .line()
  .x(function (d, i) {
    return x(d.name) + x.bandwidth() / 2;
  })
  .y(function (d) {
    return y2(d.age);
  })
  .curve(d3.curveMonotoneX);

let repeat = () => {
  // Uncomment following line to clear the previously drawn line
  // svg.selectAll("path").remove();
  var path = svg
    .selectAll("mybar")
    .data(students)
    .enter()
    .append("path")
    .attr("class", "line") // Assign a class for styling
    .attr("d", line(students)); // 11. Calls the line generator
  var totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)
    .on("end");
};
repeat();

// dots on chart
var g = svg.selectAll("mybar").data(students).enter().append("g");
g.append("circle") // Uses the enter().append() method
  .attr("class", "dot") // Assign a class for styling
  .attr("cx", function (d) {
    return x(d.name) + x.bandwidth() / 2;
  })
  .attr("cy", function (d) {
    return y2(d.age);
  })
  .attr("r", 12)
  .on("mouseover", mouseover2)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);

g.append("text")
  .attr("dx", function (d) {
    return x(d.name) + 17;
  })
  .attr("dy", function (d) {
    return y2(d.age) + 5;
  })
  .text(function (d) {
    return d.age;
  })
  .on("mouseover", mouseover2)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);
// Animation
svg
  .selectAll("rect")
  .transition()
  .duration(800)
  .attr("y", function (d) {
    return y(d.gpa);
  })
  .attr("height", function (d) {
    return height - y(d.gpa);
  })
  .delay(function (d, i) {
    console.log(i);
    return i * 100;
  });
