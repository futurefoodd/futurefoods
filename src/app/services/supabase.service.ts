import { Injectable } from '@angular/core';
import {  createClient,SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.SUPABASE_KEY);
  }

  async getTodos() {
    const { data, error } = await this.supabase
      .from('todos')
      .select('*');
    if (error) throw error;
    return data;
  }

  async addTodo(title: string) {
    const { data, error } = await this.supabase
      .from('todos')
      .insert([{ title }]);
    if (error) throw error;
    return data;
  }
}
