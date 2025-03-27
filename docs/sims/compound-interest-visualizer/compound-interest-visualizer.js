// Compound Interest Visualizer MicroSim
// Show the initial and interest amounts in a savings account
// using a horizontal time-series line graph
// Canvas dimensions
let canvasWidth = 500;
let drawHeight = 420;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
// this should be adjusted to the width of the label and values
let sliderLeftMargin = 210;

let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Savings parameters
let initialInvestment = 10000; // default $10,000
let interestRate = 2.0; // default 2.0%
let timePeriod = 12; // default 12 months

// UI Controls
let initialInvestmentSlider, interestRateSlider, timePeriodSlider;

// Calculation results
let savingsValues = [];
let interestEarned = [];
let totalInterest = 0;
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
  initialInvestmentSlider.size(containerWidth - sliderLeftMargin - margin*2);
  initialInvestmentSlider.input(runSimulation);
  
  interestRateSlider = createSlider(0, 10, 2.0, 0.1);
  interestRateSlider.position(sliderLeftMargin, drawHeight + 45);
  interestRateSlider.size(containerWidth - sliderLeftMargin - margin*2);
  interestRateSlider.input(runSimulation);
  
  timePeriodSlider = createSlider(1, 36, 12);
  timePeriodSlider.position(sliderLeftMargin, drawHeight + 75);
  timePeriodSlider.size(containerWidth - sliderLeftMargin - margin*2);
  timePeriodSlider.input(runSimulation);
  
  // Run simulation with default values
  runSimulation();
  
  describe('A savings interest calculator that visualizes how your savings grow over time with compound interest.', LABEL);
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
  interestRate = interestRateSlider.value();
  timePeriod = timePeriodSlider.value();
  
  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("Savings Compound Interest Calculator", canvasWidth/2, margin);
  
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
  text(`Interest Rate: ${interestRate.toFixed(1)}%`, margin, drawHeight + 55);
  text(`Time Period: ${timePeriod} months`, margin, drawHeight + 85);
}

function runSimulation() {
  // Calculate savings growth with compound interest
  savingsValues = [];
  interestEarned = [];
  totalInterest = 0;
  
  // Get current values from sliders
  initialInvestment = initialInvestmentSlider.value() * 1000;
  interestRate = interestRateSlider.value();
  timePeriod = timePeriodSlider.value();
  
  // Initial values
  savingsValues.push(initialInvestment);
  interestEarned.push(0);
  
  // Calculate for each month
  let monthlyRate = interestRate / 100 / 12;
  let currentPrincipal = initialInvestment;
  
  for (let month = 1; month <= timePeriod; month++) {
    // Calculate interest for this month
    let monthlyInterest = currentPrincipal * monthlyRate;
    totalInterest += monthlyInterest;
    
    // Add to principal
    currentPrincipal += monthlyInterest;
    
    // Store values
    savingsValues.push(currentPrincipal);
    interestEarned.push(totalInterest);
  }
  
  simulationRun = true;
}

function drawChart() {
  if (!simulationRun || timePeriod === 0) return;
  
  // Set up chart area
  let chartMargin = 50;
  let chartWidth = canvasWidth - 2 * chartMargin;
  let chartHeight = drawHeight - 3 * chartMargin;
  
  // Calculate max value for scaling
  let maxValue = Math.max(...savingsValues);
  
  // Round up max value to a nice number
  maxValue = ceil(maxValue / 1000) * 1000;
  
  // Draw axes
  // use these lines to move the entire chart around on the canvas
  push();
     translate(35, 45);
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
  
  // X-axis tick marks and labels - handle case where timePeriod is 0
  let xAxisStep = max(1, floor(timePeriod / 6)); // Show at most 6 ticks
  for (let i = 0; i <= timePeriod; i += xAxisStep) {
    let x = chartMargin + (i * chartWidth / timePeriod);
    line(x, chartMargin + chartHeight, x, chartMargin + chartHeight + 5);
    text(i, x, chartMargin + chartHeight + 10);
  }
  
  // X and Y axis titles
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text("Month", chartMargin + chartWidth / 2, drawHeight - 55);
  
  push();
     translate(chartMargin - 35, chartMargin + chartHeight/2);
     rotate(-PI / 2);
     text("Account Value ($)", 0, -25);
  pop();
  
  // Draw Initial Investment area (blue)
  fill('rgba(0, 0, 255, 0.3)');
  stroke('blue');
  strokeWeight(1);
  beginShape();
  // Start at the bottom left
  vertex(chartMargin, chartMargin + chartHeight);
  
  // Draw the line across at initial investment level
  for (let i = 0; i <= timePeriod; i++) {
    let x = chartMargin + (i * chartWidth / timePeriod);
    let y = chartMargin + chartHeight - (initialInvestment * chartHeight / maxValue);
    vertex(x, y);
  }
  
  // Go to the bottom right and back to bottom left to complete the shape
  vertex(chartMargin + chartWidth, chartMargin + chartHeight);
  vertex(chartMargin, chartMargin + chartHeight);
  endShape(CLOSE);
  
  // Draw Interest Earned area (green)
  if (interestRate > 0 && timePeriod > 0) {
    fill('rgba(0, 255, 0, 0.3)');
    stroke('green');
    strokeWeight(1);
    beginShape();
    
    // Start at initial investment level at left
    vertex(chartMargin, chartMargin + chartHeight - (initialInvestment * chartHeight / maxValue));
    
    // Draw the top line showing principal + interest
    for (let i = 0; i <= timePeriod; i++) {
      let x = chartMargin + (i * chartWidth / timePeriod);
      let y = chartMargin + chartHeight - (savingsValues[i] * chartHeight / maxValue);
      vertex(x, y);
    }
    
    // Draw back along initial investment line
    for (let i = timePeriod; i >= 0; i--) {
      let x = chartMargin + (i * chartWidth / timePeriod);
      let y = chartMargin + chartHeight - (initialInvestment * chartHeight / maxValue);
      vertex(x, y);
    }
    
    endShape(CLOSE);
  }
  
  // Draw legend
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  
  // Draw the Key
  push();
     translate(0, -20);
    // Initial Investment Key
    fill('rgba(0, 0, 255, 0.3)');
    stroke('blue');
    rect(chartMargin+30, chartMargin-8, 15, 15);
    noStroke();
    fill('black');
    text("Initial Investment", chartMargin + 50, chartMargin);

    // Interest Earned Key
    fill('rgba(0, 255, 0, 0.3)');
    stroke('green');
    rect(chartMargin + 180, chartMargin-8, 15, 15);
    noStroke();
    fill('black');
    text("Interest Earned", chartMargin + 200, chartMargin);
  pop();
  
  // Show final values
  push();
  // adjust these values to move the final amounts
  translate(0, -60);
  textAlign(RIGHT, BOTTOM);
  textSize(16);
  fill('black');
  
  let finalValue = savingsValues[timePeriod];
  
  let valueY = chartMargin + 25;
  text(`Final Value: $${numberWithCommas(round(finalValue))}`, canvasWidth - chartMargin, valueY);
  text(`Total Interest: $${numberWithCommas(round(totalInterest))}`, canvasWidth - chartMargin, valueY + 25);
  // the final value
  pop();
  
  // the entire chart
  pop();
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
  interestRateSlider.size(containerWidth - sliderLeftMargin - margin);
  timePeriodSlider.size(containerWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}