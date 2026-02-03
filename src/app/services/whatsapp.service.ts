import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {
  // WhatsApp number - replace with your actual WhatsApp business number
  private readonly whatsappNumber = '+60126964997';
  
  // Default messages for different contexts
  private readonly defaultMessages = {
    general: 'Hello! I\'m interested in your products.\nCan you help me?\nhttps://futurefoods.com.my',
    landing: 'Hello! I\'m interested in your Pro-Collagen Soft Pastilles.\nCan you help me with more information?\nhttps://futurefoods.com.my',
    product: 'Hello! I\'m interested in this product.\nCan you help me with more information and pricing?\nhttps://futurefoods.com.my',
    cart: 'Hello! I\'m ready to purchase these items.\nCan you help me complete my order?\nhttps://futurefoods.com.my'
  };

  /**
   * Opens WhatsApp with a pre-filled message
   * @param context - The context of the message (general, landing, product, cart)
   * @param customMessage - Optional custom message to override the default
   * @param productName - Optional product name to include in the message
   * @param phoneNumber - Optional phone number to use instead of default
   */
  openWhatsApp(context: 'general' | 'landing' | 'product' | 'cart' = 'general', customMessage?: string, productName?: string, phoneNumber?: string): void {
    let message = customMessage || this.defaultMessages[context];
    
    // Add product name to the message if provided
    if (productName && !customMessage) {
      message = `Hello! I'm interested in ${productName}. Can you help me with more information and pricing?\nhttps://futurefoods.com.my`;
    }
    
    // Use provided phone number or fall back to default
    const numberToUse = phoneNumber ?? this.whatsappNumber;
    
    // Format the message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${numberToUse}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Opens WhatsApp with a specific product inquiry
   * @param productName - Name of the product
   * @param productPrice - Price of the product (optional)
   * @param customMessage - Custom message (optional)
   * @param phoneNumber - Optional phone number to use instead of default
   */
  openProductInquiry(productName: string, productPrice?: string, customMessage?: string, phoneNumber?: string): void {
    let message = customMessage;
    
    if (!message) {
      if (productPrice) {
        message = `Hello! I'm interested in ${productName} (${productPrice}). Can you help me with more information and how to purchase?\nhttps://futurefoods.com.my`;
      } else {
        message = `Hello! I'm interested in ${productName}. Can you help me with more information and pricing?\nhttps://futurefoods.com.my`;
      }
    }
    
    this.openWhatsApp('product', message, undefined, phoneNumber);
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
        message = `Hello! I have ${itemCount} item(s) in my cart totaling ${totalPrice}. Can you help me complete my purchase?\nhttps://futurefoods.com.my`;
      } else {
        message = `Hello! I have ${itemCount} item(s) in my cart. Can you help me complete my purchase?\nhttps://futurefoods.com.my`;
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

  /**
   * Opens WhatsApp for single product purchase
   */
  openWhatsAppSingleProduct(): void {
    const message = 'Hello! I\'m interested in purchasing 1 Pro-Collagen Soft Pastilles box (RM150.00). Can you help me complete my order?\nhttps://futurefoods.com.my';
    this.openWhatsApp('landing', message);
  }

  /**
   * Opens WhatsApp for two products purchase (best value)
   */
  openWhatsAppTwoProducts(): void {
    const message = 'Hello! I\'m interested in purchasing 2 Pro-Collagen Soft Pastilles boxes (RM250.00 - Best Value Offer). Can you help me complete my order?\nhttps://futurefoods.com.my';
    this.openWhatsApp('landing', message);
  }

  /**
   * Opens WhatsApp for single product purchase with dynamic product name and price
   * @param productName - Name of the product
   * @param price - Price of the product
   * @param customMessage - Custom message (optional)
   * @param phoneNumber - Optional phone number to use instead of default
   */
  openProductSinglePurchase(productName: string, price: string, customMessage?: string, phoneNumber?: string): void {
    const message = customMessage || `Hello! I'm interested in purchasing 1 ${productName} box (${price}). Can you help me complete my order?\nhttps://futurefoods.com.my`;
    this.openWhatsApp('product', message, undefined, phoneNumber);
  }

  /**
   * Opens WhatsApp for two products purchase with dynamic product name and total
   * @param productName - Name of the product
   * @param total - Total price for two products
   * @param customMessage - Custom message (optional)
   * @param phoneNumber - Optional phone number to use instead of default
   */
  openProductTwoPurchase(productName: string, total: string, customMessage?: string, phoneNumber?: string): void {
    const message = customMessage || `Hello! I'm interested in purchasing 2 ${productName} boxes (${total} - Best Value Offer). Can you help me complete my order?\nhttps://futurefoods.com.my`;
    this.openWhatsApp('product', message, undefined, phoneNumber);
  }
}
