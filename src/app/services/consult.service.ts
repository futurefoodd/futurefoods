import { Injectable } from '@angular/core'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { TranslateService } from '@ngx-translate/core'
import { SupabaseService } from './supabase.service'
import { UserService } from './userService.service'

export interface NutritionConsultResponse {
  success: boolean
  data?: any
  error?: any
}

export interface DetailedConsultResponse {
  success: boolean
  data?: any
  error?: any
}

export interface UnifiedConsultResponse {
  success: boolean
  data?: any
  error?: any
}

@Injectable({
  providedIn: 'root'
})
export class NutritionConsultService {
  private supabase: SupabaseClient

  constructor(
    private supabaseService: SupabaseService, 
    private userService: UserService,
    private translateService: TranslateService
  ) {
    this.supabase = supabaseService.client
  }

  /**
   * Translates a translation key to its actual value
   * If the value is not a translation key, returns it as-is
   */
  private translateValue(value: string | null | undefined): string | null {
    if (!value || typeof value !== 'string') {
      return value ?? null
    }
    
    // Check if it's a translation key (starts with 'Dietetics.')
    if (value.startsWith('Dietetics.')) {
      const translated = this.translateService.instant(value)
      // If translation returns the key itself, it means translation wasn't found
      // Return the key in that case, or you can return null
      return translated !== value ? translated : value
    }
    
    // If it's not a translation key, return as-is
    return value
  }

  /**
   * Translates an array of translation keys to their actual values
   */
  private translateArray(values: any[] | null | undefined): any[] | null {
    if (!values || !Array.isArray(values)) {
      return values ?? null
    }
    
    return values.map(value => {
      if (typeof value === 'string') {
        return this.translateValue(value)
      }
      return value
    })
  }

