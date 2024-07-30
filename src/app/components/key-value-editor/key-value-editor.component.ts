// key-value-editor.component.ts
import { KeyValuePipe, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-key-value-editor',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, NgFor],
  templateUrl: './key-value-editor.component.html',
  styleUrl: './key-value-editor.component.scss'
})
export class KeyValueEditorComponent {
  @Input() customProperties!: FormArray;
  @Output() customPropertiesChange = new EventEmitter<FormArray>();
  fb: FormBuilder = inject(FormBuilder)
  pairForm: FormGroup = this.fb.group({
    key: ['', Validators.required],
    value: ['', Validators.required]
  })
  addProperty() {
    this.customProperties.push(this.pairForm);
    this.customPropertiesChange.emit(this.customProperties);
  }

  deleteProperty(index: number) {
    this.customProperties.removeAt(index);
    this.customPropertiesChange.emit(this.customProperties);
  }
}