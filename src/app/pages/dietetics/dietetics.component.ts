import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NutritionConsultService } from '../../services/consult.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dietetics',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './dietetics.component.html',
  styleUrl: './dietetics.component.scss'
})
export class DieteticsComponent {
  consultForm: FormGroup;

  // options
  alcohol = ['Dietetics.options.beer', 'Dietetics.options.wine','Dietetics.options.liquor', 'Dietetics.options.none']
  snacks = ['Dietetics.options.coffee', 'Dietetics.options.tea','Dietetics.options.sugaryDrinks', 'Dietetics.options.snacks']
  exerciseOptions = ['Dietetics.options.briskWalk', 'Dietetics.options.yoga', 'Dietetics.options.gymWorkout', 'Dietetics.options.swimming', 'Dietetics.options.hiking', 'Dietetics.options.none'];
  jobOptions = ['Dietetics.options.nightShift', 'Dietetics.options.cleaningServices', 'Dietetics.options.frequentDeadlines', 'Dietetics.options.engineServices', 'Dietetics.options.na'];
  dietPatterns = [
    'Dietetics.options.omad',
    'Dietetics.options.weeklyFasting',
    'Dietetics.options.mealsAfter8pm',
    'Dietetics.options.biggerCarbs'
  ];
  eatingStyles = ['Dietetics.options.vegetarian', 'Dietetics.options.vegan', 'Dietetics.options.omnivore', 'Dietetics.options.keto', 'Dietetics.options.fastFood'];
  primaryGoals = ['Dietetics.options.weightLoss', 'Dietetics.options.gutHealth', 'Dietetics.options.energyBoost'];
  secondaryGoals = ['Dietetics.options.muscleGain', 'Dietetics.options.jointComfort', 'Dietetics.options.skinHealth', 'Dietetics.options.womensWellness'];
  concerns = ['Dietetics.options.bloating', 'Dietetics.options.reflux', 'Dietetics.options.constipation', 'Dietetics.options.hormonalIssues', 'Dietetics.options.kneeBackAche', 'Dietetics.options.stressCramps'];
  familyHistoryOptions = ['Dietetics.options.diabetes', 'Dietetics.options.hypertension', 'Dietetics.options.heartDisease', 'Dietetics.options.ibsIbd', 'Dietetics.options.anaemia'];

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
