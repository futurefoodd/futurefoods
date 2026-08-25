import { Component } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-gut-brain-axis',
  imports: [TranslatePipe],
  templateUrl: './gut-brain-axis.component.html',
  styleUrl: './gut-brain-axis.component.scss'
})
export class GutBrainAxisComponent {
  activeTab: 'talk' = 'talk';

  setActiveTab(tab: 'talk') {
    this.activeTab = tab;
  }
}

