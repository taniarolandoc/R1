-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Risk Profiles Table
CREATE TABLE IF NOT EXISTS risk_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 1 AND risk_score <= 10),
    risk_category VARCHAR(50) NOT NULL, -- Conservative, Moderate, Aggressive
    investment_horizon INTEGER, -- Years until retirement
    monthly_income DECIMAL(12, 2),
    current_savings DECIMAL(12, 2),
    retirement_goal DECIMAL(12, 2),
    questionnaire_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create Portfolios Table
CREATE TABLE IF NOT EXISTS portfolios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_balance DECIMAL(12, 2) DEFAULT 0,
    total_contributions DECIMAL(12, 2) DEFAULT 0,
    total_returns DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create Investment Allocations Table
CREATE TABLE IF NOT EXISTS investment_allocations (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL, -- Stocks, Bonds, Real Estate, Cash, etc.
    allocation_percentage DECIMAL(5, 2) NOT NULL CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
    amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Performance History Table
CREATE TABLE IF NOT EXISTS performance_history (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    balance DECIMAL(12, 2) NOT NULL,
    daily_return DECIMAL(10, 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL, -- Rebalance, Increase Contribution, Change Allocation
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL, -- High, Medium, Low
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, implemented
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- Contribution, Withdrawal, Dividend, Fee
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Educational Content Table
CREATE TABLE IF NOT EXISTS educational_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Investment Basics, Risk Management, Retirement Planning
    content TEXT NOT NULL,
    difficulty_level VARCHAR(20), -- Beginner, Intermediate, Advanced
    read_time INTEGER, -- Minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_risk_profiles_user_id ON risk_profiles(user_id);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_investment_allocations_portfolio_id ON investment_allocations(portfolio_id);
CREATE INDEX idx_performance_history_portfolio_id ON performance_history(portfolio_id);
CREATE INDEX idx_performance_history_date ON performance_history(date);
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_transactions_portfolio_id ON transactions(portfolio_id);
CREATE INDEX idx_educational_content_category ON educational_content(category);
