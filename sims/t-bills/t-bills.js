// US Treasury Rates Historical Chart (1995-2025)
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
let yearsData = [];
let currentHover = -1;
let startYearSlider;
let endYearSlider;
let startYearIndex = 0;
let endYearIndex = 30; // Default to show all years
let maxRate = 7;
let minRate = 0;
let barPadding = 2;

// Treasury Rate Data
const years = [1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
const twoYearRates = [5.94,5.57,5.85,5.26,5.69,6.26,4.47,3.02,1.62,1.47,2.72,4.3,4.74,4.82,4.83,0.82,0.69,0.45,0.56,0.25,0.31,0.67,1.06,1.2,1.89,0.13,0.73,4.42,3.85,4.7,4.15];
const tenYearRates = [6.57,6.44,6.35,5.26,5.65,6.03,5.02,4.61,3.82,4.01,4.27,4.8,4.84,4.63,3.26,3.22,2.78,2.14,1.88,1.8,2.35,2.54,2.14,2.33,2.28,0.89,1.94,3.88,3.86,4.35,4.51];
const twoYearAvg = 2.98; // Average of 2-year rates
const tenYearAvg = 3.82; // Average of 10-year rates

// Historical events affecting rates
const historicalEvents = {
  1995: "Strong economic growth, Fed raises rates",
  1996: "Greenspan's 'irrational exuberance' speech",
  1997: "Asian financial crisis begins",
  1998: "Russian debt default and LTCM crisis",
  1999: "Tech bubble growing, Y2K concerns",
  2000: "Dot-com bubble peaks",
  2001: "9/11 attacks, recession begins",
  2002: "Fed cuts rates to combat recession",
  2003: "Iraq War begins, low rates to stimulate economy",
  2004: "Fed begins raising rates",
  2005: "Housing boom continues",
  2006: "Housing market begins to cool",
  2007: "Subprime mortgage crisis begins",
  2008: "Financial crisis, Lehman Brothers collapse",
  2009: "Great Recession, Fed cuts rates to near zero",
  2010: "European debt crisis, QE2 begins",
  2011: "S&P downgrades US credit rating",
  2012: "Fed announces QE3, Operation Twist",
  2013: "Taper tantrum as Fed signals QE reduction",
  2014: "End of QE3, oil price collapse",
  2015: "Fed raises rates for first time since 2006",
  2016: "Brexit referendum, Trump elected president",
  2017: "Fed continues gradual rate increases",
  2018: "Four rate hikes as economy strengthens",
  2019: "Fed cuts rates three times amid growth concerns",
  2020: "COVID-19 pandemic, rates cut to near zero",
  2021: "Inflation begins to rise, supply chain issues",
  2022: "Fed aggressively raises rates to combat inflation",
  2023: "Banking sector stress, continuing rate hikes",
  2024: "Fed begins cutting rates as inflation moderates",
  2025: "Rates stabilize in new normal environment"
};

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
  
  // Initialize data
  initializeData();
  
  // Create year range sliders
  startYearSlider = createSlider(0, years.length - 2, 0);
  endYearSlider = createSlider(1, years.length - 1, years.length - 1);
  sliderSetup();
  
  describe('A time-series visualization of 2-Year and 10-Year US Treasury Bill rates from 1995 to 2025 showing historical trends.', LABEL);
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
  text("US Treasury Rates Historical Chart (1995-2025)", canvasWidth/2, margin/3);
  
  // Draw chart and hover information
  drawBarChart();
  
  // Draw control labels
  drawControlLabels();
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  
  let startYear = years[startYearIndex];
  let endYear = years[endYearIndex];
  
  text(`Start Year: ${startYear}`, margin/4, drawHeight + 25);
  text(`End Year: ${endYear}`, containerWidth/2, drawHeight + 25);
}

function initializeData() {
  // Initialize data structure
  yearsData = years.map((year, index) => {
    return {
      year: year,
      twoYearRate: twoYearRates[index],
      tenYearRate: tenYearRates[index],
      event: historicalEvents[year] || "No major event"
    };
  });
  
  // Find max and min rates for scaling
  maxRate = Math.max(
    Math.max(...twoYearRates), 
    Math.max(...tenYearRates)
  );
  maxRate = Math.ceil(maxRate); // Round up to nearest whole number
  
  minRate = Math.min(
    Math.min(...twoYearRates), 
    Math.min(...tenYearRates)
  );
  minRate = Math.floor(minRate); // Round down to nearest whole number
}

