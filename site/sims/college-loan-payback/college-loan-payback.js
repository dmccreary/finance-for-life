// College Loan Payback Calculator MicroSim
// See https://educationdata.org/average-student-loan-interest-rate for average interest rates
// Canvas dimensions
let canvasWidth = 500;
let drawHeight = 240;
let controlHeight = 160;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 220;
let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Loan calculation variables
let yearsInCollege = 4;
let costPerYear = 50000;
let interestRate = 5.5;
let monthlyPayment = 500;
let totalLoan = 0;
let monthsToPay = 0;
let yearsToPay = 0;
let totalInterest = 0;
let calculationPerformed = false;

// UI Controls
let yearsSlider, costSlider, interestSlider, paymentSlider;

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  
  // Create sliders
  yearsSlider = createSlider(1, 6, 4);
  yearsSlider.position(sliderLeftMargin, drawHeight + 20);
  yearsSlider.size(containerWidth - sliderLeftMargin - margin);
  
  costSlider = createSlider(1000, 120000, 50000, 1000);
  costSlider.position(sliderLeftMargin, drawHeight + 50);
  costSlider.size(containerWidth - sliderLeftMargin - margin);
  
  interestSlider = createSlider(2, 12, 6.5, 0.1);
  interestSlider.position(sliderLeftMargin, drawHeight + 80);
  interestSlider.size(containerWidth - sliderLeftMargin - margin);
  
  paymentSlider = createSlider(100, 3000, 1100, 50);
  paymentSlider.position(sliderLeftMargin, drawHeight + 110);
  paymentSlider.size(containerWidth - sliderLeftMargin - margin);
  
  // Initial calculation
  calculateLoan();
  
  describe('A college loan payback calculator that helps students understand how long it will take to pay off their college loans.  2024 undergrad rates average 6.5%', LABEL);
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
  yearsInCollege = yearsSlider.value();
  costPerYear = costSlider.value();
  interestRate = interestSlider.value();
  monthlyPayment = paymentSlider.value();
  
  // Auto-recalculate whenever slider values change
  calculateLoan();
  
  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("College Loan Payback Calculator", canvasWidth/2, margin/2);
  
  // Draw control labels
  drawControlLabels();
  
  // Draw calculation results
  if (calculationPerformed) {
    drawCalculationResults();
  } else {
    // Initial instructions
    fill('navy');
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Adjust the sliders to see how long", canvasWidth/2, drawHeight/2 - 30);
    text("it will take to pay back your loan", canvasWidth/2, drawHeight/2);
  }
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  
  // Label with current value of the sliders
  text(`Years in College: ${yearsInCollege}`, margin, drawHeight + 30);
  text(`Cost per Year: $${numberWithCommas(costPerYear)}`, margin, drawHeight + 60);
  text(`Interest Rate: ${interestRate}%`, margin, drawHeight + 90);
  text(`Monthly Payment: $${numberWithCommas(monthlyPayment)}`, margin, drawHeight + 120);
}

function calculateLoan() {
  // Calculate the total loan amount with interest
  totalLoan = yearsInCollege * costPerYear;
  
  // Calculate months to pay off the loan
  // Using formula for compound interest with monthly payments
  let monthlyRate = interestRate / 100 / 12;
  
  if (monthlyRate === 0) {
    // Simple division if no interest
    monthsToPay = Math.ceil(totalLoan / monthlyPayment);
    totalInterest = 0;
  } else {
    // If monthly payment is too small to cover interest
    let minimumPayment = totalLoan * monthlyRate;
    
    if (monthlyPayment <= minimumPayment) {
      // Payment too small to ever pay off loan
      monthsToPay = Infinity;
      totalInterest = Infinity;
    } else {
      // Formula: months = -ln(1 - P*r/M) / ln(1 + r)
      // where P = principal, r = monthly rate, M = monthly payment
      monthsToPay = Math.ceil(Math.log(1 - (totalLoan * monthlyRate / monthlyPayment)) / Math.log(1 + monthlyRate) * -1);
      
      // Calculate total interest using amortization
      totalInterest = calculateTotalInterest(totalLoan, monthlyRate, monthlyPayment, monthsToPay);
    }
  }
  
  yearsToPay = Math.floor(monthsToPay / 12);
  let remainingMonths = monthsToPay % 12;
  
  calculationPerformed = true;
}

function calculateTotalInterest(principal, monthlyRate, payment, months) {
  // Use proper amortization to calculate total interest
  let balance = principal;
  let totalInterest = 0;
  
  // Handle the case where months is Infinity
  if (!isFinite(months)) {
    return Infinity;
  }
  
  for (let i = 0; i < months; i++) {
    // Calculate interest for this month
    let interestThisMonth = balance * monthlyRate;
    totalInterest += interestThisMonth;
    
    // Apply payment
    let principalPayment = payment - interestThisMonth;
    
    // Ensure we don't overpay on the last payment
    if (principalPayment > balance) {
      // Last payment - only pay what's needed
      totalInterest -= (principalPayment - balance) * monthlyRate;
      balance = 0;
      break;
    } else {
      balance -= principalPayment;
    }
  }
  
  return totalInterest;
}

function drawCalculationResults() {
  // Display the calculation results
  textSize(18);
  fill('black');
  textAlign(LEFT, TOP);
  
  let yPos = margin * 2;
  
  text(`Total Loan Amount: $${numberWithCommas(totalLoan)}`, margin * 2, yPos);
  yPos += 30;
  
  if (monthsToPay === Infinity) {
    fill('red');
    text("Monthly payment is too small to cover interest.", margin * 2, yPos);
    yPos += 30;
    text("You will never be able to pay off this loan.", margin * 2, yPos);
  } else {
    // Years and months to pay off
    let yearsText = yearsToPay === 1 ? "year" : "years";
    let monthsText = (monthsToPay % 12) === 1 ? "month" : "months";
    
    text(`Time to Pay Off: ${yearsToPay} ${yearsText} and ${monthsToPay % 12} ${monthsText}`, margin * 2, yPos);
    yPos += 30;
    
    text(`Total Interest Paid: $${numberWithCommas(Math.round(totalInterest))}`, margin * 2, yPos);
    yPos += 30;
    
    text(`Total Amount Paid: $${numberWithCommas(Math.round(totalLoan + totalInterest))}`, margin * 2, yPos);
    
    // Draw a visualization of the ratio between principal and interest
    let totalPaid = totalLoan + totalInterest;
    let principalRatio = totalLoan / totalPaid;
    
    // Draw bar
    let barY = yPos + 40;
    let barHeight = 30;
    let barWidth = canvasWidth - (margin * 4);
    
    // Principal portion
    fill('steelblue');
    rect(margin * 2, barY, barWidth * principalRatio, barHeight);
    
    // Interest portion
    fill('tomato');
    rect(margin * 2 + (barWidth * principalRatio), barY, barWidth * (1 - principalRatio), barHeight);
    
    // Labels
    textSize(14);
    fill('black');
    text("Principal", margin * 2, barY + barHeight + 5);
    textAlign(RIGHT);
    text("Interest", margin * 2 + barWidth, barY + barHeight + 5);
    textAlign(LEFT);
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
  yearsSlider.size(containerWidth - sliderLeftMargin - margin);
  costSlider.size(containerWidth - sliderLeftMargin - margin);
  interestSlider.size(containerWidth - sliderLeftMargin - margin);
  paymentSlider.size(containerWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}