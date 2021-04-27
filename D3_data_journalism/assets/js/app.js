// Set default x and y axis variables.
var xAxis = "poverty";
var yAxis = "healthcare";
// Use function to update variable on x-axis label.
function xScale(data, xAxis, chartWidth) {
    // Create x linear scales.
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[xAxis]) * .8,
            d3.max(data, d => d[yAxis]) * 1.1])
        .range([0, chartWidth]);
    return xLinearScale;
}
// Use function to update variable on x-axis label.
function yScale(data, chosenYAxis, chartHeight) {
    // Create y linear scales.
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[yAxis]) * .8,
            d3.max(data, d => d[yAxis]) * 1.2])
        .range([chartHeight, 0]);
    return yLinearScale;
}
