const margin = 60;
const marginSide = 60;
const marginTop = 30;
const width = 600 - 2 * marginSide;
const height = 400 - 2 * marginTop;

const svg = d3.select('svg')
    .attr("width", width + 2 * marginSide)
    .attr("height", height + 2 * marginTop)
    .attr("class", "bar-chart");

var formatPercentTwoCommas = d3.format(".2%");
var formatPercentOneComma = d3.format(".1%")

var toolTip = d3.select("body").append("div").attr("class", "toolTip");

d3.csv("https://raw.githubusercontent.com/idaflik/data/master/crossings.csv",function(data){

  data.forEach(function(d){
    d.arrivals = +d.arrivals;
    d.fatalities = +d.fatalities;
    d.ratio = +d.ratio;
    d.year = +d.year;})
    ;

  console.log(data);

  const xScale = d3.scaleBand()
      .range([0, width])
      .domain(data.map(function(d) { return d.year; }))
      .padding(0.2)
      ;

  const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, function(d) { return d.ratio; })])
      ;

  const chart = svg.append('g')
      .attr('transform', `translate(${marginSide}, ${marginTop})`)
      ;

  chart.append('g')
      .call(d3.axisLeft(yScale).tickFormat(formatPercentOneComma))
      .append("text")
      // .attr("transform", "rotate(-90)")
      // .attr("y", 6)
      // .attr("dy", 20)
      // .append("text")
      // .attr("text-anchor", "end")
      // .attr("stroke", "black")
      // .text("Annual average death rate")
      ;

  chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
       // .append("text")
       // .attr("y", height - 250)
       // .attr("x", width/2)
       // .attr("text-anchor", "end")
       // .attr("stroke", "black")
       // .text("Year")
       ;

  chart.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.year); })
         .attr("y", function(d) { return yScale(d.ratio); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d.ratio); })
         .on("mousemove", function(d){
            toolTip
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY + "px")
              .style("display", "inline-block")
              .html("Deaths: " + (d.fatalities) + "<br>" + "Arrivals: " + (d.arrivals) + "<br>" + "Ratio: " + (formatPercentTwoCommas(d.ratio)))
        })
    		.on("mouseout", function(d){ toolTip.style("display", "none");});
         ;

});
