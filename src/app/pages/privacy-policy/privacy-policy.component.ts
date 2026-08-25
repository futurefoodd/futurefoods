import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-policy',
  imports: [TranslatePipe],
  templateUrl: './privacy-policy.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {}
