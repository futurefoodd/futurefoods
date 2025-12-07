import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-gut-brain-axis',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './gut-brain-axis.component.html',
  styleUrl: './gut-brain-axis.component.scss'
})
export class GutBrainAxisComponent {
  activeTab: 'talk' | 'science' = 'talk';

  setActiveTab(tab: 'talk' | 'science') {
    this.activeTab = tab;
  }
}

