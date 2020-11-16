/* 
1 - fetch data
2 - drawChart func.
3 - define w,h,padding, barWidth
4 - x,y scale
5 - svg
6 - tooltip
7 - css part
*/

//1 fetch data
fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((res) => res.json())
  .then((res) => {
    const { data } = res;

    drawChart(data.map((d) => [d[0], d[1], d[0].split("-")[0]]));
  });

//2,3 drwaChart func and w,h,p defining
function drawChart(data) {
  const w = 800;
  const h = 400;
  const padding = 40;
  // const barWidth = 5
  const barWidth = w / data.length;

  //4 x,y scale
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d, i) => d[1])])
    .range([h - padding, padding]);

  const xScale = d3
    .scaleTime()
    // .domain([d3.min(data, (d) => d[2]), d3.max(data, (d) => d[2])])
    .domain([
      d3.min(data, (d) => new Date(d[0])),
      d3.max(data, (d) => new Date(d[2]))
    ])
    .range([padding, w - padding]);

  //5 svg

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  const tooltip = document.getElementById("tooltip");
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    // .attr("x", (d, i) => i * barWidth + padding)
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d, i) => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", (d, i) => h - yScale(d[1]) - padding)
    .attr("fill", "#6c5ce7")
    // .append("title")
    // .attr("id", "tooltip")
    // .text((d) => d[0] + " " + d[1]);

    //6 tooltip
    .on("mouseover", (d, i) => {
      tooltip.style.display = "flex";
      tooltip.style.border = "1px solid black";
      tooltip.style.left = i * barWidth + padding * 2 + "px";
      tooltip.style.top = h - padding * 4 + "px";
      tooltip.innerHTML = `year : ${d[0]} : gdp : ${d[1]}`;
      tooltip.setAttribute("data-date", d[0]);
    })
    .on("mouseout", () => {
      tooltip.style.display = "none";
    });

  //create axises
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis);
}