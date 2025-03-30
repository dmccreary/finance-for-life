// Investment Comparison MicroSim
// Canvas dimensions
let canvasWidth = 500;
let drawHeight = 400;
let controlHeight = 135;
let canvasHeight = drawHeight + controlHeight;
let margin = 40;
let sliderLeftMargin = 240;
let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Investment parameters
let initialInvestment = 10000; // default $10,000
let annualFee = 1.0; // default 1.0%
let investmentPeriod = 5; // default 5 years
let marketReturn = 7.0; // default 7.0%

// UI Controls
let initialInvestmentSlider, annualFeeSlider, investmentPeriodSlider, marketReturnSlider;

// Calculation results
let activeFundValues = [];
let indexFundValues = [];
let simulationRun = false;

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  
  // Create sliders
  initialInvestmentSlider = createSlider(1, 50, 10);
  initialInvestmentSlider.position(sliderLeftMargin, drawHeight + 15);
  initialInvestmentSlider.size(containerWidth - sliderLeftMargin - margin);
  initialInvestmentSlider.input(runSimulation);
  
  annualFeeSlider = createSlider(0, 2.5, 1.0, 0.1);
  annualFeeSlider.position(sliderLeftMargin, drawHeight + 45);
  annualFeeSlider.size(containerWidth - sliderLeftMargin - margin);
  annualFeeSlider.input(runSimulation);
  
  investmentPeriodSlider = createSlider(1, 30, 5);
  investmentPeriodSlider.position(sliderLeftMargin, drawHeight + 75);
  investmentPeriodSlider.size(containerWidth - sliderLeftMargin - margin);
  investmentPeriodSlider.input(runSimulation);
  
  marketReturnSlider = createSlider(1, 15, 7, 0.5);
  marketReturnSlider.position(sliderLeftMargin, drawHeight + 105);
  marketReturnSlider.size(containerWidth - sliderLeftMargin - margin);
  marketReturnSlider.input(runSimulation);
  
  // Run simulation with default values
  runSimulation();
  
  describe('An investment comparison MicroSim showing the difference between an actively managed fund with fees and a zero-fee index fund over time.', LABEL);
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
  
  // Update variables from sliders
  initialInvestment = initialInvestmentSlider.value() * 1000;
  annualFee = annualFeeSlider.value();
  investmentPeriod = investmentPeriodSlider.value();
  marketReturn = marketReturnSlider.value();
  
  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("Active vs Indexed Fund Investment Fee Comparison", canvasWidth/2, margin/4);
  
  // Draw control labels
  drawControlLabels();
  
  // Draw chart
  drawChart();
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  
  // Label with current value of the sliders
  text(`Initial Investment: $${numberWithCommas(initialInvestment)}`, margin, drawHeight + 25);
  text(`Annual Fee: ${annualFee.toFixed(1)}%`, margin, drawHeight + 55);
  text(`Investment Period: ${investmentPeriod} years`, margin, drawHeight + 85);
  text(`Market Return: ${marketReturn.toFixed(1)}%`, margin, drawHeight + 115);
}

function runSimulation() {
  // Calculate investment growth for both strategies
  activeFundValues = [];
  indexFundValues = [];
  
  // Get current values from sliders
  initialInvestment = initialInvestmentSlider.value() * 1000;
  annualFee = annualFeeSlider.value();
  investmentPeriod = investmentPeriodSlider.value();
  marketReturn = marketReturnSlider.value();
  
  // Initial values
  activeFundValues.push(initialInvestment);
  indexFundValues.push(initialInvestment);
  
  // Calculate for each year
  for (let year = 1; year <= investmentPeriod; year++) {
    // Active fund (with fees)
    let activeValue = activeFundValues[year - 1] * (1 + (marketReturn - annualFee) / 100);
    activeFundValues.push(activeValue);
    
    // Index fund (no fees)
    let indexValue = indexFundValues[year - 1] * (1 + marketReturn / 100);
    indexFundValues.push(indexValue);
  }
  
  simulationRun = true;
}

