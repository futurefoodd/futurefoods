import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  imports: [],
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.scss'
})
export class WhatsappButtonComponent {
  
  // WhatsApp number - replace with your actual WhatsApp business number
  private whatsappNumber = '+601121092600'; // Replace with your WhatsApp number
  private defaultMessage = 'Hello! I\'m interested in your products. Can you help me?';

  openWhatsApp(): void {
    // Format the message for WhatsApp
    const message = encodeURIComponent(this.defaultMessage);
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${message}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  }
}
