// Social Security Calculator MicroSim
// Canvas dimensions
let canvasWidth = 500;
let drawHeight = 400;
let controlHeight = 200;
let canvasHeight = drawHeight + controlHeight;
let margin = 40;
let sliderLeftMargin = 240;
let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Social Security parameters
let currentAge = 62;
let lifeExpectancy = 85;
let monthlyBenefitAtFRA = 2000; // Estimated monthly benefit at full retirement age
let interestRate = 3.0; // Interest rate for early benefits investment
let fullRetirementAge = 67; // Full retirement age (FRA)

// UI Controls
let currentAgeSlider, lifeExpectancySlider, monthlyBenefitSlider, interestRateSlider;

// Calculation results
let startingOptions = [];
let cumulativeTotals = {};
let crossoverPoints = {};
let simulationRun = false;

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  
  // Create sliders
  currentAgeSlider = createSlider(55, 75, 62, 1);
  currentAgeSlider.position(sliderLeftMargin, drawHeight + 15);
  currentAgeSlider.size(containerWidth - sliderLeftMargin - margin);
  currentAgeSlider.input(runSimulation);
  
  lifeExpectancySlider = createSlider(70, 100, 85, 1);
  lifeExpectancySlider.position(sliderLeftMargin, drawHeight + 45);
  lifeExpectancySlider.size(containerWidth - sliderLeftMargin - margin);
  lifeExpectancySlider.input(runSimulation);
  
  monthlyBenefitSlider = createSlider(500, 3500, 2000, 100);
  monthlyBenefitSlider.position(sliderLeftMargin, drawHeight + 75);
  monthlyBenefitSlider.size(containerWidth - sliderLeftMargin - margin);
  monthlyBenefitSlider.input(runSimulation);
  
  interestRateSlider = createSlider(0, 10, 3, 0.25);
  interestRateSlider.position(sliderLeftMargin, drawHeight + 105);
  interestRateSlider.size(containerWidth - sliderLeftMargin - margin);
  interestRateSlider.input(runSimulation);
  
  // Run simulation with default values
  runSimulation();
  
  describe('A Social Security Calculator MicroSim showing the optimal age to start taking benefits based on life expectancy and potential investment returns.', LABEL);
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
  currentAge = currentAgeSlider.value();
  lifeExpectancy = lifeExpectancySlider.value();
  monthlyBenefitAtFRA = monthlyBenefitSlider.value();
  interestRate = interestRateSlider.value();
  
  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("Social Security Starting Age Calculator", canvasWidth/2, margin/4);
  
  // Draw control labels
  drawControlLabels();
  
  // Draw chart
  drawChart();
  
  // Show crossover points and totals
  drawCrossoverInfo();
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  
  // Label with current value of the sliders
  text(`Current Age: ${currentAge}`, margin/3, drawHeight + 25);
  text(`Life Expectancy: ${lifeExpectancy}`, margin/3, drawHeight + 55);
  text(`Monthly Benefit at FRA: $${numberWithCommas(monthlyBenefitAtFRA)}`, margin/3, drawHeight + 85);
  text(`Interest Rate: ${interestRate.toFixed(2)}%`, margin/3, drawHeight + 115);
  
  // Additional help text
  textSize(14);
  textAlign(LEFT, TOP);
  text("Adjust the sliders to see how different starting ages affect total benefits.", 
       margin, drawHeight + 140);
  text("The crossover points show when later starting ages surpass earlier ones in total value.", 
       margin, drawHeight + 160);
  
  // FRA information
  textSize(14);
  textAlign(RIGHT, TOP);
  text(`Full Retirement Age (FRA): ${fullRetirementAge}`, 
       canvasWidth - margin, drawHeight + 140);
}

