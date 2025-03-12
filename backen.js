// Currency Conversion Rates
const conversionRates = {
    "INR": 1,
    "USD": 0.012,
    "EUR": 0.011,
    "GBP": 0.009
};

// Function to get currency symbol
function getCurrencySymbol(currency) {
    switch (currency) {
        case "USD": return "$";
        case "EUR": return "€";
        case "GBP": return "£";
        default: return "₹"; // Default is INR
    }
}

// Function to update values instantly on slider drag
function setupSliders() {
    document.getElementById("years").addEventListener("input", function () {
        document.getElementById("yearValue").innerText = this.value;
        calculateSIP();
    });

    document.getElementById("rate").addEventListener("input", function () {
        document.getElementById("rateValue").innerText = this.value;
        calculateSIP();
    });

    document.getElementById("sipAmount").addEventListener("input", function () {
        calculateSIP();
    });

    document.getElementById("currency").addEventListener("change", function () {
        calculateSIP();
    });
}

// Function to calculate SIP returns dynamically
function calculateSIP() {
    let sipAmount = parseFloat(document.getElementById("sipAmount").value);
    let years = parseInt(document.getElementById("years").value);
    let rate = parseFloat(document.getElementById("rate").value) / 100;
    let months = years * 12;
    let monthlyRate = rate / 12;

    let maturityAmount = sipAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    let totalInvestment = sipAmount * months;
    let totalReturns = maturityAmount - totalInvestment;

    // Get selected currency and conversion rate
    let selectedCurrency = document.getElementById("currency").value;
    let conversionRate = conversionRates[selectedCurrency];
    let symbol = getCurrencySymbol(selectedCurrency);

    // Convert values and update UI with correct currency symbol
    document.getElementById("totalInvestment").innerText = `${symbol} ${(totalInvestment * conversionRate).toFixed(2)}`;
    document.getElementById("totalReturns").innerText = `${symbol} ${(totalReturns * conversionRate).toFixed(2)}`;
    document.getElementById("maturityAmount").innerText = `${symbol} ${(maturityAmount * conversionRate).toFixed(2)}`;

    updateChart(totalInvestment * conversionRate, totalReturns * conversionRate, symbol);
}

// Chart.js for Dynamic Graph
let sipChart;
function updateChart(investment, returns, symbol) {
    let ctx = document.getElementById("sipChart").getContext("2d");

    if (sipChart) sipChart.destroy();

    sipChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: [`Total Investment (${symbol})`, `Estimated Returns (${symbol})`],
            datasets: [{
                data: [investment, returns],
                backgroundColor: ["#3498db", "#2ecc71"]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: "bottom" } }
        }
    });
}

// Initialize everything
setupSliders();
calculateSIP();
