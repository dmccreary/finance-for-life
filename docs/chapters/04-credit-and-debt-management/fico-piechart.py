import matplotlib.pyplot as plt

# Define the data and labels
labels = [
    "Payment History",
    "Amounts Owed",
    "Length of Credit History",
    "Credit Mix",
    "New Credit",
]
sizes = [35, 30, 15, 10, 10]
colors = ["#ff9999", "#66b3ff", "#99ff99", "#ffcc99", "#c2c2f0"]

# Create the pie chart
fig, ax = plt.subplots(figsize=(8, 8.4))  # Increase height by 0.4 to create space for title
wedges, texts, autotexts = ax.pie(
    sizes,
    colors=colors,
    labels=labels,
    autopct="%1.1f%%",
    startangle=140,
    textprops={"fontsize": 16, "color": "black"},
)

# Set text labels inside the pie chart to black and larger
for autotext in autotexts:
    autotext.set_color("black")
    autotext.set_fontsize(20)

# Equal aspect ratio ensures that pie chart is drawn as a circle
ax.axis("equal")

# Add a title
plt.title("FICO Score Breakdown", fontsize=26, pad=30)  # Add padding to move title away

# Save the figure with a higher resolution
plt.savefig("fico-piechart.png", dpi=300, bbox_inches="tight")

plt.show()
