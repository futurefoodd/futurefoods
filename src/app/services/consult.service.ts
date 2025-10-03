import { Injectable } from '@angular/core'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { SupabaseService } from './supabase.service'
import { UserService } from './userService.service'

export interface NutritionConsultResponse {
  success: boolean
  data?: any
  error?: any
}

@Injectable({
  providedIn: 'root'
})
export class NutritionConsultService {
  private supabase: SupabaseClient

  constructor(private supabaseService:SupabaseService, private userService:UserService) {
    this.supabase = supabaseService.client
  }

  /**
   * Insert a nutrition consultation record
   * @param values Angular form value object
   * @returns NutritionConsultResponse
   */
  async submitConsultForm(values: any): Promise<NutritionConsultResponse> {
    try {
    
      const currentUser = await this.userService.getCurrentUser()
      // console.log(currentUser.id)

      
      const { data: { user } } = await this.supabase.auth.getUser();
      console.log('Current user:', user?.id);

      const result= await this.supabase.rpc('get_uid');
      console.log("Server auth.uid():", result.data);

      

      console.log('comparison', user?.id === result.data)

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

            // Lifestyle & Habits
            activity_level: values.activityLevel,
            exercise_routine: values.exerciseRoutine,
            exercise_frequency: values.exerciseFrequency,
            job_demands: values.jobDemands,
            sleep_hours: values.sleepHours,
            smoking_vaping: values.smokingVaping,

            // Alcohol
            alcohol_types: values.alcoholGroup?.types ?? [],
            alcohol_consumption: values.alcoholGroup?.consumption ?? null,

            // Diet & Eating
            dietary_patterns: values.dietaryPatterns ?? [],
            eating_style: values.eatingStyle ?? [],
            water_intake: values.waterIntake,

            // Snacks
            snack_types: values.snackGroup?.types ?? [],
            snack_frequency: values.snackGroup?.frequency ?? null,

            // Wellness Goals
            primary_goal: values.primaryGoal,
            secondary_goals: values.secondaryGoals ?? [],
            specific_concerns: values.specificConcerns ?? [],

            // Additional Info
            supplements: values.supplements,
            family_history: values.familyHistory ?? [],

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
