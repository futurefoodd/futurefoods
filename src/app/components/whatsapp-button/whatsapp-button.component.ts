import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WhatsAppService } from '../../services/whatsapp.service';

@Component({
  selector: 'app-whatsapp-button',
  imports: [],
  templateUrl: './whatsapp-button.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './whatsapp-button.component.scss'
})
export class WhatsappButtonComponent {
  constructor(private whatsappService: WhatsAppService) {}

  openWhatsApp(): void {
    this.whatsappService.openGeneralInquiry();
  }
}
