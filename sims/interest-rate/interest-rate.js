// US Federal Funds Rate Time Series Chart (1995-2024)
// Canvas dimensions
let canvasWidth = 1000;
let drawHeight = 500;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 40;
let defaultTextSize = 16;
let sliderLeftMargin = 140;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Data variables
let rateData = [];
let currentHover = -1;
let startYearSlider;
let endYearSlider;
let startYearIndex = 0;
let endYearIndex = 29; // Default to show all years
let maxRate = 7.0;
let minRate = 0.0;
let barPadding = 2;

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
  
  // Initialize market data
  initializeData();
  
  // Create year range sliders
  startYearSlider = createSlider(0, rateData.length - 2, 0);
  endYearSlider = createSlider(1, rateData.length - 1, rateData.length - 1);
  sliderSetup();
  
  describe('A visualization of US Federal Funds Rate annual averages from 1995 to 2024 showing interest rate policy with hover details.', LABEL);
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
  text("US Federal Funds Rate Annual Averages (1995-2024)", canvasWidth/2, margin/3);
  
  // Draw chart and hover information
  drawLineChart();
  
  // Draw control labels
  drawControlLabels();
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  
  let startYear = rateData[startYearIndex].year;
  let endYear = rateData[endYearIndex].year;
  
  text(`Start Year: ${startYear}`, margin/4, drawHeight + 25);
  text(`End Year: ${endYear}`, containerWidth/2, drawHeight + 25);
}

function initializeData() {
  // Initialize federal funds rate data
  rateData = [
    { year: 1995, rate: 5.8, influence: "Fed under Greenspan made 'insurance' cuts to give the economy an extra boost" },
    { year: 1996, rate: 5.3, influence: "Period of steady economic growth with moderate interest rates" },
    { year: 1997, rate: 5.5, influence: "Asian financial crisis began but US economy remained strong" },
    { year: 1998, rate: 5.4, influence: "Russia's debt default and Long-Term Capital Management hedge fund collapse led to rate cuts" },
    { year: 1999, rate: 5.0, influence: "Rate increases to control inflation amid dot-com boom" },
    { year: 2000, rate: 6.2, influence: "Rates peaked as the Fed attempted to cool the economy" },
    { year: 2001, rate: 3.9, influence: "Rates cut sharply after dot-com bubble burst and 9/11 attacks" },
    { year: 2002, rate: 1.7, influence: "Continued low rates to stimulate economy during recession" },
    { year: 2003, rate: 1.1, influence: "Rates reached historically low levels to combat economic weakness" },
    { year: 2004, rate: 1.4, influence: "Fed began raising rates gradually as economy recovered" },
    { year: 2005, rate: 3.2, influence: "Continued rate increases during housing boom" },
    { year: 2006, rate: 5.0, influence: "Rates peaked before housing market began to show signs of weakness" },
    { year: 2007, rate: 5.0, influence: "Rates remained elevated until financial crisis emerged" },
    { year: 2008, rate: 1.9, influence: "Dramatic rate cuts in response to financial crisis" },
    { year: 2009, rate: 0.2, influence: "Rates near zero as part of unprecedented economic stimulus" },
    { year: 2010, rate: 0.2, influence: "Rates remained near zero with quantitative easing programs" },
    { year: 2011, rate: 0.1, influence: "Continued near-zero rates during slow economic recovery" },
    { year: 2012, rate: 0.1, influence: "Prolonged near-zero rate policy to support economic growth" },
    { year: 2013, rate: 0.1, influence: "Fed announced plans to taper quantitative easing" },
    { year: 2014, rate: 0.1, influence: "Final year of near-zero rates before first post-crisis increase" },
    { year: 2015, rate: 0.2, influence: "Fed began raising rates for first time since financial crisis" },
    { year: 2016, rate: 0.4, influence: "Gradual rate increases as economy strengthened" },
    { year: 2017, rate: 1.0, influence: "Continued gradual rate increases under new Fed leadership" },
    { year: 2018, rate: 1.8, influence: "Accelerated pace of rate increases as economy expanded" },
    { year: 2019, rate: 2.2, influence: "Rate cuts mid-year as global growth concerns emerged" },
    { year: 2020, rate: 0.4, influence: "Emergency rate cuts to near zero in response to COVID-19 pandemic" },
    { year: 2021, rate: 0.1, influence: "Rates remained near zero during economic recovery from pandemic" },
    { year: 2022, rate: 1.7, influence: "Fed began aggressive rate hikes to combat high inflation" },
    { year: 2023, rate: 5.1, influence: "Rates reached highest level since 2007 as inflation fight continued" },
    { year: 2024, rate: 5.0, influence: "Fed began cutting rates in second half of year as inflation moderated" }
  ];
}

