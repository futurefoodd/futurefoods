import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-refund-policy',
  imports: [TranslatePipe],
  templateUrl: './refund-policy.component.html',
  styleUrl: './refund-policy.component.scss'
})
export class RefundPolicyComponent {}
