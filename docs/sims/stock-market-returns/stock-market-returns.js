// S&P 500 Annual Returns MicroSim
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
let endYearIndex = 29; // Default to show all years
let maxReturn = 35;
let minReturn = -40;
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
  startYearSlider = createSlider(0, yearsData.length - 2, 0);
  endYearSlider = createSlider(1, yearsData.length - 1, yearsData.length - 1);
  sliderSetup();
  
  describe('A visualization of S&P 500 annual returns from 1995 to 2024 showing market performance with hover details.', LABEL);
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
  text("S&P 500's Annual Returns from 1995 to 2024", canvasWidth/2, margin/3);
  
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
  
  let startYear = yearsData[startYearIndex].year;
  let endYear = yearsData[endYearIndex].year;
  
  text(`Start Year: ${startYear}`, margin/4, drawHeight + 25);
  text(`End Year: ${endYear}`, containerWidth/2, drawHeight + 25);
}

function initializeData() {
  // Initialize data from newest to oldest (as in the table)
  yearsData = [
    { year: 2024, return: 23.3, influence: "Continued growth in technology and AI sectors, along with strong corporate earnings, propelled the market upward." },
    { year: 2023, return: 24.2, influence: "Recovery from the previous year's downturn, driven by easing inflation and robust consumer spending." },
    { year: 2022, return: -19.4, influence: "Market decline due to rising inflation, interest rate hikes by the Federal Reserve, and geopolitical tensions." },
    { year: 2021, return: 26.9, influence: "Strong rebound from the pandemic-induced recession, fueled by vaccine rollouts and economic reopening." },
    { year: 2020, return: 16.3, influence: "Despite the COVID-19 pandemic causing a sharp downturn early in the year, unprecedented fiscal stimulus and monetary easing led to a strong recovery." },
    { year: 2019, return: 28.9, influence: "Market surged due to easing trade tensions and accommodative monetary policy." },
    { year: 2018, return: -6.2, influence: "Decline attributed to trade disputes and concerns over global economic slowdown." },
    { year: 2017, return: 19.4, influence: "Steady economic growth and corporate earnings bolstered market performance." },
    { year: 2016, return: 9.5, influence: "Market gains driven by energy sector recovery and post-election optimism." },
    { year: 2015, return: -0.7, influence: "Flat performance amid global economic concerns and declining oil prices." },
    { year: 2014, return: 11.4, influence: "Moderate gains supported by improving labor market and corporate profits." },
    { year: 2013, return: 29.6, influence: "Significant rally due to quantitative easing and investor confidence." },
    { year: 2012, return: 13.4, influence: "Positive returns amid central bank interventions and economic stabilization." },
    { year: 2011, return: 0.00, influence: "Market volatility due to European debt crisis and U.S. credit rating downgrade." },
    { year: 2010, return: 12.8, influence: "Recovery from financial crisis continued, aided by stimulus measures." },
    { year: 2009, return: 23.5, influence: "Rebound from the Great Recession lows, driven by policy interventions." },
    { year: 2008, return: -38.5, influence: "Severe decline during the global financial crisis." },
    { year: 2007, return: 3.53, influence: "Modest gains before the onset of the financial crisis." },
    { year: 2006, return: 13.6, influence: "Steady growth amid housing market concerns." },
    { year: 2005, return: 3.0, influence: "Low returns due to rising interest rates and energy prices." },
    { year: 2004, return: 8.99, influence: "Gains supported by economic expansion and corporate earnings." },
    { year: 2003, return: 26.4, influence: "Strong recovery following the dot-com bust and 2001 recession." },
    { year: 2002, return: -23.4, influence: "Continued decline from the dot-com bubble burst and corporate scandals." },
    { year: 2001, return: -13.0, influence: "Market downturn due to dot-com bubble burst and 9/11 attacks." },
    { year: 2000, return: -10.1, influence: "Decline as the dot-com bubble began to burst." },
    { year: 1999, return: 19.5, influence: "Gains driven by technology sector exuberance during the dot-com boom." },
    { year: 1998, return: 26.7, influence: "Strong performance despite global financial crises, including the Russian default." },
    { year: 1997, return: 31.0, influence: "Robust gains amid Asian financial crisis." },
    { year: 1996, return: 20.3, influence: "Continued bull market driven by technology and internet growth." },
    { year: 1995, return: 34.1, influence: "Significant gains as the economy recovered from early 1990s recession." }
  ];
  
  // Reverse the array to show oldest to newest (left to right)
  yearsData.reverse();
}

