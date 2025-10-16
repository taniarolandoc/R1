// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Format percentage
const formatPercentage = (value, decimals = 2) => {
    return `${value.toFixed(decimals)}%`;
};

// Format date
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Calculate age from date of birth
const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

// Calculate years until retirement (assuming retirement age is 65)
const calculateYearsToRetirement = (dateOfBirth, retirementAge = 65) => {
    const age = calculateAge(dateOfBirth);
    return Math.max(0, retirementAge - age);
};

// Determine risk category based on score
const getRiskCategory = (score) => {
    if (score <= 3) return 'Conservative';
    if (score <= 6) return 'Moderate';
    return 'Aggressive';
};

// Generate recommended allocation based on risk profile
const getRecommendedAllocation = (riskCategory, age) => {
    const yearsToRetirement = 65 - age;
    
    let allocation = {};
    
    if (riskCategory === 'Conservative') {
        allocation = {
            stocks: Math.max(20, 40 - (65 - yearsToRetirement)),
            bonds: Math.min(60, 50 + (65 - yearsToRetirement)),
            realEstate: 10,
            cash: 10
        };
    } else if (riskCategory === 'Moderate') {
        allocation = {
            stocks: Math.max(40, 60 - (65 - yearsToRetirement) * 0.5),
            bonds: Math.min(40, 30 + (65 - yearsToRetirement) * 0.5),
            realEstate: 15,
            cash: 5
        };
    } else { // Aggressive
        allocation = {
            stocks: Math.max(60, 80 - (65 - yearsToRetirement) * 0.3),
            bonds: Math.min(20, 10 + (65 - yearsToRetirement) * 0.3),
            realEstate: 15,
            cash: 5
        };
    }
    
    // Normalize to 100%
    const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
    Object.keys(allocation).forEach(key => {
        allocation[key] = Math.round((allocation[key] / total) * 100);
    });
    
    return allocation;
};

// Calculate compound interest
const calculateCompoundInterest = (principal, rate, years, monthlyContribution = 0) => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    
    // Future value of initial principal
    const fvPrincipal = principal * Math.pow(1 + monthlyRate, months);
    
    // Future value of monthly contributions
    const fvContributions = monthlyContribution * 
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    return fvPrincipal + fvContributions;
};

// Generate mock performance data for demonstration
const generateMockPerformanceData = (startBalance, months = 12) => {
    const data = [];
    let balance = startBalance;
    const today = new Date();
    
    for (let i = months; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        
        // Random growth between -2% and 3%
        const growth = (Math.random() * 5 - 2) / 100;
        balance = balance * (1 + growth);
        
        data.push({
            date: date.toISOString().split('T')[0],
            balance: Math.round(balance * 100) / 100
        });
    }
    
    return data;
};

module.exports = {
    formatCurrency,
    formatPercentage,
    formatDate,
    calculateAge,
    calculateYearsToRetirement,
    getRiskCategory,
    getRecommendedAllocation,
    calculateCompoundInterest,
    generateMockPerformanceData
};
