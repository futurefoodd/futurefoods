import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private supabase: SupabaseService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private ensureBrowserAndClient(): void {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Auth is only available in the browser runtime.');
    }
    if (!this.supabase.client) {
      throw new Error('Supabase client is not initialized.');
    }
  }

  async getCurrentUser() {
    try {
      this.ensureBrowserAndClient();
      const { data, error } = await this.supabase.client.auth.getUser();
      if (error) {
        console.error('getCurrentUser error:', error);
        throw new Error('Unable to fetch current user.');
      }
      return data.user ?? null;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      if (error instanceof Error) throw error;
      throw new Error('Unexpected error fetching current user.');
    }
  }

  async getSession(){
    try{
        const { data: { session }, error } = await this.supabase.client.auth.getSession();

        if(error || !session){
            console.log('getSession:', error);
            throw new Error('Unable to get current session.');
        }
        return session ?? null
    }catch(err){
        console.log('Error in getSession.', err);
        if (err instanceof Error) throw err;
        throw new Error('Unexpected error when getting session.');
    }
  }

  async anonSignIn(){
    try{
        const { data, error } = await this.supabase.client.auth.signInAnonymously();
        if (error) {
          console.error('Anon sign-in failed', error);
          throw new Error(error.message || 'Anonymous sign-in failed.');
        }
        console.log('Anon signed in:', data.user);
        return data.user ?? null;
    } catch(error){
        console.log('Error in anonSignIn',error)
        if (error instanceof Error) throw error;
        throw new Error('Unexpected error when signing in.');
    }
  }
//   async signInWithPassword(email: string, password: string) {
//     try {
//       this.ensureBrowserAndClient();
//       const { data, error } = await this.supabase.client.auth.signInWithPassword({ email, password });
//       if (error) {
//         console.error('signInWithPassword error:', error);
//         throw new Error(error.message || 'Failed to sign in.');
//       }
//       return data;
//     } catch (error) {
//       console.error('Error in signInWithPassword:', error);
//       if (error instanceof Error) throw error;
//       throw new Error('Unexpected error during sign in.');
//     }
//   }

//   async signUpWithPassword(email: string, password: string) {
//     try {
//       this.ensureBrowserAndClient();
//       const { data, error } = await this.supabase.client.auth.signUp({ email, password });
//       if (error) {
//         console.error('signUpWithPassword error:', error);
//         throw new Error(error.message || 'Failed to create account.');
//       }
//       return data;
//     } catch (error) {
//       console.error('Error in signUpWithPassword:', error);
//       if (error instanceof Error) throw error;
//       throw new Error('Unexpected error during sign up.');
//     }
//   }

//   async signOut() {
//     try {
//       this.ensureBrowserAndClient();
//       const { error } = await this.supabase.client.auth.signOut();
//       if (error) {
//         console.error('signOut error:', error);
//         throw new Error('Failed to sign out.');
//       }
//       return true;
//     } catch (error) {
//       console.error('Error in signOut:', error);
//       if (error instanceof Error) throw error;
//       throw new Error('Unexpected error during sign out.');
//     }
//   }
}
