export const scatterPlot = (data, widthProp, heightProp, groupBy) => {
  var margin = { top: 10, right: 30, bottom: 90, left: 40 },
    width = widthProp - margin.left - margin.right,
    height = heightProp - margin.top - margin.bottom;
  var svg = d3
    .select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //   Parse the Data
  var nested_data = d3
    .nest()
    .key(function (d) {
      return d["Flight Date"].split("-").slice(1, 2).join("-");
    })
    .sortKeys(d3.ascending)
    .rollup(function (leaves) {
      return {
        sum: d3.sum(leaves, function (d) {
          return 1;
        }),
        state: d3.group(leaves, (d) => {
          return d["Origin State"];
        }),
        specie: d3.group(leaves, (d) => {
          return d["Wildlife Species"];
        }),
      };
    })
    .entries(data);

  var bar_chart_data = nested_data.map(function (d) {
    return { date: d.key, sum: d.value.sum, specie: d.value.specie };
  });
  console.log(bar_chart_data);

  //   X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(bar_chart_data.map((d) => d.date))
    .padding(0.2);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .attr("marker-end", "url(#arrow)");

  //   svg
  //     .append("text")
  //     .attr("class", "x label")
  //     .attr("text-anchor", "end")
  //     .attr("x", width - 200)
  //     .attr("y", height + 80)
  //     .text("Sorted by Date");

  //   svg
  //     .append("path")
  //     .attr(
  //       "d",
  //       `m ${width - 150} ${
  //         height + 75
  //       } c 0 -2 0 -4 -2 -6 c 4 4 10 6 14 7 c -4 1 -10 3 -14 7 c 2 -2 2 -4 2 -6 l -40 0 l 0 -2 l 40 0`
  //     )
  //     .attr("stroke", "black");

  // Add Y axis
  console.log(d3.max(bar_chart_data.map((d) => d.sum)));
  var y = d3
    .scaleLinear()
    .domain([0, d3.max(bar_chart_data.map((d) => d.sum))])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y)).attr("marker-end", "url(#arrow)");

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

  var mouseover = function () {
    var data = d3.select(this).datum();
    tooltip
      .html("Strikes: " + data.sum + "<br>" + "Specie: " + data.specie + "<br>")
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
  var g = svg.selectAll("mybar").data(bar_chart_data).enter().append("g");
  //   dots on chart
  g.append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function (d) {
      return x(d.date) + x.bandwidth() / 2;
    })
    .attr("cy", function (d) {
      return y(0);
    })
    .attr("r", 0.1)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
  svg
    .selectAll("circle")
    .transition()
    .duration(800)
    .attr("cx", function (d) {
      return x(d.date) + x.bandwidth() / 2;
    })
    .attr("cy", function (d) {
      return y(d.sum);
    })
    .attr("r", 2)
    .delay(function (d, i) {
      return i * 10;
    });
};
