export const scatterPlot = (data, widthProp, heightProp, groupBy) => {
  d3.select(".barChart > *").remove();
  var margin = { top: 40, right: 30, bottom: 40, left: 40 },
    width = widthProp - margin.left - margin.right,
    height = heightProp - margin.top - margin.bottom;
  var svg = d3
    .select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  console.log(groupBy);
  let species = new Set();
  //   Parse the Data
  var nested_data = d3
    .nest()
    .key(function (d) {
      if (groupBy === "months") {
        const date = new Date(
          0,
          d["Flight Date"].split("-").slice(1, 2).join("-"),
          1
        );
        // console.log(date);
        return date;
      } else if (groupBy === "years") {
        const date = new Date(
          d["Flight Date"].split("-").slice(0, 1).join("-"),
          d["Flight Date"].split("-").slice(1, 2).join("-"),
          1
        );
        // console.log(date);
        return date;
      }
    })
    .sortKeys(d3.ascending)
    .rollup(function (leaves) {
      return {
        sum: d3.sum(leaves, function (d) {
          return 1;
        }),
        // state: d3.group(leaves, (d) => {
        //   return d["Origin State"];
        // }),
        species: d3.group(leaves, (d) => {
          species.add(d["Wildlife Species"]);
          return d["Wildlife Species"];
        }),
      };
    })
    .entries(data);
  var bar_chart_data = [];
  nested_data.forEach(function (d) {
    Array.from(d.value.species, ([key, values]) => {
      bar_chart_data.push({
        date: d.key,
        key: key,
        sum: values.length,
        values: values,
      });
    });
  });
  console.log(bar_chart_data);

  //   X axis
  var x = d3
    .scaleTime()
    .domain([new Date(0, 0, 1), new Date(1, 0, 0)])
    .range([0, width]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(
      d3.axisBottom(x).tickFormat(function (date) {
        return d3.timeFormat("%b")(date);
      })
    );

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
  // console.log(d3.max(bar_chart_data.map((d) => d.sum)));
  var y = d3
    .scalePow()
    .exponent(0.1)
    .domain([
      d3.min(bar_chart_data.map((d) => d.sum)) - 0.2,
      d3.max(bar_chart_data.map((d) => d.sum)),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y)).attr("marker-end", "url(#arrow)");
  var clrRange = ["red", "blue", "green", "yellow"];
  var colScale = d3
    .scaleOrdinal()
    .domain(bar_chart_data.map((d) => d.key))
    .range(clrRange);
  // console.log(colScale);
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

  var mouseover = function (event, d) {
    tooltip
      .html("Strikes: " + d.sum + "<br>" + "Specie: " + d.key + "<br>")
      .style("opacity", 1);
    d3.selectAll("circle").each(function (dAll) {
      if (d.key === dAll.key) {
        d3.select(this).attr("r", 10);
      }
    });
  };
  const mousemove = function (event, d) {
    tooltip
      .style("transform", "translateY(-33%)")
      .style("left", event.x / 1.3 + "px")
      .style("top", event.y / 1.3 + "px");
  };
  const mouseleave = function (event, d) {
    // console.log(event, d, this);
    d3.selectAll("circle").each(function (dAll) {
      if (d.key === dAll.key) {
        d3.select(this).attr("r", 5);
        tooltip.style("opacity", 0);
      }
    });
  };
  // svg
  //   .selectAll("mybar")
  //   .data(bar_chart_data)
  //   .enter()
  //   .append("rect")
  //   .attr("fill", "#69b3a2")
  //   .attr("x", function (d) {
  //     return x(d.date);
  //   })
  //   .attr("width", x.bandwidth())
  //   // no bar at the beginning thus:
  //   .attr("height", function (d) {
  //     return height - y(0);
  //   }) // always equal to 0
  //   .attr("y", function (d) {
  //     return y(0);
  //   })
  //   .on("mouseover", mouseover)
  //   .on("mousemove", mousemove)
  //   .on("mouseleave", mouseleave);

  var g = svg.selectAll("mybar").data(bar_chart_data).enter().append("g");
  // .selectAll("circle");
  // .data((d) => {
  //   var keys = [...species.keys()];
  //   // let array = [{}];
  //   // d.forEach((s) => {
  //   //   const species = s.species;
  //   //   species.forEach((s) => {
  //   //     array.push(s);
  //   //   });
  //   // });
  //   var totals = d3
  //     .nest()
  //     .rollup((v) => {
  //       var array = [];
  //       // var result = {
  //       //   date: v.date,
  //       //   // sum: v.sum,
  //       // };
  //       // console.log(v);
  //       Array.from(v.species, ([key, values]) => {
  //         array.push({
  //           date: v.date,
  //           key: key,
  //           sum: values.length,
  //           values: values,
  //         });
  //       });
  //       // keys.forEach((key) => {
  //       // console.log(v.species.get(key));
  //       // result.arr.push();
  //       // });
  //       // console.log(array);
  //       return array;
  //     })
  //     .entries(d);
  //   // console.log(totals);
  //   return totals;
  // })
  // .enter();
  //   dots on chart
  g.append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function (d) {
      // console.log(d.date);
      return x(new Date(d.date)) - x(new Date(0, 1, 0));
    })
    .attr("cy", function (d) {
      return y(0);
    })
    .attr("r", 0.1)
    .attr("fill", (d) => colScale(d.key))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  svg
    .selectAll("circle")
    .transition()
    .duration(800)
    .attr("cy", function (d) {
      // console.log(d.species);
      return y(d.sum);
    })
    .attr("r", 5);
  // .delay(function (d, i) {
  //   return i * 10;
  // });

  // svg
  //   .selectAll("rect")
  //   .transition()
  //   .duration(800)
  //   .attr("y", function (d) {
  //     return y(d.sum);
  //   })
  //   .attr("height", function (d) {
  //     return height - y(d.sum);
  //   })
  //   .delay(function (d, i) {
  //     return i * 10;
  //   });
};
