import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {
  // WhatsApp number - replace with your actual WhatsApp business number
  private readonly whatsappNumber = '+60102202574';
  
  // Default messages for different contexts
  private readonly defaultMessages = {
    general: 'Hello! I\'m interested in your products. Can you help me?',
    landing: 'Hello! I\'m interested in your Pro-Collagen Soft Pastilles. Can you help me with more information?',
    product: 'Hello! I\'m interested in this product. Can you help me with more information and pricing?',
    cart: 'Hello! I\'m ready to purchase these items. Can you help me complete my order?'
  };

  /**
   * Opens WhatsApp with a pre-filled message
   * @param context - The context of the message (general, landing, product, cart)
   * @param customMessage - Optional custom message to override the default
   * @param productName - Optional product name to include in the message
   */
  openWhatsApp(context: 'general' | 'landing' | 'product' | 'cart' = 'general', customMessage?: string, productName?: string): void {
    let message = customMessage || this.defaultMessages[context];
    
    // Add product name to the message if provided
    if (productName && !customMessage) {
      message = `Hello! I'm interested in ${productName}. Can you help me with more information and pricing?`;
    }
    
    // Format the message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Opens WhatsApp with a specific product inquiry
   * @param productName - Name of the product
   * @param productPrice - Price of the product (optional)
   * @param customMessage - Custom message (optional)
   */
  openProductInquiry(productName: string, productPrice?: string, customMessage?: string): void {
    let message = customMessage;
    
    if (!message) {
      if (productPrice) {
        message = `Hello! I'm interested in ${productName} (${productPrice}). Can you help me with more information and how to purchase?`;
      } else {
        message = `Hello! I'm interested in ${productName}. Can you help me with more information and pricing?`;
      }
    }
    
    this.openWhatsApp('product', message);
  }

  /**
   * Opens WhatsApp for cart/checkout inquiries
   * @param itemCount - Number of items in cart
   * @param totalPrice - Total price (optional)
   * @param customMessage - Custom message (optional)
   */
  openCartInquiry(itemCount: number, totalPrice?: string, customMessage?: string): void {
    let message = customMessage;
    
    if (!message) {
      if (totalPrice) {
        message = `Hello! I have ${itemCount} item(s) in my cart totaling ${totalPrice}. Can you help me complete my purchase?`;
      } else {
        message = `Hello! I have ${itemCount} item(s) in my cart. Can you help me complete my purchase?`;
      }
    }
    
    this.openWhatsApp('cart', message);
  }

  /**
   * Opens WhatsApp with a general inquiry
   * @param customMessage - Custom message (optional)
   */
  openGeneralInquiry(customMessage?: string): void {
    this.openWhatsApp('general', customMessage);
  }
}