function drawLineChart() {
  // Set up chart area
  let chartMargin = 50;
  let chartWidth = canvasWidth - 2 * chartMargin;
  let chartHeight = drawHeight - 2 * chartMargin - 30;
  
  // Draw reference lines with labels
  for (let i = 0; i <= maxRate; i += 1) {
    let y = chartMargin + chartHeight - (i * chartHeight / maxRate);
    stroke(220);
    strokeWeight(0.5);
    line(chartMargin, y, chartMargin + chartWidth, y);
    noStroke();
    fill(0);
    textAlign(RIGHT, CENTER);
    text(i + "%", chartMargin - 5, y);
  }
  
  // Calculate points for line and bars
  let yearCount = endYearIndex - startYearIndex + 1;
  let barWidth = chartWidth / yearCount - barPadding;
  let points = [];
  
  currentHover = -1;
  
  // Draw bars and collect points for line
  for (let i = startYearIndex; i <= endYearIndex; i++) {
    let data = rateData[i];
    let x = chartMargin + (i - startYearIndex) * (barWidth + barPadding) + barWidth/2;
    let y = chartMargin + chartHeight - (data.rate * chartHeight / maxRate);
    
    points.push({x, y});
    
    // Draw the bar with alpha transparency
    fill(0, 100, 255, 80);
    noStroke();
    rect(x - barWidth/2, y, barWidth, chartHeight - (y - chartMargin));
    
    // Check if mouse is over this bar
    if (mouseX >= x - barWidth/2 && mouseX <= x + barWidth/2 && 
        mouseY >= chartMargin && mouseY <= chartMargin + chartHeight) {
      // Highlight on hover
      fill(0, 100, 255, 200);
      rect(x - barWidth/2, y, barWidth, chartHeight - (y - chartMargin));
      currentHover = i;
    }
    
    // Draw year label
    push();
    fill(0);
    textSize(10);
    textAlign(CENTER, TOP);
    translate(x, chartMargin + chartHeight + 5);
    rotate(PI/8); // Rotate text to avoid overlap with close bars
    text(data.year, 0, 0);
    pop();
    
    // Draw rate percentage above bar
    fill(0);
    textSize(11);
    textAlign(CENTER, BOTTOM);
    let rateText = data.rate.toFixed(1) + "%";
    text(rateText, x, y - 5);
  }
  
  // Draw the line connecting points
  stroke(0, 100, 255);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let point of points) {
    vertex(point.x, point.y);
  }
  endShape();
  
  // Add points at each data point
  for (let point of points) {
    fill(255);
    stroke(0, 100, 255);
    strokeWeight(2);
    ellipse(point.x, point.y, 8, 8);
  }
  
  // Draw the Average Line with label
  let avgRate = rateData.reduce((sum, item) => sum + item.rate, 0) / rateData.length;
  let avgY = chartMargin + chartHeight - (avgRate * chartHeight / maxRate);
  
  stroke('red');
  strokeWeight(1);
  setLineDash([5, 3]); // Dashed line
  line(chartMargin, avgY, chartMargin + chartWidth, avgY);
  noStroke();
  fill('red');
  textSize(16);
  textAlign(RIGHT, CENTER);
  text("30-Year Average: " + avgRate.toFixed(1) + "%", chartWidth/2 + 220, avgY - 15);
  resetLineDash();
  
  // Display hover information
  if (currentHover >= 0) {
    let data = rateData[currentHover];
    let infoX = margin/4;
    let infoY = drawHeight - 60;
    let infoWidth = canvasWidth - margin/2;
    let infoHeight = 50;
    
    // Draw info box
    fill(255, 250, 240);
    stroke(100);
    strokeWeight(1);
    rect(infoX, infoY, infoWidth, infoHeight, 5);
    
    // Draw info text
    noStroke();
    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);
    text(`${data.year}: ${data.rate.toFixed(2)}%`, infoX + 10, infoY + 10);
    textSize(14);
    text(`${data.influence}`, infoX + 10, infoY + 30, infoWidth - 20, infoHeight - 30);
  }
}

// Helper function for dashed lines
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