function runSimulation() {
  // Define starting options (62, 63, ..., 70)
  startingOptions = [];
  let minStartAge = Math.max(62, currentAge);
  let maxStartAge = Math.min(70, lifeExpectancy - 1);
  
  for (let age = minStartAge; age <= maxStartAge; age++) {
    startingOptions.push(age);
  }
  
  // Reset calculation results
  cumulativeTotals = {};
  crossoverPoints = {};
  
  // Calculate benefit adjustments based on starting age
  let benefitFactors = {};
  
  for (let age of startingOptions) {
    if (age < fullRetirementAge) {
      // Reduction for early retirement (approximately 5/9% per month for first 36 months, 5/12% beyond that)
      let monthsEarly = (fullRetirementAge - age) * 12;
      let reductionFactor;
      
      if (monthsEarly <= 36) {
        reductionFactor = monthsEarly * (5/9) / 100;
      } else {
        reductionFactor = 36 * (5/9) / 100 + (monthsEarly - 36) * (5/12) / 100;
      }
      
      benefitFactors[age] = 1 - reductionFactor;
    } else if (age > fullRetirementAge) {
      // Increase for delayed retirement (8% per year)
      let yearsLate = age - fullRetirementAge;
      benefitFactors[age] = 1 + (yearsLate * 8 / 100);
    } else {
      // At full retirement age
      benefitFactors[age] = 1;
    }
  }
  
  // Calculate monthly benefits for each starting age
  let monthlyBenefits = {};
  for (let age of startingOptions) {
    monthlyBenefits[age] = monthlyBenefitAtFRA * benefitFactors[age];
  }
  
  // Calculate cumulative totals from starting age to life expectancy
  for (let startAge of startingOptions) {
    cumulativeTotals[startAge] = {};
    let totalWithInterest = 0;
    let totalNoInterest = 0;
    
    for (let age = startAge; age <= lifeExpectancy; age++) {
      // For each year
      let annualBenefit = monthlyBenefits[startAge] * 12;
      
      // Without interest
      totalNoInterest += annualBenefit;
      cumulativeTotals[startAge][age] = totalNoInterest;
      
      // With interest on previous balance plus half of current year's benefits
      // (assuming benefits received throughout the year)
      if (interestRate > 0) {
        totalWithInterest = totalWithInterest * (1 + interestRate/100) + annualBenefit;
        cumulativeTotals[startAge][age] = totalWithInterest;
      }
    }
  }
  
  // Find crossover points (when a later starting age surpasses an earlier one)
  for (let i = 0; i < startingOptions.length - 1; i++) {
    let earlierAge = startingOptions[i];
    
    for (let j = i + 1; j < startingOptions.length; j++) {
      let laterAge = startingOptions[j];
      
      // Find the first age where later starting age has higher cumulative total
      for (let age = laterAge; age <= lifeExpectancy; age++) {
        if (cumulativeTotals[laterAge][age] > cumulativeTotals[earlierAge][age]) {
          crossoverPoints[`${earlierAge}-${laterAge}`] = age;
          break;
        }
      }
    }
  }
  
  simulationRun = true;
}

