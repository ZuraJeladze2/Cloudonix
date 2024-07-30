// key-value-editor.component.ts
import { KeyValuePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-key-value-editor',
  standalone: true,
  imports: [FormsModule, KeyValuePipe],
  templateUrl: './key-value-editor.component.html',
  styleUrl: './key-value-editor.component.scss'
})
export class KeyValueEditorComponent {
  @Input() customProperties: { [key: string]: string } = {};
  @Output() customPropertiesChange = new EventEmitter<{ [key: string]: string }>();

  addProperty() {
    this.customProperties[''] = '';
    this.customPropertiesChange.emit(this.customProperties);
  }

  updateProperty(key: string, value: string) {
    this.customProperties[key] = value;
    this.customPropertiesChange.emit(this.customProperties);
  }

  deleteProperty(key: string) {
    delete this.customProperties[key];
    this.customPropertiesChange.emit(this.customProperties);
  }
}