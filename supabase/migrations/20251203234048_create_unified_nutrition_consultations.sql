-- Create unified_nutrition_consultations table
-- This table stores all data from all 3 tabs: Basic Form, Detailed Form (Metabolic Health Survey), and Sample Request
-- Tab-specific fields are nullable to allow partial submissions

CREATE TABLE IF NOT EXISTS unified_nutrition_consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- User reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- ============================================
  -- BASIC INFORMATION (Shared across all tabs)
  -- ============================================
  name TEXT NOT NULL,
  age INTEGER,
  contact TEXT NOT NULL,
  email TEXT NOT NULL,
  sex TEXT NOT NULL,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  country TEXT NOT NULL,
  referred_by TEXT NOT NULL,
  social_media_id TEXT, -- Optional
  
  -- ============================================
  -- BASIC FORM TAB SPECIFIC FIELDS (Nullable)
  -- ============================================
  -- Lifestyle & Habits
  activity_level TEXT,
  exercise_routine JSONB, -- Array of exercise types
  exercise_frequency TEXT,
  job_demands JSONB, -- Array of job demands
  sleep_hours TEXT,
  smoking_vaping TEXT,
  
  -- Alcohol Consumption
  alcohol_types JSONB, -- Array of alcohol types
  alcohol_consumption TEXT, -- Frequency (Social, Habitual, None)
  
  -- Diet & Eating
  dietary_patterns JSONB, -- Array of dietary patterns
  eating_style JSONB, -- Array of eating styles
  water_intake TEXT,
  
  -- Snacks
  snack_types JSONB, -- Array of snack types
  snack_frequency TEXT, -- Frequency (When Stressed, Often, Sometimes, Rarely)
  
  -- Wellness Goals
  primary_goal TEXT,
  secondary_goals JSONB, -- Array of secondary goals
  specific_concerns JSONB, -- Array of specific concerns
  
  -- Additional Info
  supplements TEXT,
  family_history JSONB, -- Array of family history items
  
  -- Health Flags
  recent_hospitalisation BOOLEAN DEFAULT FALSE,
  yearly_screening BOOLEAN DEFAULT FALSE,
  food_allergy BOOLEAN DEFAULT FALSE,
  medication BOOLEAN DEFAULT FALSE,
  recent_travel BOOLEAN DEFAULT FALSE,
  
  -- ============================================
  -- DETAILED FORM TAB SPECIFIC FIELDS (Nullable)
  -- Metabolic Health Survey
  -- ============================================
  -- Meal Choices
  breakfast_choice TEXT,
  lunch_choice TEXT,
  dinner_time TEXT,
  dinner_choice TEXT,
  
  -- Consumption Patterns
  water_beverages TEXT,
  milk_consumption TEXT,
  cooking_oil TEXT,
  
  -- Health Symptoms
  low_energy TEXT,
  constipation TEXT,
  hunger_after_breakfast TEXT,
  pain_discomfort TEXT,
  symptoms TEXT,
  
  -- Medical Information
  urine_observation TEXT,
  urine_frequency TEXT,
  blood_urine_test TEXT,
  hospitalisation_date TEXT,
  
  -- ============================================
  -- SAMPLE REQUEST TAB SPECIFIC FIELDS (Nullable)
  -- ============================================
  address TEXT,
  message TEXT,
  
  -- ============================================
  -- METADATA
  -- ============================================
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_unified_nutrition_consultations_user_id 
ON unified_nutrition_consultations(user_id);

CREATE INDEX IF NOT EXISTS idx_unified_nutrition_consultations_created_at 
ON unified_nutrition_consultations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_unified_nutrition_consultations_email 
ON unified_nutrition_consultations(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_unified_nutrition_consultations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_unified_nutrition_consultations_updated_at
BEFORE UPDATE ON unified_nutrition_consultations
FOR EACH ROW
EXECUTE FUNCTION update_unified_nutrition_consultations_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE unified_nutrition_consultations ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can insert their own records
CREATE POLICY "Users can insert their own unified nutrition consultations"
ON unified_nutrition_consultations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can view their own records
CREATE POLICY "Users can view their own unified nutrition consultations"
ON unified_nutrition_consultations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy: Users can update their own records
CREATE POLICY "Users can update their own unified nutrition consultations"
ON unified_nutrition_consultations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own records
CREATE POLICY "Users can delete their own unified nutrition consultations"
ON unified_nutrition_consultations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE unified_nutrition_consultations IS 'Unified table storing all data from Basic Form, Detailed Form (Metabolic Health Survey), and Sample Request tabs. Tab-specific fields are nullable to allow partial submissions.';

COMMENT ON COLUMN unified_nutrition_consultations.social_media_id IS 'Optional social media identifier';
COMMENT ON COLUMN unified_nutrition_consultations.exercise_routine IS 'Array of exercise routines (Basic Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.job_demands IS 'Array of job demands or hazards (Basic Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.alcohol_types IS 'Array of alcohol types consumed (Basic Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.dietary_patterns IS 'Array of dietary patterns (Basic Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.eating_style IS 'Array of eating styles (Basic Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.snack_types IS 'Array of snack types (Basic Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.secondary_goals IS 'Array of secondary wellness goals (Basic Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.specific_concerns IS 'Array of specific health concerns (Basic Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.family_history IS 'Array of family health history items (Basic Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.breakfast_choice IS 'Food choice mostly consumed for breakfast (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.lunch_choice IS 'Food choice mostly consumed for lunch (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.dinner_time IS 'Timing of dinner and/or supper (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.dinner_choice IS 'Food choice mostly consumed for dinner (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.water_beverages IS 'Daily water or beverage consumption amount (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.milk_consumption IS 'Milk or non-dairy creamer consumption pattern (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.cooking_oil IS 'Choice of cooking oils used (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.low_energy IS 'Frequency and timing of low energy or tiredness (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.constipation IS 'Frequency of constipation or loose motion (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.hunger_after_breakfast IS 'Time after early breakfast when hunger begins (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.pain_discomfort IS 'Body parts experiencing pain or discomfort more than 3 times per week (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.symptoms IS 'Symptoms experienced 2 or more days per week (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.urine_observation IS 'Basic urine observation test results (Detailed Form tab, optional)';
COMMENT ON COLUMN unified_nutrition_consultations.urine_frequency IS 'Urine frequency pattern (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.blood_urine_test IS 'When full blood and urine test was done (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.hospitalisation_date IS 'Date of hospitalisation (Detailed Form tab)';
COMMENT ON COLUMN unified_nutrition_consultations.address IS 'Address for sample delivery (Sample Request tab, optional)';
COMMENT ON COLUMN unified_nutrition_consultations.message IS 'Additional message for sample request (Sample Request tab, optional)';

