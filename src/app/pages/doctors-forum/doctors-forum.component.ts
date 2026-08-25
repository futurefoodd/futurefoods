import { Component } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DoctorsForumService } from '../../services/doctors-forum.service';

@Component({
  selector: 'app-doctors-forum',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './doctors-forum.component.html',
  styleUrl: './doctors-forum.component.scss'
})
export class DoctorsForumComponent {
  // PDF URL - can be updated to point to your PDF file
  // URL-encode spaces in the filename
  private pdfPath: string = '/PRODUCT%20TRIAL%20NUTRITIONAL%20SOFT%20PASTILLE_UTARACLINIC.pdf'; // Update this path to your actual PDF location
  pdfUrl: SafeResourceUrl;
  pdfPathForDownload: string; // Plain string path for download link

  // Reactive Form
  trialForm: FormGroup;

  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private doctorsForumService: DoctorsForumService
  ) {
    // Plain string path for download link (with spaces URL-encoded)
    this.pdfPathForDownload = '/PRODUCT%20TRIAL%20NUTRITIONAL%20SOFT%20PASTILLE_UTARACLINIC.pdf';
    // Sanitize the PDF URL for safe use in iframe
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfPath);
    
    // Initialize reactive form with validators
    this.trialForm = this.fb.group({
      // Part A: Patient Information
      name: ['', Validators.required],
      rn: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      bmi: ['', Validators.required],
      visitDate: ['', Validators.required],
      caregiver: ['', Validators.required],
      regularMedication: ['', Validators.required],
      reasonsForVisit: this.fb.group({
        chronicPain: [false],
        jointStiffness: [false],
        fallRecovery: [false],
        muscleCramps: [false],
        muscleWeakness: [false],
        osteoporosis: [false],
        sluggishDigestion: [false],
        reflux: [false],
        bloating: [false],
        badBreath: [false],
        gumIssues: [false],
        constipation: [false],
        dehydration: [false],
        fatigue: [false],
        sleepy: [false],
        perimenopause: [false],
        brainFog: [false],
        wrinkledSkin: [false],
        skinAllergies: [false],
        breakouts: [false],
        smokerCough: [false],
        others: [false]
      }),
      othersReason: [''],
      // Part B: After Intervention Assessment
      symptomChanges: this.fb.group({
        chronicPain: ['', Validators.required],
        muscleAche: ['', Validators.required],
        jointStiffness: ['', Validators.required],
        energyFatigue: ['', Validators.required],
        brainFog: ['', Validators.required],
        sleep: ['', Validators.required],
        digestiveSymptoms: ['', Validators.required],
        skinAllergies: ['', Validators.required],
        badBreath: ['', Validators.required]
      }),
      objectiveScores: this.fb.group({
        painBefore: ['', [Validators.required, this.maxScoreValidator(5)]],
        painAfter: ['', [Validators.required, this.maxScoreValidator(5)]],
        fatigueBefore: ['', [Validators.required, this.maxScoreValidator(5)]],
        fatigueAfter: ['', [Validators.required, this.maxScoreValidator(5)]],
        brainFogBefore: ['', [Validators.required, this.maxScoreValidator(5)]],
        brainFogAfter: ['', [Validators.required, this.maxScoreValidator(5)]],
        strengthMobilityBefore: ['', [Validators.required, this.maxScoreValidator(5)]],
        strengthMobilityAfter: ['', [Validators.required, this.maxScoreValidator(5)]],
        sleepQualityBefore: ['', [Validators.required, this.maxScoreValidator(5)]],
        sleepQualityAfter: ['', [Validators.required, this.maxScoreValidator(5)]],
        stressBefore: ['', [Validators.required, this.maxScoreValidator(5)]],
        stressAfter: ['', [Validators.required, this.maxScoreValidator(5)]],
        digestiveComfortBefore: ['', [Validators.required, this.maxScoreValidator(5)]],
        digestiveComfortAfter: ['', [Validators.required, this.maxScoreValidator(5)]]
      }),
      lifestyleImprovements: this.fb.group({
        reducedSmoking: ['', Validators.required],
        improvedDiet: ['', Validators.required],
        increasedActivity: ['', Validators.required],
        betterSleep: ['', Validators.required],
        consistentHydration: ['', Validators.required],
        reducedProcessedFood: ['', Validators.required]
      }),
      qualityOfLife: ['', Validators.required],
      patientFeedback: this.fb.group({
        alternativeToSupplements: ['', Validators.required],
        simpleAndEasy: ['', Validators.required],
        supportNeeded: ['', Validators.required]
      }),
      clinicianNotes: this.fb.group({
        clinicalFindings: [''],
        changesRecommended: [''],
        followUpDosage: ['']
      })
    });

    // Add conditional validator for othersReason
    this.trialForm.get('reasonsForVisit.others')?.valueChanges.subscribe(othersChecked => {
      const othersReasonControl = this.trialForm.get('othersReason');
      if (othersChecked) {
        othersReasonControl?.setValidators(Validators.required);
      } else {
        othersReasonControl?.clearValidators();
      }
      othersReasonControl?.updateValueAndValidity();
    });
  }

  async onSubmit(): Promise<void> {
    if (this.trialForm.valid) {
      try {
        const result = await this.doctorsForumService.submitProductTrialAssessment(this.trialForm.value);
        
        if (result.success) {
          console.log('Form submitted successfully:', result.data);
          // Optionally show success message to user
          alert('Assessment submitted successfully!');
          // Reset form after successful submission
          this.onResetForm();
        } else {
          console.error('Form submission error:', result.error);
          // Optionally show error message to user
          alert('Failed to submit assessment. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the assessment. Please try again.');
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.trialForm.markAllAsTouched();
      
      // Log all invalid/empty fields
      this.logInvalidFields();
      
      alert('Please fill in all required fields before submitting.');
    }
  }

  /**
   * Logs all invalid/empty fields in the form
   */
  private logInvalidFields(): void {
    const invalidFields: string[] = [];
    
    // Helper function to check a form control
    const checkControl = (control: AbstractControl | null, fieldName: string) => {
      if (control && control.invalid && (control.dirty || control.touched)) {
        invalidFields.push(fieldName);
      }
    };
    
    // Check top-level fields
    checkControl(this.trialForm.get('name'), 'Name');
    checkControl(this.trialForm.get('rn'), 'RN#');
    checkControl(this.trialForm.get('age'), 'Age');
    checkControl(this.trialForm.get('gender'), 'Gender');
    checkControl(this.trialForm.get('bmi'), 'BMI');
    checkControl(this.trialForm.get('visitDate'), 'Visit Date');
    checkControl(this.trialForm.get('caregiver'), 'Caregiver');
    checkControl(this.trialForm.get('regularMedication'), 'Regular Medication');
    checkControl(this.trialForm.get('othersReason'), 'Others Reason (when "others" is checked)');
    
    // Check reasonsForVisit group (only check othersReason if others is checked)
    const reasonsGroup = this.trialForm.get('reasonsForVisit') as FormGroup;
    if (reasonsGroup?.get('others')?.value && !this.trialForm.get('othersReason')?.value) {
      invalidFields.push('Others Reason');
    }
    
    // Check symptomChanges group
    const symptomGroup = this.trialForm.get('symptomChanges') as FormGroup;
    if (symptomGroup) {
      checkControl(symptomGroup.get('chronicPain'), 'Symptom: Chronic pain');
      checkControl(symptomGroup.get('muscleAche'), 'Symptom: Muscle ache/weakness');
      checkControl(symptomGroup.get('jointStiffness'), 'Symptom: Joint stiffness');
      checkControl(symptomGroup.get('energyFatigue'), 'Symptom: Energy/Fatigue');
      checkControl(symptomGroup.get('brainFog'), 'Symptom: Brain fog');
      checkControl(symptomGroup.get('sleep'), 'Symptom: Sleep');
      checkControl(symptomGroup.get('digestiveSymptoms'), 'Symptom: Digestive symptoms');
      checkControl(symptomGroup.get('skinAllergies'), 'Symptom: Skin allergies');
      checkControl(symptomGroup.get('badBreath'), 'Symptom: Bad breath/oral health');
    }
    
    // Check objectiveScores group
    const scoresGroup = this.trialForm.get('objectiveScores') as FormGroup;
    if (scoresGroup) {
      checkControl(scoresGroup.get('painBefore'), 'Score: Pain (Before)');
      checkControl(scoresGroup.get('painAfter'), 'Score: Pain (After)');
      checkControl(scoresGroup.get('fatigueBefore'), 'Score: Fatigue (Before)');
      checkControl(scoresGroup.get('fatigueAfter'), 'Score: Fatigue (After)');
      checkControl(scoresGroup.get('brainFogBefore'), 'Score: Brain fog (Before)');
      checkControl(scoresGroup.get('brainFogAfter'), 'Score: Brain fog (After)');
      checkControl(scoresGroup.get('strengthMobilityBefore'), 'Score: Strength/mobility (Before)');
      checkControl(scoresGroup.get('strengthMobilityAfter'), 'Score: Strength/mobility (After)');
      checkControl(scoresGroup.get('sleepQualityBefore'), 'Score: Sleep quality (Before)');
      checkControl(scoresGroup.get('sleepQualityAfter'), 'Score: Sleep quality (After)');
      checkControl(scoresGroup.get('stressBefore'), 'Score: Stress (Before)');
      checkControl(scoresGroup.get('stressAfter'), 'Score: Stress (After)');
      checkControl(scoresGroup.get('digestiveComfortBefore'), 'Score: Digestive comfort (Before)');
      checkControl(scoresGroup.get('digestiveComfortAfter'), 'Score: Digestive comfort (After)');
    }
    
    // Check lifestyleImprovements group
    const lifestyleGroup = this.trialForm.get('lifestyleImprovements') as FormGroup;
    if (lifestyleGroup) {
      checkControl(lifestyleGroup.get('reducedSmoking'), 'Lifestyle: Reduced smoking/vaping');
      checkControl(lifestyleGroup.get('improvedDiet'), 'Lifestyle: Improved diet');
      checkControl(lifestyleGroup.get('increasedActivity'), 'Lifestyle: Increased physical activity');
      checkControl(lifestyleGroup.get('betterSleep'), 'Lifestyle: Better sleep routine');
      checkControl(lifestyleGroup.get('consistentHydration'), 'Lifestyle: More consistent hydration');
      checkControl(lifestyleGroup.get('reducedProcessedFood'), 'Lifestyle: Reduced processed food/sugar');
    }
    
    // Check qualityOfLife
    checkControl(this.trialForm.get('qualityOfLife'), 'Quality of Life');
    
    // Check patientFeedback group
    const feedbackGroup = this.trialForm.get('patientFeedback') as FormGroup;
    if (feedbackGroup) {
      checkControl(feedbackGroup.get('alternativeToSupplements'), 'Feedback: Alternative to supplements');
      checkControl(feedbackGroup.get('simpleAndEasy'), 'Feedback: Simple and easy to take');
      checkControl(feedbackGroup.get('supportNeeded'), 'Feedback: Support needed');
    }
    
    // Log invalid fields
    if (invalidFields.length > 0) {
      console.group('❌ Invalid/Empty Required Fields:');
      invalidFields.forEach((field, index) => {
        console.log(`${index + 1}. ${field}`);
      });
      console.groupEnd();
      console.log(`\nTotal missing fields: ${invalidFields.length}`);
    } else {
      console.log('No invalid fields found (this should not happen if form is invalid)');
    }
  }

  onResetForm(): void {
    this.trialForm.reset();
  }

  // Helper method to check if a field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.trialForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Helper method to get nested form control
  getFormControl(path: string): AbstractControl | null {
    return this.trialForm.get(path);
  }

  // Helper method to check if nested form control is invalid
  isNestedFieldInvalid(groupName: string, fieldName: string): boolean {
    const group = this.trialForm.get(groupName) as FormGroup;
    if (!group) return false;
    const field = group.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Custom validator for maximum score
  private maxScoreValidator(maxValue: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }
      const value = Number(control.value);
      if (isNaN(value)) {
        return null; // Let other validators handle non-numeric values
      }
      if (value > maxValue) {
        return { maxScore: { max: maxValue, actual: value } };
      }
      return null;
    };
  }

  // Helper method to check if score exceeds maximum and field is touched
  isScoreExceedingMax(groupName: string, fieldName: string): boolean {
    const field = this.trialForm.get(`${groupName}.${fieldName}`);
    if (!field) return false;
    const value = Number(field.value);
    return !!(field.touched && !isNaN(value) && value > 5);
  }
}

