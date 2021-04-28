// Set width and height
var svgWidth = 960;
var svgHeight = 500;

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
//Create makeResponsive function
function makeResponsive() {
    // Select div by id.
    var svgArea = d3.select("#scatter").select("svg");
    // Clear SVG data.
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    // Define margins.
    var margin = {
        top: 50,
        right: 50,
        bottom: 100,
        left: 80
    };
    // Chart the area minus margins.
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;
    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    // Append SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    d3.csv("assets/data/data.csv").then(function(demoData, err) {
        if (err) throw err;
        // Parse the data.
        demoData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.income = +data.income;
            data.obesity = data.obesity;
        });
        // Create x and y linear scales.
        var xLinearScale = xScale(demoData, xAxis, chartWidth);
        var yLinearScale = yScale(demoData, yAxis, chartHeight);
        // Create initial axis functions.
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        // Append the x axis.
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        // Append the y axis.
        var yAxis = chartGroup.append("g")
            .call(leftAxis);
        // Set data used for creating circles.
        var circleGroup = chartGroup.selectAll("circle")
            .data(demoData);
        // Bind data to circles.
        var circleEnter = circlesGroup.enter();
        // Create the circles.
        var circle = circleEnter.append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 15)
            .classed("stateCircle", true);
        // Create the text for the circles.
        var circleText = circleEnter.append("text")            
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .attr("dy", ".35em") 
            .text(d => d.abbr)
            .classed("stateText", true);
        // Update tool tip function above csv import.
        var circleGroup = updateToolTip(xAxis, yAxis, circle, circleText);
        // Add x label groups and labels.
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
        var povertyLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active", true)
            .text("In Poverty (%)");
        var ageLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age")
            .classed("inactive", true)
            .text("Age (Median)");
        var incomeLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .classed("inactive", true)
            .text("Household Income (Median)");

    });
};