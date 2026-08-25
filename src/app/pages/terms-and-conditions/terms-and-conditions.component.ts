import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [TranslatePipe],
  templateUrl: './terms-and-conditions.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent {}
