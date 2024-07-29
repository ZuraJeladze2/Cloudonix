import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatInputModule, MatButtonModule,
    FormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  authKey: string = ''

  onSubmit() {
    console.log("form submitted!");
  }
}