-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'active', 'completed', 'cancelled')),
    terms JSONB NOT NULL,
    payment_terms JSONB NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT
);

-- Create contract parties table
CREATE TABLE IF NOT EXISTS contract_parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    role TEXT NOT NULL CHECK (role IN ('client', 'artist', 'venue')),
    signature TEXT,
    signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(contract_id, user_id)
);

-- Create contract attachments table
CREATE TABLE IF NOT EXISTS contract_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create contract history table
CREATE TABLE IF NOT EXISTS contract_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB,
    performed_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON contracts(created_by);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_dates ON contracts(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_contract_parties_contract_id ON contract_parties(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_parties_user_id ON contract_parties(user_id);
CREATE INDEX IF NOT EXISTS idx_contract_attachments_contract_id ON contract_attachments(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_history_contract_id ON contract_history(contract_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_contracts_updated_at
    BEFORE UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_parties_updated_at
    BEFORE UPDATE ON contract_parties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_attachments_updated_at
    BEFORE UPDATE ON contract_attachments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own contracts"
    ON contracts FOR SELECT
    USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM contract_parties
            WHERE contract_id = contracts.id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create contracts"
    ON contracts FOR INSERT
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own contracts"
    ON contracts FOR UPDATE
    USING (created_by = auth.uid());

CREATE POLICY "Users can view contract parties for their contracts"
    ON contract_parties FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM contracts
            WHERE id = contract_parties.contract_id
            AND (created_by = auth.uid() OR user_id = auth.uid())
        )
    );

CREATE POLICY "Users can add parties to their contracts"
    ON contract_parties FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM contracts
            WHERE id = contract_parties.contract_id
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update their own party status"
    ON contract_parties FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can view attachments for their contracts"
    ON contract_attachments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM contracts
            WHERE id = contract_attachments.contract_id
            AND (created_by = auth.uid() OR EXISTS (
                SELECT 1 FROM contract_parties
                WHERE contract_id = contracts.id
                AND user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Users can add attachments to their contracts"
    ON contract_attachments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM contracts
            WHERE id = contract_attachments.contract_id
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can view history for their contracts"
    ON contract_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM contracts
            WHERE id = contract_history.contract_id
            AND (created_by = auth.uid() OR EXISTS (
                SELECT 1 FROM contract_parties
                WHERE contract_id = contracts.id
                AND user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Users can add history to their contracts"
    ON contract_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM contracts
            WHERE id = contract_history.contract_id
            AND (created_by = auth.uid() OR EXISTS (
                SELECT 1 FROM contract_parties
                WHERE contract_id = contracts.id
                AND user_id = auth.uid()
            ))
        )
    ); 