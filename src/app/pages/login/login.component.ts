import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authKey: string = ''
  authService: AuthService = inject(AuthService)

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.login(this.authKey).subscribe()
    } else {
      console.error('Form is invalid, please provide an authorization key.');
    }
  }
}