function drawChart() {
  if (!simulationRun || startingOptions.length === 0) return;
  
  // Set up chart area
  let chartMargin = 60;
  let chartWidth = canvasWidth - 2 * chartMargin;
  let chartHeight = drawHeight - 2 * chartMargin;
  
  // Calculate max value for scaling
  let maxValue = 0;
  for (let startAge in cumulativeTotals) {
    for (let age in cumulativeTotals[startAge]) {
      maxValue = max(maxValue, cumulativeTotals[startAge][age]);
    }
  }
  
  // Round up max value to a nice number
  maxValue = ceil(maxValue / 100000) * 100000;
  
  push();
  translate(40,0);
  // Draw axes
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
  let minAge = currentAge;
  let ageRange = lifeExpectancy - minAge;
  
  for (let i = 0; i <= 10; i++) {
    let age = minAge + (i * ageRange / 10);
    let x = chartMargin + (i * chartWidth / 10);
    line(x, chartMargin + chartHeight, x, chartMargin + chartHeight + 5);
    text(round(age), x, chartMargin + chartHeight + 10);
  }
  
  // X and Y axis titles
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text("Age", chartMargin + chartWidth / 2, drawHeight - 15);
  
  push();
  translate(15, chartMargin + chartHeight / 2);
  rotate(-PI / 2);
  text("Total Benefits ($)", 0, -30);
  pop();
  
  // Define colors for each starting age
  let colors = [
    color(220, 20, 60),    // Crimson
    color(0, 128, 0),      // Green
    color(0, 0, 255),      // Blue
    color(255, 165, 0),    // Orange
    color(128, 0, 128),    // Purple
    color(0, 128, 128),    // Teal
    color(139, 69, 19),    // Brown
    color(255, 0, 255),    // Magenta
    color(0, 0, 0)         // Black
  ];
  
  // Draw lines for each starting age
  for (let i = 0; i < startingOptions.length; i++) {
    let startAge = startingOptions[i];
    let lineColor = colors[i % colors.length];
    
    stroke(lineColor);
    strokeWeight(2);
    noFill();
    
    beginShape();
    let firstPoint = true;
    
    for (let age = startAge; age <= lifeExpectancy; age++) {
      let x = chartMargin + ((age - minAge) / ageRange) * chartWidth;
      let y = chartMargin + chartHeight - (cumulativeTotals[startAge][age] / maxValue) * chartHeight;
      
      if (firstPoint) {
        // Move to the first point
        vertex(x, chartMargin + chartHeight); // Start at x-axis
        vertex(x, y); // Then up to the actual value
        firstPoint = false;
      } else {
        vertex(x, y);
      }
    }
    endShape();
  }
  
  // Draw legend
  let legendX = chartMargin + 10;
  let legendY = chartMargin + 20;
  let legendSpacing = 20;
  
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);
  
  for (let i = 0; i < startingOptions.length; i++) {
    let startAge = startingOptions[i];
    let legendColor = colors[i % colors.length];
    
    fill(legendColor);
    rect(legendX, legendY + i * legendSpacing, 15, 15);
    
    fill('black');
    let monthlyAmount = monthlyBenefitAtFRA * getBenefitFactor(startAge);
    text(`Start at ${startAge}: $${round(monthlyAmount)}/month`, legendX + 25, legendY + i * legendSpacing + 7);
  }
  
  // Mark crossover points
  for (let key in crossoverPoints) {
    let [earlierAge, laterAge] = key.split('-').map(Number);
    let crossoverAge = crossoverPoints[key];
    
    let x = chartMargin + ((crossoverAge - minAge) / ageRange) * chartWidth;
    let y = chartMargin + chartHeight - (cumulativeTotals[laterAge][crossoverAge] / maxValue) * chartHeight;
    
    // Draw crossover marker
    fill(255);
    stroke(0);
    strokeWeight(1);
    ellipse(x, y, 8, 8);
  }
  pop();
}

function drawCrossoverInfo() {
  if (!simulationRun || startingOptions.length <= 1) return;
  
  // Show the final totals and crossover points
  textAlign(LEFT, TOP);
  textSize(14);
  fill('black');
  noStroke();
  
  let infoX = margin;
  let infoY = drawHeight + 180;
  
  if (Object.keys(crossoverPoints).length > 0) {
    text("Crossover Points:", infoX, infoY);
    
    let crossoverText = "";
    let count = 0;
    
    for (let key in crossoverPoints) {
      let [earlierAge, laterAge] = key.split('-').map(Number);
      let crossoverAge = crossoverPoints[key];
      
      // Only show key crossover points to avoid cluttering
      if (count < 3) {
        crossoverText += `Start at ${laterAge} passes ${earlierAge} at age ${crossoverAge}. `;
        count++;
      }
    }
    
    // Wrap text to avoid overflow
    textSize(12);
    text(crossoverText, infoX, infoY + 20, canvasWidth - 2 * margin, 60);
  } else {
    text("No crossover points found within life expectancy.", infoX, infoY);
  }
}

function getBenefitFactor(age) {
  if (age < fullRetirementAge) {
    // Reduction for early retirement
    let monthsEarly = (fullRetirementAge - age) * 12;
    let reductionFactor;
    
    if (monthsEarly <= 36) {
      reductionFactor = monthsEarly * (5/9) / 100;
    } else {
      reductionFactor = 36 * (5/9) / 100 + (monthsEarly - 36) * (5/12) / 100;
    }
    
    return 1 - reductionFactor;
  } else if (age > fullRetirementAge) {
    // Increase for delayed retirement
    let yearsLate = age - fullRetirementAge;
    return 1 + (yearsLate * 8 / 100);
  } else {
    // At full retirement age
    return 1;
  }
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
  currentAgeSlider.size(containerWidth - sliderLeftMargin - margin);
  lifeExpectancySlider.size(containerWidth - sliderLeftMargin - margin);
  monthlyBenefitSlider.size(containerWidth - sliderLeftMargin - margin);
  interestRateSlider.size(containerWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}