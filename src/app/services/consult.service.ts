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
            referred_by: values.referredBy,

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

            // Food Choices
            breakfast_food_choices: values.breakfastFoodChoices,
            lunch_food_choices: values.lunchFoodChoices,
            dinner_supper_time: values.dinnerSupperTime,
            dinner_food_choices: values.dinnerFoodChoices,
            water_beverages_per_day: values.waterBeveragesPerDay,
            cooking_oils: values.cookingOils,
            milk_non_dairy_consumption: values.milkNonDairyConsumption,
            hours_after_breakfast_hungry: values.hoursAfterBreakfastHungry,

            // Wellness Goals
            primary_goal: values.primaryGoal,
            secondary_goals: values.secondaryGoals ?? [],
            specific_concerns: values.specificConcerns ?? [],
            
            // Health & Symptoms
            low_energy_tired: values.lowEnergyTired,
            constipation_loose_motion: values.constipationLooseMotion,
            pain_discomfort_parts: values.painDiscomfortParts ?? [],
            symptoms_frequency: values.symptomsFrequency ?? [],

            // Additional Info
            supplements: values.supplements,
            family_history: values.familyHistory ?? [],

            // Health flags
            recent_hospitalisation: !!values.recentHospitalisation,
            yearly_screening: !!values.yearlyScreening,
            food_allergy: !!values.foodAllergy,
            medication: !!values.medication,
            recent_travel: !!values.recentTravel,

            // Medical Tests & History
            basic_urine_observation: values.basicUrineObservation || null,
            full_blood_urine_test_date: values.fullBloodUrineTestDate,
            date_of_hospitalisation: values.dateOfHospitalisation,

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
