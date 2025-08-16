import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  isMenuOpen = false;
  checkoutForm: FormGroup;
  items: CartItem[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.checkoutForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['Malaysia', Validators.required],
      paymentMethod: ['card', Validators.required]
    });
  }

  ngOnInit(): void {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        this.items = JSON.parse(stored) as CartItem[];
      }
    } catch {}
    if (this.items.length === 0) {
      this.items = [
        { id: 'classroom-wellbeing', name: 'Classroom Wellbeing', price: 49.9, quantity: 1, image: 'nvc_white_cap_no_background.png' }
      ];
    }
  }

  get subtotal(): number {
    return this.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
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

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    // Placeholder: simulate order placement
    console.log('Order placed', {
      form: this.checkoutForm.value,
      items: this.items,
      total: this.total
    });
    alert('Thank you! Your order has been placed.');
  }
}


