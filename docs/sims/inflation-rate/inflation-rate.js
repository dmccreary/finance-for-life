// US Inflation Rate Chart (1995-2025)

// Canvas dimensions
let canvasWidth = 1000;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 40;
let defaultTextSize = 16;
let sliderLeftMargin = 140;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Data variables
let inflationData = [];
let currentHover = -1;
let startYearSlider;
let endYearSlider;
let startYearIndex = 0;
let endYearIndex = 29; // Default to show all years
let maxInflation = 7.9;
let minInflation = -1;
let barPadding = 2;

// Legend variables
let legendX;
let legendY;
let legendWidth = 390;
let legendHeight = 80;
let legendPadding = 10;
let legendItemHeight = 20;

// call this in setup and after a resize
function sliderSetup() {
    startYearSlider.position(sliderLeftMargin, drawHeight + 15);
    startYearSlider.size(containerWidth/2 - margin - 120);
    endYearSlider.position(containerWidth/2 + sliderLeftMargin-20, drawHeight + 15);
    endYearSlider.size(containerWidth/2 - margin - 130);
}

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  
  // Initialize inflation data
  initializeData();
  
  // Create year range sliders
  startYearSlider = createSlider(0, inflationData.length - 2, 0);
  endYearSlider = createSlider(1, inflationData.length - 1, inflationData.length - 1);
  sliderSetup();
  
  // Set legend position
  legendX = margin * 1.5;
  legendY = margin;
  
  describe('A visualization of U.S. inflation rates from 1995 to 2025 showing annual percentage changes in the Consumer Price Index with a color-coded legend.', LABEL);
}

function draw() {
  // Draw area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  
  // Controls area
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  
  // Update range from sliders
  startYearIndex = startYearSlider.value();
  endYearIndex = endYearSlider.value();
  
  // Ensure start doesn't exceed end
  if (startYearIndex >= endYearIndex) {
    endYearIndex = startYearIndex + 1;
    endYearSlider.value(endYearIndex);
  }
  
  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("U.S. Annual Inflation Rates (1995-2025)", canvasWidth*.4, margin/4);
  
  // Draw chart and hover information
  drawBarChart();
  
  // Draw legend
  drawLegend();
  
  // Draw control labels
  drawControlLabels();
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  
  let startYear = inflationData[startYearIndex].year;
  let endYear = inflationData[endYearIndex].year;
  
  text(`Start Year: ${startYear}`, margin/4, drawHeight + 25);
  text(`End Year: ${endYear}`, containerWidth/2, drawHeight + 25);
}

function initializeData() {
  // Initialize inflation data from oldest to newest (1995-2025)
  // Data compiled from Bureau of Labor Statistics
  inflationData = [
    { year: 1995, rate: 2.8, influence: "Moderate inflation as the economy continued recovering from the early 1990s recession." },
    { year: 1996, rate: 3.0, influence: "Steady inflation alongside strong economic growth and low unemployment." },
    { year: 1997, rate: 2.3, influence: "Inflation declined despite the Asian financial crisis and robust domestic growth." },
    { year: 1998, rate: 1.6, influence: "Lower inflation due to falling energy prices and the effects of the Asian financial crisis." },
    { year: 1999, rate: 2.2, influence: "Inflation remained moderate despite strong economic growth and tech boom." },
    { year: 2000, rate: 3.4, influence: "Inflation accelerated slightly as the dot-com bubble reached its peak." },
    { year: 2001, rate: 2.8, influence: "Inflation moderated following dot-com crash and the 9/11 attacks." },
    { year: 2002, rate: 1.6, influence: "Lower inflation amid economic uncertainty and recovery efforts." },
    { year: 2003, rate: 2.3, influence: "Moderate inflation as the economy began recovering with fiscal stimulus." },
    { year: 2004, rate: 2.7, influence: "Rising energy prices contributed to slightly higher inflation." },
    { year: 2005, rate: 3.4, influence: "Increasing energy prices and housing market growth pushed inflation higher." },
    { year: 2006, rate: 3.2, influence: "Inflation remained elevated as the housing boom peaked." },
    { year: 2007, rate: 2.8, influence: "Moderate inflation despite early signs of housing market trouble." },
    { year: 2008, rate: 3.8, influence: "High oil prices early in the year, followed by financial crisis and recession." },
    { year: 2009, rate: -0.4, influence: "Rare deflation occurred during the depths of the Great Recession." },
    { year: 2010, rate: 1.6, influence: "Inflation remained low during early economic recovery and quantitative easing." },
    { year: 2011, rate: 3.2, influence: "Higher inflation due to rising commodity prices and recovery efforts." },
    { year: 2012, rate: 2.1, influence: "Moderation in inflation as commodity price increases slowed." },
    { year: 2013, rate: 1.5, influence: "Low inflation despite continued monetary stimulus from the Federal Reserve." },
    { year: 2014, rate: 1.6, influence: "Inflation remained low despite economic expansion and falling unemployment." },
    { year: 2015, rate: 0.1, influence: "Near-zero inflation due to oil price collapse and strong dollar." },
    { year: 2016, rate: 1.3, influence: "Inflation began rising gradually as energy prices stabilized." },
    { year: 2017, rate: 2.1, influence: "Moderate inflation as the economy continued steady growth." },
    { year: 2018, rate: 2.4, influence: "Inflation approached Fed target with tax cuts and full employment." },
    { year: 2019, rate: 1.8, influence: "Inflation moderated despite trade tensions and continued growth." },
    { year: 2020, rate: 1.2, influence: "COVID-19 pandemic initially depressed prices despite massive stimulus." },
    { year: 2021, rate: 7.0, influence: "Sharply higher inflation due to supply chain disruptions, stimulus, and reopening demand." },
    { year: 2022, rate: 6.5, influence: "Continued high inflation from supply chain issues, Ukraine war, and tight labor markets." },
    { year: 2023, rate: 3.4, influence: "Inflation began moderating as Fed tightening and supply chain improvements took effect." },
    { year: 2024, rate: 2.9, influence: "Inflation continued trending toward Fed's 2% target as rate hikes impacted economy." },
    { year: 2025, rate: 2.4, influence: "Current inflation rate (as of March 2025) reflecting more normalized price growth." }
  ];
}

