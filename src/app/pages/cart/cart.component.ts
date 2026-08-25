import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  isMenuOpen = false;
  items: CartItem[] = [];

  ngOnInit(): void {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        this.items = JSON.parse(stored) as CartItem[];
      }
    } catch {}
    if (this.items.length === 0) {
      this.items = [
        { id: 'classroom-wellbeing', name: 'Classroom Wellbeing', price: 49.9, quantity: 1, image: 'nvc_white_cap_no_background.png' },
        { id: 'immune-support', name: 'Immune Support', price: 39.9, quantity: 2, image: 'nvc-white-cap.png' }
      ];
    }
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQty = item.quantity + change;
    if (newQty > 0) {
      item.quantity = newQty;
      this.saveCart();
    }
  }

  removeItem(itemId: string): void {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveCart();
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get shipping(): number {
    return this.subtotal >= 100 ? 0 : 8.0;
  }

  get total(): number {
    return this.subtotal + this.shipping;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
