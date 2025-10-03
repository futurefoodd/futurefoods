import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NutritionConsultService } from '../../services/consult.service';

@Component({
  selector: 'app-dietetics',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dietetics.component.html',
  styleUrl: './dietetics.component.scss'
})
export class DieteticsComponent {
  consultForm: FormGroup;

  // options
  alcohol = ['Beer', 'Wine','Liquor', 'None']
  snacks = ['Cofee', 'Tea','Sugary Drinks', 'Snacks']
  exerciseOptions = ['Brisk Walk', 'Yoga', 'Gym Workout', 'Swimming', 'Hiking', 'None'];
  jobOptions = ['Night Shift', 'Cleaning Services', 'Frequent Deadlines', 'Engine Services/Construstion Works', 'N/A'];
  dietPatterns = [
    'One Meal Per Day (OMAD)',
    'Weekly Intermittent Fasting',
    'Meals After 8pm',
    'Meals With Bigger Portion Of Carbs'
  ];
  eatingStyles = ['Vegetarian', 'Vegan', 'Omnivore', 'Keto', 'Fast Food'];
  primaryGoals = ['Weight Loss', 'Gut Health & Regular Bowel Movement', 'Energy Boost'];
  secondaryGoals = ['Muscle Gain', 'Joint Comfort', 'Skin Health', 'Women’s Wellness & Beauty'];
  concerns = ['Bloating', 'Reflux', 'Constipation', 'Hormonal Issues', 'Knee & Back Ache', 'Stress & Cramps'];
  familyHistoryOptions = ['Diabetes', 'Hypertension', 'Heart Disease', 'IBS / IBD', 'Anaemia'];

  constructor(private fb: FormBuilder, private consultFormService: NutritionConsultService) {
    this.consultForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', Validators.required],
      sex: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      country: ['', Validators.required],
      activityLevel: ['', Validators.required],
      exerciseRoutine: [[], Validators.required],
      exerciseFrequency: ['', Validators.required],
      jobDemands: [[], Validators.required],
      sleepHours: ['', Validators.required],
      smokingVaping: ['', Validators.required],
      alcoholGroup: this.fb.group({
        types: [[], Validators.required],              // checkbox selections
        consumption: ['', Validators.required],        // radio choice
      }),
      dietaryPatterns: [[], Validators.required],
      eatingStyle: [[], Validators.required],
      waterIntake: ['', Validators.required],
      // snackFrequency: ['', Validators.required],
      snackGroup: this.fb.group({
        types: [[], Validators.required],              // checkbox selections
        frequency: ['', Validators.required],        // radio choice
      }),
      primaryGoal: ['', Validators.required],
      secondaryGoals: [[], Validators.required],
      specificConcerns: [[], Validators.required],
      supplements: [''],
      familyHistory: [[]],
      recentHospitalisation: [false],
      yearlyScreening: [false],
      foodAllergy: [false],
      medication: [false],
      recentTravel: [false],
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

  async onSubmit() {
    console.log(this.consultForm.valid)
    if(this.consultForm.valid){
      console.log(this.consultForm.value);
      const result = await this.consultFormService.submitConsultForm(this.consultForm.value)
      console.log(result)
      if(result.success){
        alert('Form submitted!');
        this.consultForm.reset()
      }else {
        alert('Form submission failed!')
        console.log(result.error)
      }
    } else {
      console.log(this.consultForm.value);
      alert('Please fill up the mandatory fields!')
    }
  }

}