function drawLegend() {
  push();
  // Draw legend background
  fill(255, 255, 255, 220);
  stroke(100);
  strokeWeight(1);
  rect(legendX, legendY, legendWidth, legendHeight, 5);
  
  // Setup for legend items
  textAlign(LEFT, CENTER);
  textSize(12);
  let itemY = legendY + legendPadding;
  let itemBoxSize = 15;
  
  // Deflation - purple
  fill(220, 70, 220);
  rect(legendX + legendPadding, itemY, itemBoxSize, itemBoxSize);
  fill(0);
  text("Deflation (< 0%)", legendX + legendPadding + itemBoxSize + 5, itemY + itemBoxSize/2);
  itemY += legendItemHeight + 5;
  
  // Below target - blue
  fill(50, 100, 220);
  rect(legendX + legendPadding, itemY, itemBoxSize, itemBoxSize);
  fill(0);
  text("Below Target (0% - 1.5%)", legendX + legendPadding + itemBoxSize + 5, itemY + itemBoxSize/2);
  itemY += legendItemHeight + 5;
  
  // Near target - green
  fill(50, 180, 50);
  rect(legendX + legendPadding, itemY, itemBoxSize, itemBoxSize);
  fill(0);
  text("Target Range (1.5% - 2.5%)", legendX + legendPadding + itemBoxSize + 5, itemY + itemBoxSize/2);
  
  // reset for the second column
  itemY = legendY + legendPadding;
  
  // Moderate high - yellow
  fill(220, 180, 50);
  rect(legendX + legendPadding + 200, itemY, itemBoxSize, itemBoxSize);
  fill(0);
  text("Moderate High (2.5% - 4%)", legendX + legendPadding + itemBoxSize + 5 + 200, itemY + itemBoxSize/2);
  itemY += legendItemHeight + 5;
  
  // High inflation - red
  fill(220, 50, 50);
  rect(legendX + legendPadding + 200, itemY, itemBoxSize, itemBoxSize);
  fill(0);
  text("High Inflation (> 4%)", legendX + legendPadding + itemBoxSize + 5 + 200, itemY + itemBoxSize/2);
  pop()
}