function drawBarChart() {
  // Set up chart area
  let chartMargin = 50;
  let chartWidth = canvasWidth - 2 * chartMargin;
  let chartHeight = drawHeight - 2 * chartMargin - 30;
  let zeroLine = chartMargin + chartHeight / 2;
  
  // Draw the zero line with label
  stroke(100);
  strokeWeight(1);
  line(chartMargin, zeroLine, chartMargin + chartWidth, zeroLine);
  noStroke();
  fill(0);
  textSize(12);
  textAlign(RIGHT, CENTER);
  text("0%", chartMargin - 5, zeroLine);
  

  // Draw positive and negative reference lines with labels
  // Positive side
  for (let i = 10; i <= maxReturn; i += 10) {
    let y = zeroLine - (i * chartHeight / (maxReturn - minReturn));
    stroke(220);
    strokeWeight(0.5);
    line(chartMargin, y, chartMargin + chartWidth, y);
    noStroke();
    fill(0);
    textAlign(RIGHT, CENTER);
    text(i + "%", chartMargin - 5, y);
  }
  
  // Negative side
  for (let i = -10; i >= minReturn; i -= 10) {
    let y = zeroLine - (i * chartHeight / (maxReturn - minReturn));
    stroke(220);
    strokeWeight(0.5);
    line(chartMargin, y, chartMargin + chartWidth, y);
    noStroke();
    fill(0);
    textAlign(RIGHT, CENTER);
    text(i + "%", chartMargin - 5, y);
  }
  
  // Calculate bar width based on the number of displayed years
  let yearCount = endYearIndex - startYearIndex + 1;
  let barWidth = chartWidth / yearCount - barPadding;
  
  currentHover = -1;
  
  // Draw bars
  for (let i = startYearIndex; i <= endYearIndex; i++) {
    let data = yearsData[i];
    let x = chartMargin + (i - startYearIndex) * (barWidth + barPadding);
    
    // Bar height proportional to return value
    let returnHeight = abs(data.return) * chartHeight / (maxReturn - minReturn);
    
    // Position y based on positive or negative return
    let y = data.return >= 0 ? zeroLine - returnHeight : zeroLine;
    
    // Choose color based on return (green for positive, red for negative)
    let barColor = data.return >= 0 ? color(144, 238, 144) : color(255, 182, 193);
    
    // Check if mouse is over this bar
    if (mouseX >= x && mouseX <= x + barWidth && mouseY >= min(y, zeroLine) && mouseY <= max(y + returnHeight, zeroLine)) {
      // Highlight on hover
      barColor = data.return >= 0 ? color(0, 200, 0) : color(200, 0, 0);
      currentHover = i;
    }
    
    // Draw the bar
    fill(barColor);
    noStroke();
    rect(x, y, barWidth, returnHeight);
    
    // Draw year label
    push();
    fill(0);
    textSize(10);
    textAlign(CENTER, TOP);
    translate(x + barWidth/2, zeroLine + 5);
    rotate(PI/8); // Rotate text to avoid overlap with close bars
    text(data.year, 0, 0);
    pop();
    
    // Draw return percentage at top/bottom of bar
    fill(0);
    textSize(11);
    textAlign(CENTER, data.return >= 0 ? BOTTOM : TOP);
    let returnText = data.return.toFixed(1) + "%";
    let returnY = data.return >= 0 ? y - 2 : y + returnHeight + 2;
    text(returnText, x + barWidth/2, returnY);
  }
  
  // Draw the Average Line with label
  let avg = -52;
  stroke('blue');
  strokeWeight(2);
  line(chartMargin, zeroLine+avg, chartMargin + chartWidth + 30, zeroLine+avg);
  noStroke();
  fill('blue');
  textSize(12);
  textAlign(RIGHT, CENTER);
  text("Avg",  canvasWidth - 20, zeroLine+avg - 10);
  text("10.5", canvasWidth - 20, zeroLine+avg + 10);
  
  // Display hover information
  if (currentHover >= 0) {
    let data = yearsData[currentHover];
    let infoX = margin/4;
    let infoY = drawHeight - 60;
    let infoWidth = canvasWidth - margin/4;
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
    // this is too complicated
    text(`${data.year}: ${data.return >= 0 ? "+" : ""}${data.return.toFixed(2)}%`, infoX + 10, infoY + 10);
    
    text(`${data.influence}`, infoX + 10, infoY + 30, infoWidth - 20, infoHeight - 40);

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
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}