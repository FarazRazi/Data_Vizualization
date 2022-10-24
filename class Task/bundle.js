// y scale
// y axis

var i = 0;
function func(x, y) {
  // Selecting all p and
  //   changing message
  //   console.log("button Clicked");
  var rect = document.querySelector("rect");

  d3.select("rect")
    .attr("x", rect.x + x)
    .attr("y", rect.y + y);
}
let up = document.getElementById("up");
let down = document.getElementById("down");
let left = document.getElementById("left");
let right = document.getElementById("right");

up.addEventListener("click", func(0, 1));
down.addEventListener("click", func(0, -1));
left.addEventListener("click", func(-1, 0));
right.addEventListener("click", func(1, 0));
