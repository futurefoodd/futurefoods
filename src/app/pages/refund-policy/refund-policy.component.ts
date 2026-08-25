import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-refund-policy',
  imports: [TranslatePipe],
  templateUrl: './refund-policy.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './refund-policy.component.scss'
})
export class RefundPolicyComponent {}
