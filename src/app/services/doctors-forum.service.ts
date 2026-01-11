import { Injectable } from '@angular/core'
import { SupabaseClient } from '@supabase/supabase-js'
import { SupabaseService } from './supabase.service'
import { UserService } from './userService.service'

export interface ProductTrialAssessmentResponse {
  success: boolean
  data?: any
  error?: any
}

@Injectable({
  providedIn: 'root'
})
export class DoctorsForumService {
  private supabase: SupabaseClient

  constructor(
    private supabaseService: SupabaseService,
    private userService: UserService
  ) {
    this.supabase = supabaseService.client
  }

  /**
   * Submit product trial assessment form
   * @param formValues Angular form value object from trialForm
   * @returns ProductTrialAssessmentResponse
   */
  async submitProductTrialAssessment(formValues: any): Promise<ProductTrialAssessmentResponse> {
    try {
      const currentUser = await this.userService.getCurrentUser()

      const payload = {
        // Part A: Patient Information
        name: formValues.name,
        rn: formValues.rn,
        age: formValues.age,
        gender: formValues.gender,
        bmi: formValues.bmi,
        visit_date: formValues.visitDate,
        caregiver: formValues.caregiver,
        regular_medication: formValues.regularMedication,

        // Reasons for Visit (boolean flags)
        reason_chronic_pain: formValues.reasonsForVisit?.chronicPain || false,
        reason_joint_stiffness: formValues.reasonsForVisit?.jointStiffness || false,
        reason_fall_recovery: formValues.reasonsForVisit?.fallRecovery || false,
        reason_muscle_cramps: formValues.reasonsForVisit?.muscleCramps || false,
        reason_muscle_weakness: formValues.reasonsForVisit?.muscleWeakness || false,
        reason_osteoporosis: formValues.reasonsForVisit?.osteoporosis || false,
        reason_sluggish_digestion: formValues.reasonsForVisit?.sluggishDigestion || false,
        reason_reflux: formValues.reasonsForVisit?.reflux || false,
        reason_bloating: formValues.reasonsForVisit?.bloating || false,
        reason_bad_breath: formValues.reasonsForVisit?.badBreath || false,
        reason_gum_issues: formValues.reasonsForVisit?.gumIssues || false,
        reason_constipation: formValues.reasonsForVisit?.constipation || false,
        reason_dehydration: formValues.reasonsForVisit?.dehydration || false,
        reason_fatigue: formValues.reasonsForVisit?.fatigue || false,
        reason_sleepy: formValues.reasonsForVisit?.sleepy || false,
        reason_perimenopause: formValues.reasonsForVisit?.perimenopause || false,
        reason_brain_fog: formValues.reasonsForVisit?.brainFog || false,
        reason_wrinkled_skin: formValues.reasonsForVisit?.wrinkledSkin || false,
        reason_skin_allergies: formValues.reasonsForVisit?.skinAllergies || false,
        reason_breakouts: formValues.reasonsForVisit?.breakouts || false,
        reason_smoker_cough: formValues.reasonsForVisit?.smokerCough || false,
        reason_others: formValues.reasonsForVisit?.others || false,
        others_reason: formValues.othersReason || null,

        // Part B: Symptom Changes
        symptom_chronic_pain: formValues.symptomChanges?.chronicPain || null,
        symptom_muscle_ache: formValues.symptomChanges?.muscleAche || null,
        symptom_joint_stiffness: formValues.symptomChanges?.jointStiffness || null,
        symptom_energy_fatigue: formValues.symptomChanges?.energyFatigue || null,
        symptom_brain_fog: formValues.symptomChanges?.brainFog || null,
        symptom_sleep: formValues.symptomChanges?.sleep || null,
        symptom_digestive: formValues.symptomChanges?.digestiveSymptoms || null,
        symptom_skin_allergies: formValues.symptomChanges?.skinAllergies || null,
        symptom_bad_breath: formValues.symptomChanges?.badBreath || null,

        // Objective Follow-Up Scores (Before/After 1-5)
        score_pain_before: formValues.objectiveScores?.painBefore || null,
        score_pain_after: formValues.objectiveScores?.painAfter || null,
        score_fatigue_before: formValues.objectiveScores?.fatigueBefore || null,
        score_fatigue_after: formValues.objectiveScores?.fatigueAfter || null,
        score_brain_fog_before: formValues.objectiveScores?.brainFogBefore || null,
        score_brain_fog_after: formValues.objectiveScores?.brainFogAfter || null,
        score_strength_mobility_before: formValues.objectiveScores?.strengthMobilityBefore || null,
        score_strength_mobility_after: formValues.objectiveScores?.strengthMobilityAfter || null,
        score_sleep_quality_before: formValues.objectiveScores?.sleepQualityBefore || null,
        score_sleep_quality_after: formValues.objectiveScores?.sleepQualityAfter || null,
        score_stress_before: formValues.objectiveScores?.stressBefore || null,
        score_stress_after: formValues.objectiveScores?.stressAfter || null,
        score_digestive_comfort_before: formValues.objectiveScores?.digestiveComfortBefore || null,
        score_digestive_comfort_after: formValues.objectiveScores?.digestiveComfortAfter || null,

        // Lifestyle Improvements
        lifestyle_reduced_smoking: formValues.lifestyleImprovements?.reducedSmoking || null,
        lifestyle_improved_diet: formValues.lifestyleImprovements?.improvedDiet || null,
        lifestyle_increased_activity: formValues.lifestyleImprovements?.increasedActivity || null,
        lifestyle_better_sleep: formValues.lifestyleImprovements?.betterSleep || null,
        lifestyle_consistent_hydration: formValues.lifestyleImprovements?.consistentHydration || null,
        lifestyle_reduced_processed_food: formValues.lifestyleImprovements?.reducedProcessedFood || null,

        // Quality of Life
        quality_of_life: formValues.qualityOfLife || null,

        // Patient Feedback
        feedback_alternative_supplements: formValues.patientFeedback?.alternativeToSupplements || null,
        feedback_simple_easy: formValues.patientFeedback?.simpleAndEasy || null,
        feedback_support_needed: formValues.patientFeedback?.supportNeeded || null,

        // Clinician Notes (optional)
        clinician_clinical_findings: formValues.clinicianNotes?.clinicalFindings || null,
        clinician_changes_recommended: formValues.clinicianNotes?.changesRecommended || null,
        clinician_follow_up_dosage: formValues.clinicianNotes?.followUpDosage || null,

        // User ID
        user_id: currentUser.id
      }

      const { data, error } = await this.supabase
        .from('product_trial_assessments')
        .insert([payload])
        .select() // returns inserted row(s)

        console.log('data:', data)
      if (error) {
        console.error('Product Trial Assessment Insert Error:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (err: any) {
      console.error('Product Trial Assessment catch Error:', err)
      return { success: false, error: err }
    }
  }
}
