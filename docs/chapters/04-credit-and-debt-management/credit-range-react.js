import React, { useState } from 'react';

const CreditScoreSpectrum = () => {
  const [activeRange, setActiveRange] = useState(null);

  const scoreRanges = [
    { 
      range: "300-579", 
      category: "Poor", 
      interpretation: "Well below average. Demonstrates to lenders that you're a risky borrower.",
      color: "#ff4d4d",
      width: "15%"
    },
    { 
      range: "580-669", 
      category: "Fair", 
      interpretation: "Below average. Many lenders will approve loans but not at the best rates.",
      color: "#ff9933",
      width: "15%"
    },
    { 
      range: "670-739", 
      category: "Good", 
      interpretation: "Near or slightly above average. Most lenders view this as a good score.",
      color: "#ffcc00",
      width: "20%"
    },
    { 
      range: "740-799", 
      category: "Very Good", 
      interpretation: "Above average. Demonstrates to lenders that you're a very reliable borrower.",
      color: "#99cc00",
      width: "25%"
    },
    { 
      range: "800-850", 
      category: "Exceptional", 
      interpretation: "Well above average. Shows lenders you're an exceptional borrower.",
      color: "#00cc66",
      width: "25%"
    }
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Credit Score Spectrum</h2>
      
      {/* Spectrum Bar */}
      <div className="w-full h-16 flex rounded-lg overflow-hidden mb-6">
        {scoreRanges.map((range, index) => (
          <div 
            key={index}
            className="h-full flex items-center justify-center cursor-pointer transition-all duration-200 relative"
            style={{ 
              backgroundColor: range.color, 
              width: range.width,
              transform: activeRange === index ? 'translateY(-4px)' : 'none',
              boxShadow: activeRange === index ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            onMouseEnter={() => setActiveRange(index)}
            onClick={() => setActiveRange(index)}
          >
            <span className="text-white font-bold">{range.range}</span>
          </div>
        ))}
      </div>

      {/* Score Legend */}
      <div className="w-full flex justify-between text-sm mb-6">
        <span>300</span>
        <span>850</span>
      </div>
      
      {/* Info Display */}
      <div className="w-full min-h-32 p-4 border rounded-lg bg-gray-50">
        {activeRange !== null ? (
          <>
            <div className="flex items-center mb-2">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: scoreRanges[activeRange].color }}
              ></div>
              <h3 className="text-lg font-bold">{scoreRanges[activeRange].category} ({scoreRanges[activeRange].range})</h3>
            </div>
            <p>{scoreRanges[activeRange].interpretation}</p>
          </>
        ) : (
          <p className="text-center text-gray-500">Hover over or click on a section of the spectrum to see details</p>
        )}
      </div>
      
      {/* Caption */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Figure 1: FICO Score Range Chart showing the distribution of scores from Poor (300-579) to Exceptional (800-850), 
        with color coding from red to green indicating increasing creditworthiness.
      </p>
    </div>
  );
};

export default CreditScoreSpectrum;