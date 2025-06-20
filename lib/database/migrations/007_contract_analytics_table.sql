-- Create contract_analytics table
CREATE TABLE IF NOT EXISTS contract_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('view', 'download', 'sign', 'edit', 'share', 'print', 'export')),
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contract_analytics_contract_id ON contract_analytics(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_analytics_user_id ON contract_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_contract_analytics_action ON contract_analytics(action);
CREATE INDEX IF NOT EXISTS idx_contract_analytics_created_at ON contract_analytics(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contract_analytics_updated_at
  BEFORE UPDATE ON contract_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE contract_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own analytics"
  ON contract_analytics
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM contracts
      WHERE contracts.id = contract_analytics.contract_id
      AND (
        contracts.created_by = auth.uid() OR
        contracts.artist_id = auth.uid() OR
        contracts.venue_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create analytics for their contracts"
  ON contract_analytics
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM contracts
      WHERE contracts.id = contract_analytics.contract_id
      AND (
        contracts.created_by = auth.uid() OR
        contracts.artist_id = auth.uid() OR
        contracts.venue_id = auth.uid()
      )
    )
  );

-- Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  DELETE FROM contract_analytics
  WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Create scheduled job to run cleanup
SELECT cron.schedule(
  'cleanup-old-analytics',
  '0 0 * * 0', -- Run at midnight every Sunday
  $$SELECT cleanup_old_analytics()$$
); 