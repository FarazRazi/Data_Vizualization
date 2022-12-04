// import _data from "./birdstrikes.json" assert { type: "json" };
import { scatterPlot } from "./scatterPlot.js";
d3.csv("./birdstrikes.csv").then((_data) => {
  let groupBy = "Time of day";
  // scatterPlot(_data, 680, 360, groupBy, "months");

  let options = document.querySelectorAll(".setGroupBtn");
  let i;
  function unselectAll() {
    for (i = 0; i < options.length; i++) {
      options[i].style.boxShadow =
        " transparent 0 0 0 3px, rgba(18, 18, 18, 0.1) 0 6px 20px";
    }
  }

  options.forEach((option) => {
    option.addEventListener("click", setGroupBy);
  });
  function setGroupBy(e) {
    unselectAll();
    this.style.boxShadow = "tomato 0 0 0 3px";
    groupBy = e.srcElement.id;
    scatterPlot(_data, 560, 360, groupBy, "months");
  }
});
