import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-faq',
  imports: [TranslatePipe],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  tabs = [
    {
      "title": "Landing.FAQ.question_1.question",
      "content": "Landing.FAQ.question_1.answer",
      "value": "0",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_2.question",
      "content": "Landing.FAQ.question_2.answer",
      "value": "1",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_3.question",
      "content": "Landing.FAQ.question_3.answer",
      "value": "2",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_4.question",
      "content": "Landing.FAQ.question_4.answer",
      "value": "3",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_5.question",
      "content": "Landing.FAQ.question_5.answer",
      "value": "4",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_6.question",
      "content": "Landing.FAQ.question_6.answer",
      "value": "5",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_7.question",
      "content": "Landing.FAQ.question_7.answer",
      "value": "6",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_8.question",
      "content": "Landing.FAQ.question_8.answer",
      "value": "7",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_9.question",
      "content": "Landing.FAQ.question_9.answer",
      "value": "8",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_10.question",
      "content": "Landing.FAQ.question_10.answer",
      "value": "9",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_11.question",
      "content": "Landing.FAQ.question_11.answer",
      "value": "10",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_12.question",
      "content": "Landing.FAQ.question_12.answer",
      "value": "11",
      "isOpen": false
    },
    {
      "title": "Landing.FAQ.question_13.question",
      "content": "Landing.FAQ.question_13.answer",
      "value": "12",
      "isOpen": false
    }
  ]

  toggleAccordion(index: number): void {
    this.tabs[index].isOpen = !this.tabs[index].isOpen;
  }
}