  /**
   * Insert a nutrition consultation record
   * @param values Angular form value object
   * @returns NutritionConsultResponse
   */
  async submitConsultForm(values: any): Promise<NutritionConsultResponse> {
    try {
    
      const currentUser = await this.userService.getCurrentUser()

      
      const { data: { user } } = await this.supabase.auth.getUser();

      const result= await this.supabase.rpc('get_uid');

      


      const { data, error } = await this.supabase
        .from('nutrition_consultations')
        .insert([
          {
            // Basic Info
            name: values.name,
            age: values.age,
            sex: values.sex,
            contact: values.contact,
            email: values.email,
            height_cm: values.height,
            weight_kg: values.weight,
            country: values.country,
            referred_by: this.translateValue(values.referredBy),

            // Lifestyle & Habits
            activity_level: values.activityLevel,
            exercise_routine: this.translateArray(values.exerciseRoutine),
            exercise_frequency: values.exerciseFrequency,
            job_demands: this.translateArray(values.jobDemands),
            sleep_hours: values.sleepHours,
            smoking_vaping: values.smokingVaping,

            // Alcohol
            alcohol_types: this.translateArray(values.alcoholGroup?.types),
            alcohol_consumption: values.alcoholGroup?.consumption ?? null,

            // Diet & Eating
            dietary_patterns: this.translateArray(values.dietaryPatterns),
            eating_style: this.translateArray(values.eatingStyle),
            water_intake: values.waterIntake,

            // Snacks
            snack_types: this.translateArray(values.snackGroup?.types),
            snack_frequency: values.snackGroup?.frequency ?? null,

            // Wellness Goals
            primary_goal: this.translateValue(values.primaryGoal),
            secondary_goals: this.translateArray(values.secondaryGoals),
            specific_concerns: this.translateArray(values.specificConcerns),

            // Additional Info
            supplements: values.supplements,
            family_history: this.translateArray(values.familyHistory),

            // Health flags
            recent_hospitalisation: !!values.recentHospitalisation,
            yearly_screening: !!values.yearlyScreening,
            food_allergy: !!values.foodAllergy,
            medication: !!values.medication,
            recent_travel: !!values.recentTravel,

            //user_id
            user_id:currentUser.id

          }
        ])
        .select() // returns inserted row(s)

      if (error) {
        console.error('Consult service Insert Error:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (err: any) {
      console.error('Consult service catch Error:', err)
      return { success: false, error: err }
    }
  }

  /**
   * Submit unified nutrition consultation with data from all 3 tabs
   * @param basicFormValues Basic form values (from consultForm)
   * @param detailedFormValues Detailed form values (from detailedForm) - optional
   * @param sampleRequestFormValues Sample request form values (from sampleRequestForm) - optional
   * @returns UnifiedConsultResponse
   */
  async submitUnifiedConsultation(
    basicFormValues: any,
    detailedFormValues?: any,
    sampleRequestFormValues?: any
  ): Promise<UnifiedConsultResponse> {
    try {
      const currentUser = await this.userService.getCurrentUser()

      // Combine all form values, prioritizing basic form values for shared fields
      const payload: any = {
        // ============================================
        // BASIC INFORMATION (Shared across all tabs)
        // ============================================
        name: basicFormValues.name || detailedFormValues?.name || sampleRequestFormValues?.name,
        age: basicFormValues.age || detailedFormValues?.age || sampleRequestFormValues?.age,
        contact: basicFormValues.contact || detailedFormValues?.contact || sampleRequestFormValues?.contact,
        email: basicFormValues.email || detailedFormValues?.email || sampleRequestFormValues?.email,
        sex: basicFormValues.sex || detailedFormValues?.sex || sampleRequestFormValues?.sex,
        height_cm: basicFormValues.height || detailedFormValues?.height || sampleRequestFormValues?.height,
        weight_kg: basicFormValues.weight || detailedFormValues?.weight || sampleRequestFormValues?.weight,
        country: basicFormValues.country || detailedFormValues?.country || sampleRequestFormValues?.country,
        referred_by: this.translateValue(
          basicFormValues.referredBy || detailedFormValues?.referredBy || sampleRequestFormValues?.referredBy
        ),
        social_media_id: basicFormValues.socialMediaId || detailedFormValues?.socialMediaId || sampleRequestFormValues?.socialMediaId || null,

        // ============================================
        // BASIC FORM TAB SPECIFIC FIELDS (Nullable)
        // ============================================
        // Lifestyle & Habits
        activity_level: basicFormValues.activityLevel || null,
        exercise_routine: this.translateArray(basicFormValues.exerciseRoutine),
        exercise_frequency: basicFormValues.exerciseFrequency || null,
        job_demands: this.translateArray(basicFormValues.jobDemands),
        sleep_hours: basicFormValues.sleepHours || null,
        smoking_vaping: basicFormValues.smokingVaping || null,

        // Alcohol Consumption
        alcohol_types: this.translateArray(basicFormValues.alcoholGroup?.types),
        alcohol_consumption: basicFormValues.alcoholGroup?.consumption || null,

        // Diet & Eating
        dietary_patterns: this.translateArray(basicFormValues.dietaryPatterns),
        eating_style: this.translateArray(basicFormValues.eatingStyle),
        water_intake: basicFormValues.waterIntake || null,

        // Snacks
        snack_types: this.translateArray(basicFormValues.snackGroup?.types),
        snack_frequency: basicFormValues.snackGroup?.frequency || null,

        // Wellness Goals
        primary_goal: this.translateValue(basicFormValues.primaryGoal),
        secondary_goals: this.translateArray(basicFormValues.secondaryGoals),
        specific_concerns: this.translateArray(basicFormValues.specificConcerns),

        // Additional Info
        supplements: basicFormValues.supplements || null,
        family_history: this.translateArray(basicFormValues.familyHistory),

        // Health flags
        recent_hospitalisation: !!basicFormValues.recentHospitalisation,
        yearly_screening: !!basicFormValues.yearlyScreening,
        food_allergy: !!basicFormValues.foodAllergy,
        medication: !!basicFormValues.medication,
        recent_travel: !!basicFormValues.recentTravel,

        // ============================================
        // DETAILED FORM TAB SPECIFIC FIELDS (Nullable)
        // Metabolic Health Survey
        // ============================================
        // Meal Choices
        breakfast_choice: detailedFormValues ? this.translateValue(detailedFormValues.breakfastChoice) : null,
        lunch_choice: detailedFormValues ? this.translateValue(detailedFormValues.lunchChoice) : null,
        dinner_time: detailedFormValues ? this.translateValue(detailedFormValues.dinnerTime) : null,
        dinner_choice: detailedFormValues ? this.translateValue(detailedFormValues.dinnerChoice) : null,

        // Consumption Patterns
        water_beverages: detailedFormValues ? this.translateValue(detailedFormValues.waterBeverages) : null,
        milk_consumption: detailedFormValues ? this.translateValue(detailedFormValues.milkConsumption) : null,
        cooking_oil: detailedFormValues ? this.translateValue(detailedFormValues.cookingOil) : null,

        // Health Symptoms
        low_energy: detailedFormValues ? this.translateValue(detailedFormValues.lowEnergy) : null,
        constipation: detailedFormValues ? this.translateValue(detailedFormValues.constipation) : null,
        hunger_after_breakfast: detailedFormValues ? this.translateValue(detailedFormValues.hungerAfterBreakfast) : null,
        pain_discomfort: detailedFormValues ? this.translateValue(detailedFormValues.painDiscomfort) : null,
        symptoms: detailedFormValues ? this.translateValue(detailedFormValues.symptoms) : null,

        // Medical Information
        urine_observation: detailedFormValues ? this.translateValue(detailedFormValues.urineObservation) : null,
        urine_frequency: detailedFormValues ? this.translateValue(detailedFormValues.urineFrequency) : null,
        blood_urine_test: detailedFormValues ? this.translateValue(detailedFormValues.bloodUrineTest) : null,
        hospitalisation_date: detailedFormValues ? this.translateValue(detailedFormValues.hospitalisationDate) : null,

        // ============================================
        // SAMPLE REQUEST TAB SPECIFIC FIELDS (Nullable)
        // ============================================
        address: sampleRequestFormValues?.address || null,
        message: sampleRequestFormValues?.message || null,

        // User ID
        user_id: currentUser.id
      }

      const { data, error } = await this.supabase
        .from('unified_nutrition_consultations')
        .insert([payload])
        .select() // returns inserted row(s)

      if (error) {
        console.error('Unified Consult service Insert Error:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (err: any) {
      console.error('Unified Consult service catch Error:', err)
      return { success: false, error: err }
    }
  }
}
