-- Create contract_templates table
CREATE TABLE IF NOT EXISTS contract_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL,
  category TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  usage_count INTEGER NOT NULL DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contract_templates_category ON contract_templates(category);
CREATE INDEX IF NOT EXISTS idx_contract_templates_created_by ON contract_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_contract_templates_is_public ON contract_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_contract_templates_usage_count ON contract_templates(usage_count);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contract_templates_updated_at
  BEFORE UPDATE ON contract_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view public templates"
  ON contract_templates
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own templates"
  ON contract_templates
  FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create templates"
  ON contract_templates
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates"
  ON contract_templates
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own templates"
  ON contract_templates
  FOR DELETE
  USING (auth.uid() = created_by);

-- Create function to increment usage count
CREATE OR REPLACE FUNCTION increment_template_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contract_templates
  SET usage_count = usage_count + 1
  WHERE id = NEW.template_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for usage count
CREATE TRIGGER increment_template_usage
  AFTER INSERT ON contracts
  FOR EACH ROW
  WHEN (NEW.template_id IS NOT NULL)
  EXECUTE FUNCTION increment_template_usage(); 