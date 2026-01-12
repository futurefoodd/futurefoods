import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { DieteticsComponent } from './pages/dietetics/dietetics.component';
import { TourComponent } from './pages/tour/tour.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { UpskillComponent } from './pages/upskill/upskill.component';
import { GutBrainAxisComponent } from './pages/gut-brain-axis/gut-brain-axis.component';
import { DoctorsForumComponent } from './pages/doctors-forum/doctors-forum.component';
import { BioTherapeuticsComponent } from './bio-therapeutics/bio-therapeutics.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'dietetics', component: DieteticsComponent },
  { path: 'tour', component: TourComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'upskill', component: UpskillComponent },
  { path: 'gut-brain-axis', component: GutBrainAxisComponent },
  { path: 'bio-therapeutics', component: BioTherapeuticsComponent },
  { path: 'doctors-forum', component: DoctorsForumComponent },
  // { path: 'cart', component: CartComponent },
  // { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: '' }
];
