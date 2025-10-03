import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment.development';
import { SupabaseService } from './supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { UUID } from 'crypto';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

base_url = environment.apiHost
supabase :SupabaseClient
  constructor(private supabaseService: SupabaseService) {
    this.supabase = supabaseService.client
  }

  async getNutrientsData(productId:UUID){
    try{
        let { data: Nutrients_table, error } = await this.supabase
        .from('Nutrients_table')
        .select('*')
        .eq('product_id', productId)
    
        if(error){
            console.error('Nutrients data get Error:', error)
            return { success: false, result:error }
        }
        return {success:true, result: Nutrients_table}
    }catch(err){
        console.error('getNutrientsData catch Error:', err)
        return { success: false, result: err }
    } 
  }

 async getNutrientsHeader(productId:string){
    try{
        let { data: Nitrients_table_header, error } = await this.supabase
        .from('Nutrients_table_header')
        .select('*')
        .eq('product_id', productId)
        if(error){
            console.error('Nutrients data get Error:', error)
            return { success: false, result:error }
        }
        return {success:true, result: Nitrients_table_header}
    }catch(err){
        console.error('getNutrientsHeader catch Error:', err)
        return { success: false, result: err }
    }
  }
}
