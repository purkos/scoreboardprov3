import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/user.model";
import { ActivatedRoute, Router } from "@angular/router";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgClass, NgIf, UpperCasePipe } from "@angular/common";

@Component({
  standalone: true,
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  imports: [
    ReactiveFormsModule,
    NgIf,
    UpperCasePipe,
    NgClass,
    MatProgressSpinnerModule,
  ],
  styleUrls: ["./auth.component.sass"],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  router = inject(Router);
  responseResult: string = "";
  errorResult: string = "";

  authForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      login: ["", [Validators.required, Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });

    this.route.params.subscribe((params) => {
      const action = params["action"];
      this.isLoginMode = action === "login";
    });
  }

  onSubmit() {
    this.clearResponse(); // Clear any previous responses

    // Ustawienia użytkownika na podstawie danych z formularza
    const email = this.authForm.value.login;
    const password = this.authForm.value.password;

    const user: User = {
      Email: email,
      Password: password
    }


    if (this.isLoginMode) {
      this.authService.login(user).subscribe(
          {
            next:() => {
              this.responseResult = "Logged in successfully. Redirecting...";
              this.redirectAfterSuccess("/");
            },
            error: (error) => {
              this.errorResult = error.message;
            }
          }
      );
    } else {
      this.authService.register(user).subscribe(
          {
            next: () => {
              this.responseResult = "Registered successfully! Redirecting to login.";
              this.redirectAfterSuccess("/");
            },
            error: (error) => {
              this.errorResult = error.message;
            }
          }
      )
    }
    this.authForm.reset();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.clearResponse();
    this.authForm.reset();
  }

  clearResponse() {
    this.errorResult = "";
    this.responseResult = "";
  }

  private redirectAfterSuccess(path: string) {
    setTimeout(() => {
      this.router.navigate([path]);
    }, 1000);
  }
}
