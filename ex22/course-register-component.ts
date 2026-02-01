import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseRegistration } from '../models/course-register.model';

@Component({
  selector: 'app-course-register-component',
  standalone: false,
  templateUrl: './course-register-component.html',
  styleUrl: './course-register-component.css',
})
export class CourseRegisterComponent  implements OnInit {
  regForm!: FormGroup;
  resultJson: string = '';
  courses: string[] = ['Angular', 'React', 'Vue', 'Ruby', 'Python', 'NodeJS'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.regForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      course: ['Ruby', [Validators.required]],
      time: ['toi', [Validators.required]],
      agree: [false, [Validators.requiredTrue]]
    });
  }

  onSubmit(): void {
    if (this.regForm.valid) {
      const data: CourseRegistration = this.regForm.value;
      this.resultJson = JSON.stringify(data, null, 2);
    } else {
      this.regForm.markAllAsTouched();
    }
  }

  get f() {
    return this.regForm.controls;
  }
}