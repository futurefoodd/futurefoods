-- Create detailed_nutrition_consultations table
-- This table stores detailed dietary assessment data from the Detailed Dietary Assessment form

CREATE TABLE IF NOT EXISTS detailed_nutrition_consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- User reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
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
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_detailed_nutrition_consultations_user_id 
ON detailed_nutrition_consultations(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_detailed_nutrition_consultations_created_at 
ON detailed_nutrition_consultations(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_detailed_nutrition_consultations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_detailed_nutrition_consultations_updated_at
BEFORE UPDATE ON detailed_nutrition_consultations
FOR EACH ROW
EXECUTE FUNCTION update_detailed_nutrition_consultations_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE detailed_nutrition_consultations ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can insert their own records
CREATE POLICY "Users can insert their own detailed nutrition consultations"
ON detailed_nutrition_consultations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can view their own records
CREATE POLICY "Users can view their own detailed nutrition consultations"
ON detailed_nutrition_consultations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy: Users can update their own records
CREATE POLICY "Users can update their own detailed nutrition consultations"
ON detailed_nutrition_consultations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own records
CREATE POLICY "Users can delete their own detailed nutrition consultations"
ON detailed_nutrition_consultations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Optional: Add comments to columns for documentation
COMMENT ON TABLE detailed_nutrition_consultations IS 'Stores detailed dietary assessment data from the Detailed Dietary Assessment form';
COMMENT ON COLUMN detailed_nutrition_consultations.breakfast_choice IS 'Food choice mostly consumed for breakfast';
COMMENT ON COLUMN detailed_nutrition_consultations.lunch_choice IS 'Food choice mostly consumed for lunch';
COMMENT ON COLUMN detailed_nutrition_consultations.dinner_time IS 'Timing of dinner and/or supper';
COMMENT ON COLUMN detailed_nutrition_consultations.dinner_choice IS 'Food choice mostly consumed for dinner';
COMMENT ON COLUMN detailed_nutrition_consultations.water_beverages IS 'Daily water or beverage consumption amount';
COMMENT ON COLUMN detailed_nutrition_consultations.milk_consumption IS 'Milk or non-dairy creamer consumption pattern';
COMMENT ON COLUMN detailed_nutrition_consultations.cooking_oil IS 'Choice of cooking oils used';
COMMENT ON COLUMN detailed_nutrition_consultations.low_energy IS 'Frequency and timing of low energy or tiredness';
COMMENT ON COLUMN detailed_nutrition_consultations.constipation IS 'Frequency of constipation or loose motion';
COMMENT ON COLUMN detailed_nutrition_consultations.hunger_after_breakfast IS 'Time after early breakfast when hunger begins';
COMMENT ON COLUMN detailed_nutrition_consultations.pain_discomfort IS 'Body parts experiencing pain or discomfort more than 3 times per week';
COMMENT ON COLUMN detailed_nutrition_consultations.symptoms IS 'Symptoms experienced 2 or more days per week';
COMMENT ON COLUMN detailed_nutrition_consultations.urine_observation IS 'Basic urine observation test results (optional)';
COMMENT ON COLUMN detailed_nutrition_consultations.urine_frequency IS 'Urine frequency pattern';
COMMENT ON COLUMN detailed_nutrition_consultations.blood_urine_test IS 'When full blood and urine test was done';
COMMENT ON COLUMN detailed_nutrition_consultations.hospitalisation_date IS 'Date of hospitalisation';


