import { Injectable } from '@angular/core'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { TranslateService } from '@ngx-translate/core'
import { SupabaseService } from './supabase.service'
import { UserService } from './userService.service'

export interface DetailedConsultResponse {
  success: boolean
  data?: any
  error?: any
}

@Injectable({
  providedIn: 'root'
})
export class DetailedConsultService {
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
   * Insert a detailed nutrition consultation record
   * @param values Angular form value object
   * @returns DetailedConsultResponse
   * Note: Make sure the table 'detailed_nutrition_consultations' exists in your Supabase database
   * with the appropriate columns matching the fields below
   */
  async submitDetailedForm(values: any): Promise<DetailedConsultResponse> {
    try {
      const currentUser = await this.userService.getCurrentUser()

      const { data: { user } } = await this.supabase.auth.getUser();

      const result = await this.supabase.rpc('get_uid');

      const { data, error } = await this.supabase
        .from('detailed_nutrition_consultations')
        .insert([
          {
            // Meal Choices - translate keys to actual values
            breakfast_choice: this.translateValue(values.breakfastChoice),
            lunch_choice: this.translateValue(values.lunchChoice),
            dinner_time: this.translateValue(values.dinnerTime),
            dinner_choice: this.translateValue(values.dinnerChoice),

            // Consumption Patterns - translate keys to actual values
            water_beverages: this.translateValue(values.waterBeverages),
            milk_consumption: this.translateValue(values.milkConsumption),
            cooking_oil: this.translateValue(values.cookingOil),

            // Health Symptoms - translate keys to actual values
            low_energy: this.translateValue(values.lowEnergy),
            constipation: this.translateValue(values.constipation),
            hunger_after_breakfast: this.translateValue(values.hungerAfterBreakfast),
            pain_discomfort: this.translateValue(values.painDiscomfort),
            symptoms: this.translateValue(values.symptoms),

            // Medical Information - translate keys to actual values
            urine_observation: this.translateValue(values.urineObservation),
            urine_frequency: this.translateValue(values.urineFrequency),
            blood_urine_test: this.translateValue(values.bloodUrineTest),
            hospitalisation_date: this.translateValue(values.hospitalisationDate),

            //user_id
            user_id: currentUser.id
          }
        ])
        .select() // returns inserted row(s)

      if (error) {
        console.error('Detailed Consult service Insert Error:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (err: any) {
      console.error('Detailed Consult service catch Error:', err)
      return { success: false, error: err }
    }
  }
}

