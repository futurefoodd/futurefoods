// cart.service.ts
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service'; // your wrapper around createClient
import { UserService } from './userService.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private supabase: SupabaseService, private userService:UserService) {}

  async addToCart(productId: string, quantity: number = 1) {
    try {
      // Get the current signed-in user
      const user = await this.userService.getCurrentUser();
      if (!user) {
        throw new Error('User not signed in. Please log in to add items to cart.');
      }

      // Check if product already exists in cart
      const existingCartItem = await this.checkProductInCart(productId);
      console.log('existingCartItem:',existingCartItem)
      
      if (existingCartItem) {
        // Update quantity if item already exists
        const newQuantity = existingCartItem.quantity + quantity;
        return await this.updateCartItemQuantity(existingCartItem.id, newQuantity);
      }

      const { data: productData, error: productError } = await this.supabase.client
        .from('Products')
        .select('id, name, price')
        .eq('id', productId)
        .single();

      if (productError || !productData) {
        throw new Error('Product not found');
      }
      // console.log('productData:', productData)

      // Insert into cart_items
      const { data, error } = await this.supabase.client
        .from('cart')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: quantity,
          item_name: productData.name, // Add the product name here
          item_price: productData.price
        })
        .select()
        .single();

      if (error) {
        console.error('Database error adding to cart:', error);
        throw new Error('Failed to add item to cart. Please try again.');
      }
      
      console.log('Successfully Added to Cart')
      return data;
    } catch (error) {
      // Log the error for debugging
      console.error('Error in addToCart:', error);
      
      // Re-throw with user-friendly message
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while adding to cart.');
      }
    }
  }

  /**
   * Check if a product already exists in the user's cart
   */
  private async checkProductInCart(productId: string) {
    try {

      const user = await this.userService.getCurrentUser();
      // console.log('userId:', userId)
      const { data, error } = await this.supabase.client
        .from('cart')
        .select('id, quantity, product_id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (error) {
        // If no rows found, return null (product not in cart)
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error checking product in cart:', error);
      return null;
    }
  }

  /**
   * Update quantity of an existing cart item
   */
  private async updateCartItemQuantity(cartItemId: string, newQuantity: number) {
    try {
      const { data, error } = await this.supabase.client
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(`Updated cart item quantity to ${newQuantity}`);
      return data;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw new Error('Failed to update cart item quantity.');
    }
  }

  async getCart() {
    const user = await this.userService.getCurrentUser();
    if (!user) throw new Error('User not signed in');

    const { data, error } = await this.supabase.client
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data;
  }
}