function drawBarChart() {
  // Set up chart area
  let chartMargin = 50;
  let chartWidth = canvasWidth - 2 * chartMargin;
  let chartHeight = drawHeight - 2 * chartMargin - 30;
  
  // Draw reference lines with labels
  for (let i = 0; i <= maxRate; i++) {
    let y = map(i, minRate, maxRate, chartMargin + chartHeight, chartMargin);
    stroke(220);
    strokeWeight(0.5);
    line(chartMargin, y, chartMargin + chartWidth, y);
    noStroke();
    fill(0);
    textAlign(RIGHT, CENTER);
    textSize(12);
    text(i + "%", chartMargin - 5, y);
  }
  
  // Calculate bar widths based on visible range
  let yearCount = endYearIndex - startYearIndex + 1;
  let barWidth = chartWidth / yearCount - barPadding;
  let barGroupWidth = barWidth / 2; // Half for 2-year, half for 10-year
  
  currentHover = -1;
  
  // Draw bars for each year
  for (let i = startYearIndex; i <= endYearIndex; i++) {
    let data = yearsData[i];
    let x = chartMargin + (i - startYearIndex) * (barWidth + barPadding);
    
    // 2-Year Rate Bar
    let twoYearHeight = map(data.twoYearRate, minRate, maxRate, 0, chartHeight);
    let twoYearY = chartMargin + chartHeight - twoYearHeight;
    
    // 10-Year Rate Bar
    let tenYearHeight = map(data.tenYearRate, minRate, maxRate, 0, chartHeight);
    let tenYearY = chartMargin + chartHeight - tenYearHeight;
    
    // Check if mouse is over either bar
    if (mouseX >= x && mouseX <= x + barWidth && 
        mouseY >= min(twoYearY, tenYearY) && 
        mouseY <= chartMargin + chartHeight) {
      currentHover = i;
    }
    
    // Draw the bars
    // 2-Year Rate (blue)
    fill(0, 102, 204); // Blue
    if (currentHover === i) {
      fill(0, 140, 255); // Brighter blue when hovered
    }
    noStroke();
    rect(x, twoYearY, barGroupWidth, twoYearHeight);
    
    // 10-Year Rate (orange)
    fill(255, 153, 0); // Orange
    if (currentHover === i) {
      fill(255, 180, 0); // Brighter orange when hovered
    }
    noStroke();
    rect(x + barGroupWidth, tenYearY, barGroupWidth, tenYearHeight);
    
    // Draw year labels (rotated for better fit)
    if (yearCount <= 15 || i % Math.max(1, Math.floor(yearCount / 15)) === 0) {
      push();
      fill(0);
      textSize(10);
      textAlign(CENTER, TOP);
      translate(x + barWidth/2, chartMargin + chartHeight + 5);
      rotate(PI/4); // Rotate text to avoid overlap
      text(data.year, 0, 0);
      pop();
    }
  }
  
  // Draw the Average Lines with labels
  // 2-Year Average Line
  stroke(0, 102, 204); // Blue
  strokeWeight(2);
  let twoYearAvgY = map(twoYearAvg, minRate, maxRate, chartMargin + chartHeight, chartMargin);
  line(chartMargin, twoYearAvgY, chartMargin + chartWidth, twoYearAvgY);
  
  // 10-Year Average Line
  stroke(255, 153, 0); // Orange
  strokeWeight(2);
  let tenYearAvgY = map(tenYearAvg, minRate, maxRate, chartMargin + chartHeight, chartMargin);
  line(chartMargin, tenYearAvgY, chartMargin + chartWidth, tenYearAvgY);
  
  // Add legend
  push()
  translate(200,-10);
  noStroke();
  fill(0);
  textSize(14);
  textAlign(LEFT, CENTER);
  
  // Draw legend container
  fill(255, 255, 255, 200);
  stroke(200);
  strokeWeight(1);
  rect(chartMargin, chartMargin, 220, 90);
  
  // 2-Year Rate
  noStroke();
  fill(0, 102, 204);
  rect(chartMargin + 15, chartMargin + 10, 15, 15);
  fill(0);
  textAlign(LEFT, CENTER);
  text("2-Year Treasury Rate", chartMargin + 40, chartMargin + 17);
  
  // 10-Year Rate
  fill(255, 153, 0);
  rect(chartMargin + 15, chartMargin + 30, 15, 15);
  fill(0);
  text("10-Year Treasury Rate", chartMargin + 40, chartMargin + 37);
  
  // Add 2-year average indicators to legend
  stroke(0, 102, 204);
  strokeWeight(2);
  line(chartMargin + 15, chartMargin + 55, chartMargin + 30, chartMargin + 55);
  fill(0);
  noStroke();
  text(`2-Year Avg: ${twoYearAvg.toFixed(2)}%`, chartMargin + 40, chartMargin + 55);
  
  // Add 10 year average indicators to legend
  stroke(255, 153, 0);
  strokeWeight(2);
  line(chartMargin + 15, chartMargin + 75, chartMargin + 30, chartMargin + 75);
  fill(0);
  noStroke();
  text(`10-Year Avg: ${tenYearAvg.toFixed(2)}%`, chartMargin + 40, chartMargin + 75);
  
  // done with legend
  pop();
  
  // Display hover information
  if (currentHover >= 0) {
    let data = yearsData[currentHover];
    let infoX = chartMargin;
    let infoY = drawHeight - 60;
    let infoWidth = canvasWidth - (chartMargin * 2);
    let infoHeight = 60;
    
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
    text(`${data.year}: 2-Year Rate: ${data.twoYearRate.toFixed(2)}%, 10-Year Rate: ${data.tenYearRate.toFixed(2)}%`, infoX + 10, infoY + 10);
    
    textSize(14);
    text(`${data.event}`, infoX + 10, infoY + 35, infoWidth - 20, infoHeight - 40);
  }
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