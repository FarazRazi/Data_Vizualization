import { colorRanges } from "./constants.js";
import { highlight, noHighlight } from "./main.js";
import {
  bubblePlotLabels,
  camalize,
  getColorScale,
  getSizeScale,
} from "./utils.js";
export const barPlot = (data, _data, widthProp, heightProp, time) => {
  d3.select("#timeLine").selectAll("*").remove();
  var margin = { top: 20, right: 40, bottom: 40, left: 40 },
    width = widthProp - margin.left - margin.right,
    height = heightProp - margin.top - margin.bottom;
  var svg = d3
    .select("#timeLine")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  let startDate = new Date(data.startDate);
  let endDate = new Date(data.endDate);
  if (time === "months") {
    startDate.setMonth(startDate.getMonth() - 1);
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    startDate.setFullYear(startDate.getFullYear() - 2);
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  var x = d3
    .scaleTime()
    .domain([new Date(startDate), new Date(endDate)])
    .range([20, width]);
  const xAxis = svg
    .append("g")
    .attr("transform", "translate(40," + height + ")")
    .call(
      d3.axisBottom(x).tickFormat(function (date) {
        return d3.timeFormat("%b")(date);
      })
    );

  var y = d3
    .scaleLinear()
    .domain(time === "months" ? [0, 1500] : [0, 200])
    .range([height - 10, margin.top]);
  const yAxis = svg
    .append("g")
    .call(d3.axisLeft(y))
    .attr("transform", "translate(50, 0)")
    .attr("marker-end", "url(#arrow)");
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
  // Add Z axis for bubble size
  var z = getSizeScale([data.minCost, data.maxCost]);
  // Add color Scale
  var colScale = getColorScale([1, 2, 3, 3, 5, 6, 7, 8, 9, 10, 11, 12]);

  const nestedData = d3
    .nest()
    .key(function (d) {
      const [year, month, day] = d["Flight Date"].split("-").slice();
      if (time === "months") {
        const date = new Date(0, month, 0);
        // console.log(date);
        return date;
      } else if (time === "years") {
        const date = new Date(year, month, 0);
        // console.log(date);
        return date;
      }
    })
    .sortKeys(d3.ascending)
    .rollup(function (leaves) {
      return {
        sum: d3.sum(leaves, (d) => {
          return 1;
        }),
      };
    })
    .entries(_data);
  //   console.log(nestedData);
  // Add brushing
  var brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [width, height],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the scatter variable: where both the circles and the brush take place
  var scatter = svg.append("g").attr("clip-path", "url(#clip)");

  // Bars
  scatter
    .selectAll("mybar")
    .data(nestedData)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(new Date(d.key));
    })
    .attr("width", 5)
    .attr("p", 5)
    .attr("fill", (d) => {
      return colScale(new Date(d.key).getMonth());
    })
    // no bar at the beginning thus:
    .attr("height", function (d) {
      return height - y(0);
    }) // always equal to 0
    .attr("y", function (d) {
      return y(0);
    });
  scatter
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function (d) {
      return y(d.value.sum);
    })
    .attr("height", function (d) {
      return height - y(d.value.sum);
    })
    .delay(function (d, i) {
      //   console.log(i);
      return i * 10;
    });
  // Add the brushing
  scatter.append("g").attr("class", "brush").call(brush);

  // A function that set idleTimeOut to null
  var idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  // A function that update the chart for given boundaries
  function updateChart(e) {
    const extent = e.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
      x.domain([new Date(startDate), new Date(endDate)]);
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      scatter.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    }
    // Update axis and circle position
    xAxis.transition().duration(1000).call(d3.axisBottom(x));
    scatter
      .selectAll("rect")
      .transition()
      .duration(800)
      .attr("x", function (d) {
        return x(new Date(d.key));
      });
  }
};
