//Set width and height
var svgHeight = 500;
var svgWidth = 960;

// Set default x and y axis variables.
var mainXAxis = "poverty";
var mainYAxis = "healthcare";

// Use function to update variable on x-axis label.
function xScale(data, mainXAxis, chartWidth) {
    // Create scales.
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[mainXAxis]) * 0.8,
            d3.max(data, d => d[mainXAxis]) * 1.1])
        .range([0, chartWidth]);
    return xLinearScale;
}

// Use function for updating the x-axis variable label.
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// Use function to update variable on y-axis label.
function yScale(data, mainYAxis, chartHeight) {
    // Create scales.
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[mainYAxis]) * 0.8,
            d3.max(data, d => d[mainYAxis]) * 1.2])
        .range([chartHeight, 0]);
    return yLinearScale;
}

// Use function for updating the y-axis variable label.
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// Use function for updating circle groups.
function renderCircles(circlesGroup, newXScale, newYScale, mainXAxis, mainYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[mainXAxis]))
        .attr("cy", d => newYScale(d[mainYAxis]));
    return circlesGroup;
}

// Use function for updating text in circle groups.
function renderText(circletextGroup, newXScale, newYScale, mainXAxis, mainYAxis) {
    circletextGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[mainXAxis]))
        .attr("y", d => newYScale(d[mainYAxis]));
    return circletextGroup;
}

// Use function for updating circle groups with tooltip.
function updateToolTip(mainXAxis, mainYAxis, circlesGroup, textGroup) {

    if (mainXAxis === "poverty") {
        var xlabel = "Poverty: ";
    } 
      else if (mainXAxis === "income") {
        var xlabel = "Median Income: "
    } 
      else {
        var xlabel = "Age: "
    }

    if (mainYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare: ";
    } 
      else if (mainYAxis === "smokes") {
        var ylabel = "Smokers: "
    } 
      else {
        var ylabel = "Obesity: "
    }

    // Create tooltip.
    var toolTip = d3.tip()
        .offset([120, -60])
        .attr("class", "d3-tip")
        .html(function(d) {
            if (mainXAxis === "age") {
                // Display Age without format for x-axis.
                return (`${d.state}<hr>${xlabel} ${d[mainXAxis]}<br>${ylabel}${d[mainYAxis]}%`);
                } 
                  else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
                // Display Income in dollars for x-axis.
                return (`${d.state}<hr>${xlabel}$${d[mainXAxis]}<br>${ylabel}${d[mainYAxis]}%`);
                } 
                  else {
                // Display Poverty as percentage for x-axis.
                return (`${d.state}<hr>${xlabel}${d[mainXAxis]}%<br>${ylabel}${d[mainYAxis]}%`);
                }      
        });
    circlesGroup.call(toolTip);
    // Create mouseover event listener.
    circlesGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    textGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    return circlesGroup;
}
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
    // Chart area minus margins.
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;
    // Create SVG wrapper.
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
        // Parse data with function.
        demoData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.income = +data.income;
            data.obesity = +data.obesity;
        });
        // Create x-axis and y-axis linear scales.
        var xLinearScale = xScale(demoData, mainXAxis, chartWidth);
        var yLinearScale = yScale(demoData, mainYAxis, chartHeight);
        // Create initial axis function.
        var bottomAxis =d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        // Append x-axis.
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        // Append y-axis.
        var yAxis = chartGroup.append("g")
            .call(leftAxis);
        // Set data used for creating circles.
        var circlesGroup = chartGroup.selectAll("circle")
            .data(demoData);
        // Bind circle data.
        var elementEnter = circlesGroup.enter();
        // Create circles with data.
        var circle = elementEnter.append("circle")
            .attr("cx", d => xLinearScale(d[mainXAxis]))
            .attr("cy", d => yLinearScale(d[mainYAxis]))
            .attr("r", 15)
            .classed("stateCircle", true);
        // Create circle text with data.
        var circleText = elementEnter.append("text")            
            .attr("x", d => xLinearScale(d[mainXAxis]))
            .attr("y", d => yLinearScale(d[mainYAxis]))
            .attr("dy", ".35em") 
            .text(d => d.abbr)
            .classed("stateText", true);
        // Update tool tip function.
        var circlesGroup = updateToolTip(mainXAxis, mainYAxis, circle, circleText);
        // Add xlabel groups.
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
        // Add ylabel groups.
        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)");
        var healthcareLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 40 - margin.left)
            .attr("dy", "1em")
            .attr("value", "healthcare")
            .classed("active", true)
            .text("Lacks Healthcare (%)");
        var smokesLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 20 - margin.left)
            .attr("dy", "1em")
            .attr("value", "smokes")
            .classed("inactive", true)
            .text("Smokes (%)");
        var obeseLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .attr("value", "obesity")
            .classed("inactive", true)
            .text("Obese (%)");
        // Create the xlabel event listener.
        xLabelsGroup.selectAll("text")
            .on("click", function() {
                // Grab selected xlabel.
                mainXAxis = d3.select(this).attr("value");
                // Update xLinearScale for event listener.
                xLinearScale = xScale(demoData, mainXAxis, chartWidth);
                // Render xAxis for event listener.
                xAxis = renderXAxes(xLinearScale, xAxis);
                // Switch active and inactive labels as needed.
                if (mainXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } 
                  else if (mainXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } 
                  else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                // Update circles with newly created x values.
                circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, mainXAxis, mainYAxis);
                // Update tool tips with new info.
                circlesGroup = updateToolTip(mainXAxis, mainYAxis, circle, circleText);
                // Update circles text with new values.
                circleText = renderText(circleText, xLinearScale, yLinearScale, mainXAxis, mainYAxis);
            });
        // Create ylabel event listener.
        yLabelsGroup.selectAll("text")
            .on("click", function() {
                // Grab selected ylabel.
                mainYAxis = d3.select(this).attr("value");
                // Update yLinearScale for event listener.
                yLinearScale = yScale(demoData, mainYAxis, chartHeight);
                // Update y-axis for event listener.
                yAxis = renderYAxes(yLinearScale, yAxis);
                // Changes classes to bold text.
                if (mainYAxis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } 
                  else if (mainYAxis === "smokes"){
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } 
                  else {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                // Update circle with new y values.
                circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, mainXAxis, mainYAxis);
                // Update circle text with new values.
                circleText = renderText(circleText, xLinearScale, yLinearScale, mainXAxis, mainYAxis);
                // Update tool tips with new info.
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);
            });
    }).catch(function(err) {
        console.log(err);
    });
}
makeResponsive();
// Event listener for window resize.
d3.select(window).on("resize", makeResponsive);