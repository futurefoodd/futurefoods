import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dietetics',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dietetics.component.html',
  styleUrl: './dietetics.component.scss'
})
export class DieteticsComponent {
  consultForm: FormGroup;

  // options
  exerciseOptions = ['Brisk Walk', 'Yoga', 'Gym Workout', 'Swimming', 'Hiking'];
  jobOptions = ['Night Shift', 'Cleaning Services', 'Construction', 'Engine Services'];
  dietPatterns = [
    'One meal per day (OMAD)',
    'Weekly Intermittent Fasting',
    'Meals after 8pm',
    'Meals with bigger portion of carbs'
  ];
  eatingStyles = ['Vegetarian', 'Vegan', 'Omnivore', 'Keto', 'Fast Food'];
  primaryGoals = ['Weight loss', 'Gut health & Regular Bowel Movement', 'Energy boost'];
  secondaryGoals = ['Muscle gain', 'Joint Comfort', 'Skin health', 'Women’s wellness'];
  concerns = ['Bloating', 'Reflux', 'Constipation', 'Hormonal Issues', 'Knee & Back Ache', 'Stress & Cramps'];
  familyHistoryOptions = ['Diabetes', 'Hypertension', 'Heart Disease', 'IBS / IBD', 'Anaemia'];

  constructor(private fb: FormBuilder) {
    this.consultForm = this.fb.group({
      name: [''],
      age: [''],
      sex: [''],
      height: [''],
      weight: [''],
      country: [''],
      activityLevel: [''],
      exerciseRoutine: [[]],
      exerciseFrequency: [''],
      jobDemands: [[]],
      sleepHours: [''],
      smokingVaping: [''],
      alcohol: [''],
      dietaryPatterns: [[]],
      eatingStyle: [[]],
      waterIntake: [''],
      snackIntake: [''],
      primaryGoal: [''],
      secondaryGoals: [[]],
      specificConcerns: [[]],
      supplements: [''],
      familyHistory: [[]],
      recentHospitalisation: [false],
      yearlyScreening: [false],
      foodAllergy: [false],
      medication: [false],
      recentTravel: [false]
    });
  }

  // handle checkbox changes
  onCheckboxChange(event: any, field: string) {
    const selected = this.consultForm.get(field)?.value || [];
    if (event.target.checked) {
      selected.push(event.target.value);
    } else {
      const index = selected.indexOf(event.target.value);
      if (index >= 0) selected.splice(index, 1);
    }
    this.consultForm.get(field)?.setValue(selected);
  }

  onSubmit() {
    console.log(this.consultForm.value);
    alert('Form submitted! Check console for details.');
  }

}
