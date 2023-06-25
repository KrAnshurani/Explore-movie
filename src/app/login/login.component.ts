import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  username!: string;
  password!: string;
  loading: boolean = false;
  error!: string;

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) { }
  ngOnInit() {
    const accessToken = localStorage.getItem('auth-token');
    if (accessToken) {
      this.router.navigate(['/movies'])
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.loading = true;
    this.error = null!;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }


    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post<any>('https://demo.credy.in/api/v1/usermodule/login/', this.loginForm.value, { headers })
      .subscribe(
        response => {
          // Successful login
          localStorage.setItem('auth-token', response.data.token);
          this.router.navigate(['/movies']);
        },
        error => {
          // Failed login
          this.error = 'Incorrect username or password';
          this.loading = false;
        }
      );
  }
}
