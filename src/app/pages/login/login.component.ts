import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { AuthService } from '../../core/services/auth.service';
import { catchError, filter, tap, throwError } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authKey: string = ''
  authService: AuthService = inject(AuthService)

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.login(this.authKey).pipe(
        tap(x=>{
          console.log('Form is valid, proceeding with login...');
        })
      ).subscribe()
    } else {
      console.error('Form is invalid, please provide an authorization key.');
    }
  }
}