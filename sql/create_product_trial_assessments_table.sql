-- Create table for Product Trial Assessments
-- This table stores data from the Senior Doctor Product Trial form

CREATE TABLE IF NOT EXISTS product_trial_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Part A: Patient Information
  name TEXT NOT NULL,
  rn TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  bmi TEXT NOT NULL,
  visit_date DATE NOT NULL,
  caregiver TEXT NOT NULL,
  regular_medication TEXT NOT NULL,
  
  -- Reasons for Visit (boolean flags)
  reason_chronic_pain BOOLEAN DEFAULT FALSE NOT NULL,
  reason_joint_stiffness BOOLEAN DEFAULT FALSE NOT NULL,
  reason_fall_recovery BOOLEAN DEFAULT FALSE NOT NULL,
  reason_muscle_cramps BOOLEAN DEFAULT FALSE NOT NULL,
  reason_muscle_weakness BOOLEAN DEFAULT FALSE NOT NULL,
  reason_osteoporosis BOOLEAN DEFAULT FALSE NOT NULL,
  reason_sluggish_digestion BOOLEAN DEFAULT FALSE NOT NULL,
  reason_reflux BOOLEAN DEFAULT FALSE NOT NULL,
  reason_bloating BOOLEAN DEFAULT FALSE NOT NULL,
  reason_bad_breath BOOLEAN DEFAULT FALSE NOT NULL,
  reason_gum_issues BOOLEAN DEFAULT FALSE NOT NULL,
  reason_constipation BOOLEAN DEFAULT FALSE NOT NULL,
  reason_dehydration BOOLEAN DEFAULT FALSE NOT NULL,
  reason_fatigue BOOLEAN DEFAULT FALSE NOT NULL,
  reason_sleepy BOOLEAN DEFAULT FALSE NOT NULL,
  reason_perimenopause BOOLEAN DEFAULT FALSE NOT NULL,
  reason_brain_fog BOOLEAN DEFAULT FALSE NOT NULL,
  reason_wrinkled_skin BOOLEAN DEFAULT FALSE NOT NULL,
  reason_skin_allergies BOOLEAN DEFAULT FALSE NOT NULL,
  reason_breakouts BOOLEAN DEFAULT FALSE NOT NULL,
  reason_smoker_cough BOOLEAN DEFAULT FALSE NOT NULL,
  reason_others BOOLEAN DEFAULT FALSE NOT NULL,
  others_reason TEXT,
  
  -- Part B: Symptom Changes (worse, noChange, slightlyBetter, muchBetter)
  symptom_chronic_pain TEXT NOT NULL,
  symptom_muscle_ache TEXT NOT NULL,
  symptom_joint_stiffness TEXT NOT NULL,
  symptom_energy_fatigue TEXT NOT NULL,
  symptom_brain_fog TEXT NOT NULL,
  symptom_sleep TEXT NOT NULL,
  symptom_digestive TEXT NOT NULL,
  symptom_skin_allergies TEXT NOT NULL,
  symptom_bad_breath TEXT NOT NULL,
  
  -- Objective Follow-Up Scores (1-5 scale)
  score_pain_before INTEGER NOT NULL CHECK (score_pain_before >= 1 AND score_pain_before <= 5),
  score_pain_after INTEGER NOT NULL CHECK (score_pain_after >= 1 AND score_pain_after <= 5),
  score_fatigue_before INTEGER NOT NULL CHECK (score_fatigue_before >= 1 AND score_fatigue_before <= 5),
  score_fatigue_after INTEGER NOT NULL CHECK (score_fatigue_after >= 1 AND score_fatigue_after <= 5),
  score_brain_fog_before INTEGER NOT NULL CHECK (score_brain_fog_before >= 1 AND score_brain_fog_before <= 5),
  score_brain_fog_after INTEGER NOT NULL CHECK (score_brain_fog_after >= 1 AND score_brain_fog_after <= 5),
  score_strength_mobility_before INTEGER NOT NULL CHECK (score_strength_mobility_before >= 1 AND score_strength_mobility_before <= 5),
  score_strength_mobility_after INTEGER NOT NULL CHECK (score_strength_mobility_after >= 1 AND score_strength_mobility_after <= 5),
  score_sleep_quality_before INTEGER NOT NULL CHECK (score_sleep_quality_before >= 1 AND score_sleep_quality_before <= 5),
  score_sleep_quality_after INTEGER NOT NULL CHECK (score_sleep_quality_after >= 1 AND score_sleep_quality_after <= 5),
  score_stress_before INTEGER NOT NULL CHECK (score_stress_before >= 1 AND score_stress_before <= 5),
  score_stress_after INTEGER NOT NULL CHECK (score_stress_after >= 1 AND score_stress_after <= 5),
  score_digestive_comfort_before INTEGER NOT NULL CHECK (score_digestive_comfort_before >= 1 AND score_digestive_comfort_before <= 5),
  score_digestive_comfort_after INTEGER NOT NULL CHECK (score_digestive_comfort_after >= 1 AND score_digestive_comfort_after <= 5),
  
  -- Lifestyle Improvements (yes, no)
  lifestyle_reduced_smoking TEXT NOT NULL,
  lifestyle_improved_diet TEXT NOT NULL,
  lifestyle_increased_activity TEXT NOT NULL,
  lifestyle_better_sleep TEXT NOT NULL,
  lifestyle_consistent_hydration TEXT NOT NULL,
  lifestyle_reduced_processed_food TEXT NOT NULL,
  
  -- Quality of Life (muchWorse, noChange, slightImprovement, moderateImprovement, significantImprovement)
  quality_of_life TEXT NOT NULL,
  
  -- Patient Feedback
  feedback_alternative_supplements TEXT NOT NULL,
  feedback_simple_easy TEXT NOT NULL,
  feedback_support_needed TEXT NOT NULL,
  
  -- Clinician Notes (optional)
  clinician_clinical_findings TEXT,
  clinician_changes_recommended TEXT,
  clinician_follow_up_dosage TEXT,
  
  -- User ID (foreign key to auth.users)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_product_trial_assessments_user_id ON product_trial_assessments(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_product_trial_assessments_created_at ON product_trial_assessments(created_at DESC);

-- Create index on visit_date for filtering
CREATE INDEX IF NOT EXISTS idx_product_trial_assessments_visit_date ON product_trial_assessments(visit_date);

-- Enable Row Level Security (RLS)
ALTER TABLE product_trial_assessments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert their own records
CREATE POLICY "Users can insert their own product trial assessments"
  ON product_trial_assessments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to read their own records
CREATE POLICY "Users can read their own product trial assessments"
  ON product_trial_assessments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to update their own records
CREATE POLICY "Users can update their own product trial assessments"
  ON product_trial_assessments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own records
CREATE POLICY "Users can delete their own product trial assessments"
  ON product_trial_assessments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on row update
CREATE TRIGGER update_product_trial_assessments_updated_at
  BEFORE UPDATE ON product_trial_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments to table and columns for documentation
COMMENT ON TABLE product_trial_assessments IS 'Stores product trial assessment data from Senior Doctor Product Trial forms';
COMMENT ON COLUMN product_trial_assessments.rn IS 'Registration Number';
COMMENT ON COLUMN product_trial_assessments.bmi IS 'Body Mass Index';
COMMENT ON COLUMN product_trial_assessments.visit_date IS 'Date of patient visit';
COMMENT ON COLUMN product_trial_assessments.others_reason IS 'Text field for "others" reason for visit (required when reason_others is true)';
COMMENT ON COLUMN product_trial_assessments.symptom_chronic_pain IS 'Symptom change: worse, noChange, slightlyBetter, muchBetter';
COMMENT ON COLUMN product_trial_assessments.quality_of_life IS 'Quality of life assessment: muchWorse, noChange, slightImprovement, moderateImprovement, significantImprovement';
COMMENT ON COLUMN product_trial_assessments.lifestyle_reduced_smoking IS 'Lifestyle improvement: yes or no';
