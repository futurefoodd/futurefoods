import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './pages/top-nav/top-nav.component';
import { FooterComponent } from './pages/footer/footer.component';
import { WhatsappButtonComponent } from './components/whatsapp-button/whatsapp-button.component';
import { SupabaseService } from './services/supabase.service';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from './services/userService.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopNavComponent, FooterComponent, WhatsappButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Futurefoods';
  user: any;

  constructor(
    private supabaseService: SupabaseService,
    private userService:UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const { data: { session } } = await this.supabaseService.client.auth.getSession();

      if (!session) {
        const { data, error } = await this.supabaseService.client.auth.signInAnonymously();
        if (error) {
          console.error('Anon sign-in failed', error);
        } else {
          this.user = data.user;
          console.log('Anon signed in:', data.user);
        }
      } else {
        this.user = session.user;
        console.log('Existing session found');
      }
    }
  }
}
