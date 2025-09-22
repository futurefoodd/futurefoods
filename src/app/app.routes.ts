import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { DieteticsComponent } from './pages/dietetics/dietetics.component';
import { TourComponent } from './pages/tour/tour.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'dietetics', component: DieteticsComponent },
  { path: 'tour', component: TourComponent },
  // { path: 'cart', component: CartComponent },
  // { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: '' }
];
