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
}
