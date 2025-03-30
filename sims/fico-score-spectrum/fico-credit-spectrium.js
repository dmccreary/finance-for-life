// Credit Score Spectrum MicroSim using p5.js
// Canvas dimensions
let canvasWidth = 800;
let canvasHeight = 300;
let margin = 40;
let spectrumHeight = 60;
let infoBoxHeight = 120;
let defaultTextSize = 16;

// Score ranges data
let scoreRanges = [
  { 
    range: "300-579", 
    start: 300,
    end: 579,
    category: "Poor", 
    interpretation: "Well below average. Demonstrates to lenders that you're a risky borrower.",
    color: "#ff4d4d"
  },
  { 
    range: "580-669", 
    start: 580,
    end: 669,
    category: "Fair", 
    interpretation: "Below average. Many lenders will approve loans but not at the best rates.",
    color: "#ff9933"
  },
  { 
    range: "670-739", 
    start: 670,
    end: 739,
    category: "Good", 
    interpretation: "Near or slightly above average. Most lenders view this as a good score.",
    color: "#ffcc00"
  },
  { 
    range: "740-799", 
    start: 740,
    end: 799,
    category: "Very Good", 
    interpretation: "Above average. Demonstrates to lenders that you're a very reliable borrower.",
    color: "#99cc00"
  },
  { 
    range: "800-850", 
    start: 800,
    end: 850,
    category: "Exceptional", 
    interpretation: "Well above average. Shows lenders you're an exceptional borrower.",
    color: "#00cc66"
  }
];

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Track active segment for hover state
let activeRangeIndex = -1;
let totalScoreRange = 850 - 300;

// Spectrum position variables - defined globally so they can be accessed across functions
let spectrumTop;
let spectrumWidth;

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  
  // Initialize spectrum position variables
  spectrumTop = margin * 2 + 10;
  spectrumWidth = canvasWidth - (margin * 2);
  
  describe('A horizontal bar showing the FICO credit score spectrum from 300 to 850, color-coded from red to green to indicate increasing creditworthiness.', LABEL);
}

function draw() {
  background('aliceblue');
  
  // Title
  fill(0);
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("FICO Credit Score Spectrum", canvasWidth/2, margin/2);
  
  // Update spectrum width in case of resize
  spectrumWidth = canvasWidth - (margin * 2);
  
  // Check mouse hover for the entire spectrum
  checkHover();
  
  // Draw spectrum bar
  drawSpectrum();
  
  // Draw info box
  drawInfoBox();
}

function checkHover() {
  // Set default (no hover)
  activeRangeIndex = -1;
  
  // Adjust the spectrum top position to match where we're actually drawing
  let adjustedSpectrumTop = spectrumTop - 30;
  
  // Only check if the mouse is within the general spectrum area
  if (mouseY >= adjustedSpectrumTop && mouseY <= adjustedSpectrumTop + spectrumHeight &&
      mouseX >= margin && mouseX <= margin + spectrumWidth) {
    
    // Calculate which score range the mouse is over
    let relativeX = mouseX - margin;
    let mouseScore = map(relativeX, 0, spectrumWidth, 300, 850);
    
    // Find which range this score falls into
    for (let i = 0; i < scoreRanges.length; i++) {
      if (mouseScore >= scoreRanges[i].start && mouseScore <= scoreRanges[i].end) {
        activeRangeIndex = i;
        break;
      }
    }
  }
}

function drawSpectrum() {
  let adjustedSpectrumTop = spectrumTop - 30;
  
  // Draw each segment
  push();
  translate(0, -30)
  noStroke();
  for (let i = 0; i < scoreRanges.length; i++) {
    let range = scoreRanges[i];
    let rangeWidth = (range.end - range.start) / totalScoreRange * spectrumWidth;
    let x = margin + ((range.start - 300) / totalScoreRange * spectrumWidth);
    
    // Highlight active segment
    if (i === activeRangeIndex) {
      fill(range.color);
      rect(x, spectrumTop - 5, rangeWidth, spectrumHeight + 10, 5);
    }
    
    // Draw normal segment
    fill(range.color);
    rect(x, spectrumTop, rangeWidth, spectrumHeight, 5);
    
    // Add score labels
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(range.range, x + rangeWidth/2, spectrumTop + spectrumHeight/2);
  }
  
  // Draw min and max labels
  fill(0);
  textSize(14);
  textAlign(LEFT, TOP);
  text("300", margin, spectrumTop + spectrumHeight + 10);
  textAlign(RIGHT, TOP);
  text("850", margin + spectrumWidth, spectrumTop + spectrumHeight + 10);
  pop();
}

function drawInfoBox() {
  let infoBoxTop = margin * 2 + spectrumHeight + 50;
  let infoBoxWidth = canvasWidth - (margin * 2);
  
  push();
  translate(0, -30);
  // Draw box
  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(margin, infoBoxTop, infoBoxWidth, infoBoxHeight, 10);
  
  // Draw content
  if (activeRangeIndex >= 0) {
    let range = scoreRanges[activeRangeIndex];
    
    // Draw color indicator
    noStroke();
    fill(range.color);
    rect(margin + 20, infoBoxTop + 20, 20, 20, 5);
    
    // Draw text
    noStroke();
    fill(0);
    textAlign(LEFT, TOP);
    textSize(20);
    text(`${range.category} (${range.range})`, margin + 50, infoBoxTop + 20);
    
    textSize(16);
    text(range.interpretation, margin + 20, infoBoxTop + 60);
  } else {
    // Default message when no segment is active
    noStroke();
    fill(100);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Hover over a section of the spectrum to see details", 
         canvasWidth/2, infoBoxTop + infoBoxHeight/2);
  }
  pop();
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  // Update spectrum position variables
  spectrumWidth = canvasWidth - (margin * 2);
  redraw();
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