function drawChart() {
  // Set up chart area
  let chartMargin = 50;
  let chartWidth = canvasWidth - 2 * chartMargin;
  let chartHeight = drawHeight - 2 * chartMargin;
  
  // Calculate max value for scaling
  let maxValue = 0;
  for (let i = 0; i < activeFundValues.length; i++) {
    maxValue = max(maxValue, activeFundValues[i], indexFundValues[i]);
  }
  
  // Round up max value to a nice number
  maxValue = ceil(maxValue / 10000) * 10000;
  
  // Draw axes
  push();
  translate(chartMargin * .7, 0)
  stroke('black');
  strokeWeight(1);
  
  // Y-axis
  line(chartMargin, chartMargin, chartMargin, chartMargin + chartHeight);
  
  // X-axis
  line(chartMargin, chartMargin + chartHeight, chartMargin + chartWidth, chartMargin + chartHeight);
  
  // Draw Y-axis labels
  textAlign(RIGHT, CENTER);
  noStroke();
  fill('black');
  textSize(12);
  
  // Y-axis tick marks and labels
  for (let i = 0; i <= 5; i++) {
    let y = chartMargin + chartHeight - (i * chartHeight / 5);
    let value = (i * maxValue / 5);
    line(chartMargin - 5, y, chartMargin, y);
    text('$' + numberWithCommas(round(value)), chartMargin - 10, y);
  }
  
  // Draw X-axis labels
  textAlign(CENTER, TOP);
  
  // X-axis tick marks and labels
  for (let i = 0; i <= investmentPeriod; i++) {
    let x = chartMargin + (i * chartWidth / investmentPeriod);
    line(x, chartMargin + chartHeight, x, chartMargin + chartHeight + 5);
    text(i, x, chartMargin + chartHeight + 10);
  }
  
  // X and Y axis titles
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text("Year", chartMargin + chartWidth / 2, drawHeight - 10);
  
  
  // rotate for vertical drawing
  push();
  translate(-10, chartMargin*4);
  rotate(-PI / 2);
  text("Investment Value ($)", 0, 0);
  pop();
  
  // Draw Active Fund line (red)
  stroke('red');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < activeFundValues.length; i++) {
    let x = chartMargin + (i * chartWidth / investmentPeriod);
    let y = chartMargin + chartHeight - (activeFundValues[i] * chartHeight / maxValue);
    vertex(x, y);
  }
  endShape();
  
  // Draw Index Fund line (green)
  stroke('green');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < indexFundValues.length; i++) {
    let x = chartMargin + (i * chartWidth / investmentPeriod);
    let y = chartMargin + chartHeight - (indexFundValues[i] * chartHeight / maxValue);
    vertex(x, y);
  }
  endShape();
  
  // Draw legend
  // change this to move the legend to the right or left
  xOffset = chartMargin+20
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  
  // Active fund
  fill('red');
  rect(xOffset + 20, chartMargin, 15, 15);
  fill('black');
  text("Active Fund (with fees)", xOffset + 40, chartMargin + 7);
  
  // Index fund
  fill('green');
  rect(xOffset + 220, chartMargin, 15, 15);
  fill('black');
  text("Index Fund (no fees)", xOffset + 240, chartMargin + 7);
  pop();
  
  // Show final values and difference
  textAlign(LEFT, BOTTOM);
  textSize(16);
  fill('black');
  
  let finalActiveValue = activeFundValues[activeFundValues.length - 1];
  let finalIndexValue = indexFundValues[indexFundValues.length - 1];
  let difference = finalIndexValue - finalActiveValue;
  let percentDifference = (difference / finalActiveValue) * 100;
  
  xOffset = canvasWidth - 250;
  let valuesY = chartMargin + chartHeight - 20;
  text(`Final Active Fund: $${numberWithCommas(round(finalActiveValue))}`, xOffset, valuesY - 40);
  text(`Final Index Fund: $${numberWithCommas(round(finalIndexValue))}`, xOffset, valuesY - 20);
  text(`Difference: $${numberWithCommas(round(difference))} (${percentDifference.toFixed(1)}%)`, xOffset, valuesY);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
  
  // Resize the sliders to match the new canvasWidth
  initialInvestmentSlider.size(containerWidth - sliderLeftMargin - margin);
  annualFeeSlider.size(containerWidth - sliderLeftMargin - margin);
  investmentPeriodSlider.size(containerWidth - sliderLeftMargin - margin);
  marketReturnSlider.size(containerWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}