function drawBarChart() {
  // Set up chart area
  let chartMargin = 50;
  let chartWidth = canvasWidth - chartMargin*1.4;
  let chartHeight = drawHeight - chartMargin - 30;
  let zeroLine = chartMargin + chartHeight;
  
  // use to position chart
  push();
  translate(0,-80);
  
  // Draw the zero line with label
  stroke(100);
  strokeWeight(1);
  line(chartMargin, zeroLine, chartMargin + chartWidth, zeroLine);

  
  // Draw vertical axis labels
  for (let i = -1; i <= maxInflation; i += 1) {
    let y = zeroLine - (i * chartHeight / (maxInflation - minInflation));
    stroke(220);
    strokeWeight(0.5);
    line(chartMargin, y, chartMargin + chartWidth, y);
    noStroke();
    fill(0);
    textSize(16);
    textAlign(RIGHT, CENTER);
    text(i + "%", chartMargin - 9, y);
  }
  
  // Calculate bar width based on the number of displayed years
  let yearCount = endYearIndex - startYearIndex + 1;
  let barWidth = chartWidth / yearCount - barPadding;
  
  currentHover = -1;
  
  // Draw target line at 2% (Fed's target inflation rate)
  let targetY = zeroLine - (2 * chartHeight / (maxInflation - minInflation));
  stroke(0, 128, 255, 150);
  strokeWeight(2);
  setLineDash([5, 5]); // Dashed line
  line(chartMargin, targetY, chartMargin + chartWidth, targetY);
  resetLineDash();
  noStroke();
  fill(0, 128, 255);
  textSize(12);
  textAlign(RIGHT, CENTER);
  text("Target 2%", chartWidth*.78, targetY-10);
  
  // Draw average line and label
  let sum = 0;
  for (let i = startYearIndex; i <= endYearIndex; i++) {
    sum += inflationData[i].rate;
  }
  let average = sum / yearCount;
  let averageY = zeroLine - (average * chartHeight / (maxInflation - minInflation));
  stroke(255, 128, 0, 150);
  strokeWeight(2);
  line(chartMargin, averageY, chartMargin + chartWidth, averageY);
  noStroke();
  fill(255, 128, 0);
  textSize(12);
  textAlign(RIGHT, CENTER);
  text(`Average ${average.toFixed(1)}%`, chartWidth*.78, averageY-10);
  
  
  // First pass: Check for hover (do this before drawing bars)
  // This ensures we detect hover over the entire column, not just the bar
  for (let i = startYearIndex; i <= endYearIndex; i++) {
    let data = inflationData[i];
    let x = chartMargin + (i - startYearIndex) * (barWidth + barPadding);
    
    // Check if mouse is over this column (full height)
    // We check the entire column from top of chart to zero line
    if (mouseX > x && mouseX <= x + barWidth && 
        mouseY >= chartMargin-60 && mouseY <= zeroLine-60) {
      currentHover = i;
      break; // Exit the loop once we find a match
    }
  }
  
  // Second pass: Draw the bars
  for (let i = startYearIndex; i <= endYearIndex; i++) {
    let data = inflationData[i];
    let x = chartMargin + (i - startYearIndex) * (barWidth + barPadding);
    
    // Bar height proportional to inflation rate value
    let barHeight = data.rate * chartHeight / (maxInflation - minInflation);
    let y = zeroLine - barHeight;
    
    // Choose color based on relation to target
    let barColor;
    if (data.rate < 0) {
      // Deflation - purple
      barColor = color(220, 70, 220);
    } else if (data.rate <= 1.5) {
      // Below target - blue
      barColor = color(50, 100, 220);
    } else if (data.rate <= 2.5) {
      // Near target (1.5-2.5%) - green
      barColor = color(50, 180, 50);
    } else if (data.rate <= 4) {
      // Moderate high (2.5-4%) - yellow
      barColor = color(220, 180, 50);
    } else {
      // High inflation (>4%) - red
      barColor = color(220, 50, 50);
    }

    
    // Highlight on hover
    if (i === currentHover) {
      barColor = lerpColor(barColor, color(255), 0.3);
    }
    
    // Draw the vertical bar
    fill(barColor);
    noStroke();
    if (barHeight>0)
      rect(x, y, barWidth, barHeight);
    else
      // console.log(barHeight);
      rect(x, y-15, barWidth, barHeight-5);
    
    // Draw year label
    push();
    fill(0);
    textSize(10);
    textAlign(CENTER, TOP);
    translate(x + barWidth/2, zeroLine + 7);
    rotate(PI/4); // Rotate text to avoid overlap with close bars
    text(data.year, 0, 0);
    pop();
    
    // Draw rate percentage above bar
    fill(0);
    textSize(11);
    textAlign(CENTER, BOTTOM);
    let rateText = data.rate.toFixed(1) + "%";
    if (barHeight>0)
       text(rateText, x + barWidth/2, y - 2);
    else
      // console.log(barHeight)
      text(rateText, x + barWidth/2, y + 20);
  }
  
  // Display hover text information below chart
  if (currentHover >= 0) {
    let data = inflationData[currentHover];
    let infoX = margin/4;
    let infoY = drawHeight + 20;
    let infoWidth = canvasWidth - margin/2;
    let infoHeight = 55;
    
    // Draw info box
    fill(255, 250, 240);
    stroke(100);
    strokeWeight(1);
    rect(infoX, infoY, infoWidth, infoHeight, 5);
    
    // Draw info text below bar chart
    noStroke();
    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);
    text(`${data.year}: ${data.rate.toFixed(1)}%`, infoX + 10, infoY + 10);
    
    textSize(14);
    text(`${data.influence}`, infoX + 10, infoY + 30, infoWidth - 20, infoHeight - 40);
  }
  pop();
}

// Utility function for dashed lines
function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function resetLineDash() {
  drawingContext.setLineDash([]);
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  
  redraw();
  
  // Resize the sliders to match the new canvasWidth
  sliderSetup();
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main');
  if (container) {
    const rect = container.getBoundingClientRect();
    containerWidth = Math.floor(rect.width);  // Avoid fractional pixels
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = containerWidth;
}