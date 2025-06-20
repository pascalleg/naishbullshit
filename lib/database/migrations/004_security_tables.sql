-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create security_logs table
CREATE TABLE IF NOT EXISTS security_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('login', 'withdrawal', 'payment_method_change', 'suspicious_activity')),
    ip_address TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    details JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create two_factor_codes table
CREATE TABLE IF NOT EXISTS two_factor_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('withdrawal', 'payment_method_change')),
    used BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create fraud_checks table
CREATE TABLE IF NOT EXISTS fraud_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    risk_score DECIMAL(3,2) NOT NULL,
    details JSONB,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'review')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fraud_checks_updated_at
    BEFORE UPDATE ON fraud_checks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE two_factor_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_checks ENABLE ROW LEVEL SECURITY;

-- Security logs policies
CREATE POLICY "Users can view their own security logs"
    ON security_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Two-factor codes policies
CREATE POLICY "Users can view their own two-factor codes"
    ON two_factor_codes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own two-factor codes"
    ON two_factor_codes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own two-factor codes"
    ON two_factor_codes FOR UPDATE
    USING (auth.uid() = user_id);

-- Fraud checks policies
CREATE POLICY "Users can view their own fraud checks"
    ON fraud_checks FOR SELECT
    USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX idx_security_logs_type ON security_logs(type);
CREATE INDEX idx_security_logs_timestamp ON security_logs(timestamp);
CREATE INDEX idx_two_factor_codes_user_id ON two_factor_codes(user_id);
CREATE INDEX idx_two_factor_codes_token ON two_factor_codes(token);
CREATE INDEX idx_two_factor_codes_expires_at ON two_factor_codes(expires_at);
CREATE INDEX idx_fraud_checks_user_id ON fraud_checks(user_id);
CREATE INDEX idx_fraud_checks_transaction_id ON fraud_checks(transaction_id);
CREATE INDEX idx_fraud_checks_status ON fraud_checks(status); 