# Active vs. Indexed MicroSim

<iframe src="main.html" height="540px" scrolling="no"></iframe>

<!--
![Image Name](./image.png){ width="400" }
-->

[Run the Active vs Indexed MicroSim](main.html){ .md-button .md-button--primary }
[Edit the Active vs Indexed MicroSim](https://editor.p5js.org/dmccreary/sketches/VunG-eoTK)

## Sample iframe

Include this MicroSim on your web page by just copying this line:

```html
<iframe src="https://dmccreary.github.io/finance-for-life/sims/active-vs-indexed/main.html" height="540px" scrolling="no"></iframe>
```

!!! prompt
    Please create a new p5.js MicroSim that compares two investment strategies.  The first strategy is an actively managed fund with high investment fees.  The second strategy is a zero-fee indexed fund.

    Here are the range control sliders to use:

    1. Initial Investment Amount ($1K to $50K)
    2. Annual fee - use an range that is typical of today's financial products 
    3. Investment Period (1 to 10 years)
    4. Average stock market return (pick a range from the last 20 years)

    Add a Run simulation button.

    In the drawing area, use a time-series line chart.  Show the time in the horizontal and the total investment on the vertical.  Use a red color for the actively managed fund and a green color for the no-fee index fund.

    Wrap the chart drawing with push(), translate(x,y) and pop() so it is easy to move around by changing the the translate parameters.

## Lesson Plan

**Title:** Active vs. Indexed Fund Investment Fee Comparison: MicroSim Guide

## Introduction

This interactive MicroSim demonstrates the significant impact that investment fees can have on your returns over time. By comparing an actively managed fund (which charges annual fees) with an index fund (which has minimal or no fees in this simulation), you can visualize how seemingly small percentage differences compound over years.

## Key Concepts to Understand

### Investment Funds
- **Actively Managed Funds**: Professional fund managers actively select investments, trying to outperform the market, which typically results in higher fees
- **Index Funds**: These funds simply track a market index (like the S&P 500), requiring less management and typically charging lower fees

### Investment Terminology
- **Initial Investment**: The amount of money you start with
- **Annual Fee**: The percentage charged yearly by the fund for management (actively managed funds typically charge 0.5% to 2%, while index funds might charge 0.03% to 0.2%)
- **Investment Period**: The number of years you plan to keep your money invested
- **Market Return**: The average annual percentage gain in the investment market

## How to Use the Simulator

1. **Adjust the Sliders**:

- Initial Investment: How much money you're starting with
- Annual Fee: The percentage the actively managed fund charges each year
- Investment Period: How many years you plan to invest
- Market Return: The expected annual return of the market

2. **Observe the Graph**:

- The red line shows the growth of the actively managed fund (with fees)
- The green line shows the growth of the index fund (without fees)
- The difference between these lines represents money lost to fees

3. **Analyze the Results**:

- Look at the final values of both investments
- Note the dollar difference and percentage difference
- Consider how this might impact your real-life investment decisions

## Suggested Explorations

Try these scenarios to better understand the impact of fees:

1. **Long-Term Impact**:

- Set the investment period to 30 years
- Notice how even a small fee difference grows enormously over time

2. **Fee Comparison**:

- Try different fee levels (0.5%, 1.0%, 1.5%, 2.0%)
- Observe how each 0.5% increase in fees affects your final returns

3. **Market Conditions**:

- Explore how different market returns (5%, 7%, 10%) interact with fees
- Does the impact of fees increase or decrease in better-performing markets?

4. **Initial Investment Size**:

- Compare a $5,000 investment versus a $50,000 investment
- While the percentage difference remains similar, notice the actual dollar amount difference

## Why This Matters

When you're young, time is your greatest investment advantage. Understanding how fees eat into your returns is crucial because:

1. Small percentage differences seem insignificant now but compound dramatically over decades
2. The money lost to fees also loses its opportunity to grow and compound
3. Higher fees don't necessarily guarantee better performance—many actively managed funds actually underperform their benchmark indices

## Self-Assessment Questions

1. If you invested $10,000 for 20 years with a 7% market return, approximately how much more would you have with a fee-free index fund compared to an actively managed fund charging 1.5%?

2. True or False: The percentage difference between the index fund and actively managed fund stays relatively constant regardless of the investment period.

3. Which has a bigger impact on the final difference between funds:
   a) Increasing the annual fee from 0.5% to 1%
   b) Increasing the investment period from 10 to 20 years
   c) Increasing the initial investment from $10,000 to $20,000

4. Explain why the lines on the graph diverge more rapidly in the later years than in the earlier years.

5. If your actively managed fund consistently outperformed the market by 0.5% before fees, but charged 1% in fees, would you be better off with this fund or with an index fund? Use the simulator to support your answer.

6. What would happen to the difference between the two investments if market returns were negative for several years? Would fees still matter?

7. Based on this simulation, what questions might you want to ask before investing in a mutual fund or ETF?

8. Calculate approximately how much money you would save in fees over 30 years if you invested $10,000 initially in an index fund charging 0.1% versus an actively managed fund charging 1.5%.